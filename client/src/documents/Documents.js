import React, { Fragment, useState } from 'react';
import { withTranslation } from 'react-i18next';
import * as moment from 'moment';

import { withStyles } from '@material-ui/core/styles';
import Tooltip from '@material-ui/core/Tooltip';
import TextField from '@material-ui/core/TextField';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';

import Query from '../app/graphql/components/Query'
import gql from 'graphql-tag'

import getType from '../app/helpers/getType'
import getLang from '../app/helpers/getLang'

//  qraphql query
const getReports = gql`
    query($string: String!, $page: Int!, $limit: Int!, $order: String!) {
        getReports(string: $string, page: $page, limit: $limit, order: $order) {
            docs {
                id
                type
                author {
                    id
                    firstName
                    lastName
                    role
                }
                transactionId
                ipfsHash
                versionsCount
                createdAt
                updatedAt
            }
            totalDocs
            page
        }
    }
`;

// material ui styles
const styles = theme => ({
    root: {
        width: '100%',
        marginBottom: theme.spacing.unit * 2 * 3,
        marginTop: theme.spacing.unit * 2,
        overflowX: 'auto',
    },
    table: {
        minWidth: 700,
    },
    tableRow: {
        cursor: 'pointer'
    },
    transactionCell: {
        maxWidth: '80px',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden' 
    },
    noMaxWidth: {
        maxWidth: 'none',
    },
});

// component
const Documents = ({ classes, history, t, i18n }) => {

    // hooks
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [order, setOrder] = useState('desc');
    const [string, search] = useState('');

    // methods
    const handleChangePage = (event, page) => setPage(page)
    const handleChangeRowsPerPage = event => setRowsPerPage(event.target.value)
    const handleChangeOrder = () => {
        let newOrder = 'desc';
        if (order === 'desc') {
          newOrder = 'asc';
        }
        setOrder(newOrder)
    };
    const handleSearch = event => search(event.target.value)

    // layout for table
    const TableLayout = ({ children, sort }) => {
        return (
            <Table className={classes.table}>
                <TableHead>
                <TableRow>
                    <TableCell>{t('title')}</TableCell>
                    <TableCell>{t('author')}</TableCell>
                    <TableCell>{t('transaction')}</TableCell>
                    <TableCell align="right">{t('versions')}</TableCell>
                    {sort ? 
                        <TableCell sortDirection={order}>
                            <Tooltip
                                title={t('sort')}
                                placement="bottom-start"
                                enterDelay={300}
                                classes={{ tooltip: classes.noMaxWidth }}
                            >
                                <TableSortLabel
                                    active
                                    direction={order}
                                    onClick={handleChangeOrder}
                                >
                                    {t('created')}
                                </TableSortLabel>
                            </Tooltip>
                        </TableCell>
                        :
                        <TableCell>{t('created')}</TableCell>
                    }
                </TableRow>
                </TableHead>
                {sort ? 
                    <TableBody>
                        {children}
                    </TableBody>
                    : 
                    <TableBody>
                        <TableRow>
                            <TableCell 
                                component="th" 
                                scope="row"
                                colSpan={5}
                            >
                                {children}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                }
            </Table>
        )
    }

    return (
        <Fragment>
            <TextField
                margin="none"
                type="search"
                name="search"
                label={t('transaction')}
                autoComplete="off"
                fullWidth
                onChange={handleSearch}
            />
            <Paper className={classes.root}>
                <Query 
                    fetchPolicy="network-only"
                    query={getReports}
                    variables={{ string: string, page: page + 1, limit: rowsPerPage, order: order }}
                >
                    {({ loading, error, data, refetch }) => {
                        if (loading) return (
                            <TableLayout>
                                {t('loading')}
                            </TableLayout>
                        )

                        if (error) return (
                            <TableLayout>
                                {t('failedToLoadData')} <button onClick={() => refetch()}>{t('tryAgain')}</button>
                            </TableLayout>
                        )

                        if (data.getReports.totalDocs === 0) return (
                            <TableLayout>
                                {t('noReports')}
                            </TableLayout>
                        )

                        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.getReports.totalDocs - page * rowsPerPage);
                        return (
                            <Fragment>
                                <TableLayout sort>
                                    {data.getReports.docs.map(row => (
                                        <TableRow 
                                            key={row.id}
                                            hover
                                            className={classes.tableRow}
                                            onClick={() => history.push(`/document/${row.id}`)}
                                        >
                                            <TableCell 
                                                component="th" 
                                                scope="row"
                                            >
                                                {getType(row.type, t) === undefined ? '-' : getType(row.type, t).label}
                                            </TableCell>
                                            <TableCell>{row.author.firstName} {row.author.lastName}</TableCell>
                                            <Tooltip 
                                                title={row.transactionId} 
                                                aria-label={row.transactionId}
                                                classes={{ tooltip: classes.noMaxWidth }}
                                            >
                                                <TableCell className={classes.transactionCell}>
                                                    {row.transactionId}
                                                </TableCell>
                                            </Tooltip>
                                            <TableCell align="right">{row.versionsCount}</TableCell>
                                            <TableCell>{moment(row.createdAt, "x").locale(getLang(i18n)).fromNow()}</TableCell>
                                        </TableRow>
                                    ))}
                                    {emptyRows > 0 && (
                                        <TableRow style={{ height: 49 * emptyRows }}>
                                            <TableCell colSpan={5} />
                                        </TableRow>
                                    )}
                                </TableLayout>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 15]}
                                    component="div"
                                    labelRowsPerPage={t('numbersOfRows')}
                                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('from')} ${count}`}
                                    count={data.getReports.totalDocs}
                                    rowsPerPage={rowsPerPage}
                                    page={page}
                                    backIconButtonProps={{
                                        'aria-label': t('prevPage'),
                                    }}
                                    nextIconButtonProps={{
                                        'aria-label': t('nextPage'),
                                    }}
                                    onChangePage={handleChangePage}
                                    onChangeRowsPerPage={handleChangeRowsPerPage}
                                />
                            </Fragment>
                        )
                    }}
                </Query>
            </Paper>
        </Fragment>
    )
}

export default withStyles(styles)(withTranslation()(Documents))
