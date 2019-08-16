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
const getMe = gql`
  {
    me {
        id
        firstName
        lastName
        role
        reportsCount
        createdAt
    }
  }
`;

const getMyReports = gql`
    query($page: Int!, $limit: Int!, $order: String!) {
        getMyReports(page: $page, limit: $limit, order: $order) {
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
    },
    noMaxWidth: {
        maxWidth: 'none',
    },
});

// component
const Profile = ({classes, history, t, i18n}) => {

    // hooks
    const [page, setPage] = useState(0)
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

    // layout for profile table
    const ProfileTableLayout = ({ children, loaded }) => {
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
                    query={getMe}
                >
                    {({ loading, error, data, refetch }) => {
                        if (loading) return (
                            <ProfileTableLayout>
                                {t('loading')}
                            </ProfileTableLayout>
                        )

                        if (error) return (
                            <ProfileTableLayout>
                                {t('failedToLoadData')} <button onClick={() => refetch()}>{t('tryAgain')}</button>
                            </ProfileTableLayout>
                        )

                        return (
                            <ProfileTableLayout loaded>
                                <TableCell component="th" scope="row">
                                    {getRole(data.me.role, t) === undefined ? '-' : getRole(data.me.role, t).label}
                                </TableCell>
                                <TableCell>{data.me.firstName} {data.me.lastName}</TableCell>
                                <TableCell align="right">{data.me.reportsCount}</TableCell>
                                <TableCell>{moment(data.me.createdAt, "x").locale(getLang(i18n)).format('DD MMMM YYYY')}</TableCell>
                            </ProfileTableLayout>
                        )
                    }}
                </Query>
            </Paper>
            <div className={classes.subtitle}>
                <Typography 
                    component="h1" 
                    variant="h5"
                >
                    {t('myReports')}
                </Typography>
                <Avatar className={classes.avatar}>
                    <AssignmentIcon />
                </Avatar>
            </div>
            <Paper className={classNames(classes.root, classes.reports)}>
                <Query 
                    fetchPolicy="network-only"
                    query={getMyReports}
                    variables={{ page: page + 1, limit: rowsPerPage, order: order }}
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

                        if (data.getMyReports.totalDocs === 0) return (
                            <ReportsTableLayout>
                                {t('noReports')}
                            </ReportsTableLayout>
                        )

                        const emptyRows = rowsPerPage - Math.min(rowsPerPage, data.getMyReports.totalDocs - page * rowsPerPage);
                        return (
                            <Fragment>
                                <ReportsTableLayout sort>
                                    {data.getMyReports.docs.map(row => (
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
                                </ReportsTableLayout>
                                <TablePagination
                                    rowsPerPageOptions={[5, 10, 15]}
                                    component="div"
                                    labelRowsPerPage={t('numbersOfRows')}
                                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('from')} ${count}`}
                                    count={data.getMyReports.totalDocs}
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

export default withStyles(styles)(withTranslation()(Profile))
