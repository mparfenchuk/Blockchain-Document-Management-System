import React, { Fragment, useState } from 'react';
import { withTranslation } from 'react-i18next';
import classNames from 'classnames';
import * as moment from 'moment';

import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Tooltip from '@material-ui/core/Tooltip';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import TableSortLabel from '@material-ui/core/TableSortLabel';
import Paper from '@material-ui/core/Paper';

import AssignmentIcon from '@material-ui/icons/Assignment';

import Query from '../app/graphql/components/Query'
import gql from 'graphql-tag'

import getRole from '../app/helpers/getRole'
import getType from '../app/helpers/getType'
import getLang from '../app/helpers/getLang'

// graphql queries
const getUser = gql`
  query($id: String!) {
    user(id: $id) {
        id
        firstName
        lastName
        role
        reportsCount
        createdAt
    }
  }
`;

const getUserReports = gql`
    query($id: String!, $page: Int!, $limit: Int!, $order: String!) {
        getUserReports(id: $id, page: $page, limit: $limit, order: $order) {
            docs {
                id
                type
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
        overflowX: 'auto',
    },
    reports: {
        marginTop: theme.spacing.unit * 3,
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
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    subtitle: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center'
    }
});

// component
const Employee = ({ classes, history, match: { params: { id } }, t, i18n }) => {

    // hooks
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [order, setOrder] = useState('desc');

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

    // layout for employee table
    const EmployeeTableLayout = ({ children, loaded }) => {
        return (
            <Table className={classes.table}>
                <TableHead>
                <TableRow>
                    <TableCell>{t('position')}</TableCell>
                    <TableCell>{t('name')}</TableCell>
                    <TableCell align="right">{t('numberOfReports')}</TableCell>
                    <TableCell>{t('registered')}</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {loaded ? 
                        <TableRow>
                            {children}
                        </TableRow>
                        :
                        <TableRow>
                            <TableCell 
                                component="th" 
                                scope="row"
                                colSpan={4}
                            >
                                {children}
                            </TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>
        )
    }

    // layout for table with reports
    const ReportsTableLayout = ({ children, sort }) => {
        return (
            <Table className={classes.table}>
                <TableHead>
                <TableRow>
                    <TableCell>{t('title')}</TableCell>
                    <TableCell>{t('transaction')}</TableCell>
                    <TableCell align="right">{t('versions')}</TableCell>
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
                                colSpan={4}
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
            <Paper className={classes.root}>
                <Query 
                    fetchPolicy="network-only"
                    query={getUser}
                    variables={{ id: id }}
                >
                    {({ loading, error, data, refetch }) => {
                        if (loading) return (
                            <EmployeeTableLayout>
                                {t('loading')}
                            </EmployeeTableLayout>
                        )

                        if (error) return (
                            <EmployeeTableLayout>
                                {t('failedToLoadData')} <button onClick={() => refetch()}>{t('tryAgain')}</button>
                            </EmployeeTableLayout>
                        )

                        return (
                            <EmployeeTableLayout loaded>
                                <TableCell component="th" scope="row">
                                    {getRole(data.user.role, t) === undefined ? '-' : getRole(data.user.role, t).label}
                                </TableCell>
                                <TableCell>{data.user.firstName} {data.user.lastName}</TableCell>
                                <TableCell align="right">{data.user.reportsCount}</TableCell>
                                <TableCell>{moment(data.user.createdAt, "x").locale(getLang(i18n)).format('DD MMMM YYYY')}</TableCell>
                            </EmployeeTableLayout>
                        )
                    }}
                </Query>
            </Paper>
            <div className={classes.subtitle}>
                <Typography 
                    component="h1" 
                    variant="h5"
                >
                    {t('reports')}
                </Typography>
                <Avatar className={classes.avatar}>
                    <AssignmentIcon />
                </Avatar>
            </div>
            <Paper className={classNames(classes.root, classes.reports)}>
                <Query 
                    fetchPolicy="network-only"
                    query={getUserReports}
                    variables={{ id: id, page: page + 1, limit: rowsPerPage, order: order }}
                >
                    {({ loading, error, data, refetch }) => {
                        if (loading) return (
                            <ReportsTableLayout>
                                {t('loading')}
                            </ReportsTableLayout>
                        )

                        if (error) return (
                            <ReportsTableLayout>
                                {t('failedToLoadData')} <button onClick={() => refetch()}>{t('tryAgain')}</button>
                            </ReportsTableLayout>
                        )

                        if (data.getUserReports.totalDocs === 0) return (
                            <ReportsTableLayout>
                                {t('noReports')}
                            </ReportsTableLayout>
                        )

                        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.getUserReports.totalDocs - page * rowsPerPage);
                        return (
                            <Fragment>
                                <ReportsTableLayout sort>
                                    {data.getUserReports.docs.map(row => (
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
                                            <Tooltip title={row.transactionId} aria-label={row.transactionId}>
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
                                </ReportsTableLayout>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 15]}
                                    component="div"
                                    labelRowsPerPage={t('numbersOfRows')}
                                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('from')} ${count}`}
                                    count={data.getUserReports.totalDocs}
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

export default withStyles(styles)(withTranslation()(Employee))
