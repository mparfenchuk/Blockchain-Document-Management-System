import React, { Fragment, useState } from 'react';
import { withTranslation } from 'react-i18next';
import * as moment from 'moment';

import { withStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Tooltip from '@material-ui/core/Tooltip';
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

import getRole from '../app/helpers/getRole'
import getLang from '../app/helpers/getLang'

// graphql queries
const getMe = gql`
  {
    me {
        id
    }
  }
`;

const getUsers = gql`
    query($string: String!, $page: Int!, $limit: Int!, $order: String!) {
        users(string: $string, page: $page, limit: $limit, order: $order) {
            docs {
                id
                firstName
                lastName
                role
                reportsCount
                createdAt
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
    }
});

const Employees = ({ classes, history, t, i18n }) => {

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
                    <TableCell>{t('position')}</TableCell>
                    <TableCell>{t('name')}</TableCell>
                    <TableCell align="right">{t('numberOfReports')}</TableCell>
                    {sort ? 
                        <TableCell sortDirection={order}>
                            <Tooltip
                                title={t('sort')}
                                placement="bottom-start"
                                enterDelay={300}
                            >
                                <TableSortLabel
                                    active
                                    direction={order}
                                    onClick={handleChangeOrder}
                                >
                                    {t('registered')}
                                </TableSortLabel>
                            </Tooltip>
                        </TableCell>
                        :
                        <TableCell>{t('registered')}</TableCell>
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
                                colSpan={4}
                            >
                                {children}
                            </TableCell>
                        </TableRow>
                    </TableBody>
                }
            </Table>
        )
    };

    return (
        <Fragment>
            <TextField
                margin="none"
                type="search"
                name="search"
                label={t('name')}
                autoComplete="off"
                fullWidth
                onChange={handleSearch}
            />
            <Paper className={classes.root}>
                <Query query={getMe}>
                    {({ loading: loadingMe, error: errorMe, data: dataMe, refetch: refetchMe }) => (
                        <Query 
                            fetchPolicy="network-only"
                            query={getUsers}
                            variables={{ string: string, page: page + 1, limit: rowsPerPage, order: order }}
                            skip={!dataMe}
                        >
                            {({ loading, error, data, refetch }) => {
                                if (loading || loadingMe) return (
                                    <TableLayout>
                                        {t('loading')}
                                    </TableLayout>
                                )

                                if (error || errorMe) return (
                                    <TableLayout>
                                        {t('failedToLoadData')} <button onClick={async() => { await refetchMe(); await refetch() }}>{t('tryAgain')}</button>
                                    </TableLayout>
                                )

                                const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.users.totalDocs - page * rowsPerPage);
                                return (
                                    <Fragment>
                                        <TableLayout sort>
                                            {data.users.docs.map(row => (
                                                <TableRow 
                                                    hover
                                                    key={row.id}
                                                    className={classes.tableRow}
                                                    onClick={() => history.push(row.id === dataMe.me.id ? `/profile` : `/employee/${row.id}`)}
                                                >
                                                    <TableCell 
                                                        component="th" 
                                                        scope="row"
                                                    >
                                                        {getRole(row.role, t) === undefined ? '-' : getRole(row.role, t).label}
                                                    </TableCell>
                                                    <TableCell>{row.firstName} {row.lastName}</TableCell>
                                                    <TableCell align="right">{row.reportsCount}</TableCell>
                                                    <TableCell>{moment(row.createdAt, "x").locale(getLang(i18n)).format('DD MMMM YYYY')}</TableCell>
                                                </TableRow>
                                            ))}
                                            {emptyRows > 0 && (
                                                <TableRow style={{ height: 49 * emptyRows }}>
                                                    <TableCell colSpan={4} />
                                                </TableRow>
                                            )}
                                        </TableLayout>
                                        <TablePagination
                                            rowsPerPageOptions={[5, 10, 15]}
                                            component="div"
                                            labelRowsPerPage={t('numbersOfRows')}
                                            labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('from')} ${count}`}
                                            count={data.users.totalDocs}
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
                    )}
                </Query>
            </Paper>
        </Fragment>
    )
}

export default withStyles(styles)(withTranslation()(Employees))
