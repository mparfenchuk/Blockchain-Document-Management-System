import React, { Fragment, useState } from 'react';
import { withTranslation } from 'react-i18next';
import classNames from 'classnames';
import * as moment from 'moment';
import QRCode from 'qrcode.react';

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

import HistoryIcon from '@material-ui/icons/History';
import CropFreeIcon from '@material-ui/icons/CropFree';

import Query from '../app/graphql/components/Query'
import gql from 'graphql-tag'

import getType from '../app/helpers/getType'
import getLang from '../app/helpers/getLang'

import JobsDialog from './dialogs/JobsDialog'
import JobsVersionDialog from './dialogs/JobsVersionDialog'
import WorkDialog from './dialogs/WorkDialog'
import WorkVersionDialog from './dialogs/WorkVersionDialog'
import WageDialog from './dialogs/WageDialog'
import WageVersionDialog from './dialogs/WageVersionDialog'

// graphql queries
const getMe = gql`
  {
    me {
        id
    }
  }
`;

const getReport = gql`
  query($reportId: String!){
    getReport(reportId: $reportId) {
        id
        text
        type
        transactionId
        ipfsHash
        versionsCount
        createdAt
        updatedAt
        author {
            id
            firstName
            lastName
            role
        }
    }
  }
`;

const getVersions = gql`
    query($reportId: String!, $page: Int!, $limit: Int!, $order: String!) {
        getVersions(reportId: $reportId, page: $page, limit: $limit, order: $order) {
            docs {
                id
                transactionId
                ipfsHash
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
    qrcode: {
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit * 2 * 3,
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
    }
});

// component
const Document = ({ classes, location: { pathname }, match: { params: { id } }, t, i18n }) => {

    // hooks
    const [open, setOpen] = useState(false);
    const [openVersion, setOpenVersion] = useState(false);
    const [transactionId, setTransactionId] = useState(null);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [order, setOrder] = useState('desc');

    // methods
    const handleClickOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const handleClickOpenVersion = transactionId => () => {
        setOpenVersion(true)
        setTransactionId(transactionId)
    };
    const handleCloseVersion = () => setOpenVersion(false);
    const handleChangePage = (event, page) => setPage(page)
    const handleChangeRowsPerPage = event => setRowsPerPage(event.target.value)
    const handleChangeOrder = () => {
        let newOrder = 'desc';
        if (order === 'desc') {
          newOrder = 'asc';
        }
        setOrder(newOrder)
    };

    // layout for initial document table
    const DocumentTableLayout = ({ children, loaded, dataReport }) => {
        return (
            <Table className={classes.table}>
                <TableHead>
                <TableRow>
                    <TableCell>{t('title')}</TableCell>
                    <TableCell>{t('author')}</TableCell>
                    <TableCell>{t('transaction')}</TableCell>
                    <TableCell align="right">{t('versions')}</TableCell>
                    <TableCell>{t('created')}</TableCell>
                </TableRow>
                </TableHead>
                <TableBody>
                    {loaded ? 
                        <TableRow 
                            hover
                            className={classes.tableRow}
                            onClick={handleClickOpen}
                        >
                            {children}
                        </TableRow>
                        :
                        <TableRow>
                            <TableCell 
                                component="th" 
                                scope="row"
                                colSpan={5}
                            >
                                {children}
                            </TableCell>
                        </TableRow>
                    }
                </TableBody>
            </Table>
        )
    }

    // layout for document version table
    const VersionsTableLayout = ({ children, sort }) => {
        return (
            <Table className={classes.table}>
                <TableHead>
                <TableRow>
                    <TableCell>{t('transaction')}</TableCell>
                    <TableCell>{t('hash')}</TableCell>
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
                                colSpan={3}
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
            <Query query={getMe}>
                {({ loading: loadingMe, error: errorMe, data: dataMe, refetch: refetchMe }) => (
                    <Query 
                        fetchPolicy="network-only"
                        query={getReport}
                        variables={{ reportId: id }}
                        skip={!dataMe}
                    >
                        {({ loading: loadingReport, error: errorReport, data: dataReport, refetch: refetchReport }) => (
                            <Query 
                                fetchPolicy="network-only"
                                query={getVersions}
                                variables={{ reportId: id, page: page + 1, limit: rowsPerPage, order: order }}
                            >
                                {({ loading, error, data, refetch }) => {
                                    
                                    let emptyRows = 0
                                    if (!loading && !error) {
                                        emptyRows = rowsPerPage - Math.min(rowsPerPage, data.getVersions.totalDocs - page * rowsPerPage);
                                    }
                                    return (
                                        <Fragment>
                                            <Paper className={classes.root}>
                                                {
                                                    loadingReport || loadingMe ? 
                                                            <DocumentTableLayout>
                                                                {t('loading')}
                                                            </DocumentTableLayout>
                                                        :
                                                            errorReport || errorMe ? 
                                                                <DocumentTableLayout>
                                                                    {t('failedToLoadData')} <button onClick={async() => { await refetchMe(); await refetchReport() }}>{t('tryAgain')}</button>
                                                                </DocumentTableLayout>
                                                                :
                                                                <DocumentTableLayout 
                                                                    loaded 
                                                                    dataReport={dataReport}
                                                                >
                                                                    <TableCell 
                                                                        component="th" 
                                                                        scope="row"
                                                                    >
                                                                        {getType(dataReport.getReport.type, t) === undefined ? '-' : getType(dataReport.getReport.type, t).label}
                                                                    </TableCell>
                                                                    <TableCell>{dataReport.getReport.author.firstName} {dataReport.getReport.author.lastName}</TableCell>
                                                                    <Tooltip 
                                                                        title={dataReport.getReport.transactionId} 
                                                                        aria-label={dataReport.getReport.transactionId}
                                                                        classes={{ tooltip: classes.noMaxWidth }}
                                                                    >
                                                                        <TableCell className={classes.transactionCell}>
                                                                            {dataReport.getReport.transactionId}
                                                                        </TableCell>
                                                                    </Tooltip>
                                                                    <TableCell align="right">{dataReport.getReport.versionsCount}</TableCell>
                                                                    <TableCell>{moment(dataReport.getReport.createdAt, "x").locale(getLang(i18n)).format('DD MMMM YYYY')}</TableCell>
                                                                </DocumentTableLayout>
                                                }
                                            </Paper>
                                            <div className={classes.subtitle}>
                                                <Typography 
                                                    component="h1" 
                                                    variant="h5"
                                                >
                                                    {t('versions')}
                                                </Typography>
                                                <Avatar className={classes.avatar}>
                                                    <HistoryIcon />
                                                </Avatar>
                                            </div>
                                            <Paper className={classNames(classes.root, classes.reports)}>
                                                {
                                                    loading ? 
                                                            <VersionsTableLayout>
                                                                {t('loading')}
                                                            </VersionsTableLayout>
                                                        :
                                                            error ?
                                                                    <VersionsTableLayout>
                                                                        {t('failedToLoadData')} <button onClick={() => refetch()}>{t('tryAgain')}</button>
                                                                    </VersionsTableLayout>
                                                                :
                                                                    data.getVersions.totalDocs === 0 ?
                                                                            <VersionsTableLayout>
                                                                                {t('noVersions')}
                                                                            </VersionsTableLayout>
                                                                        :
                                                                            <Fragment>
                                                                                <VersionsTableLayout sort>
                                                                                    {data.getVersions.docs.map(row => (
                                                                                        <TableRow 
                                                                                            key={row.id}
                                                                                            hover
                                                                                            className={classes.tableRow}
                                                                                            onClick={handleClickOpenVersion(row.transactionId)}
                                                                                        >
                                                                                            <Tooltip 
                                                                                                title={row.transactionId} 
                                                                                                aria-label={row.transactionId}
                                                                                                classes={{ tooltip: classes.noMaxWidth }}
                                                                                            >
                                                                                                <TableCell 
                                                                                                    component="th" 
                                                                                                    scope="row"
                                                                                                    className={classes.transactionCell}
                                                                                                >
                                                                                                    {row.transactionId}
                                                                                                </TableCell>
                                                                                            </Tooltip>
                                                                                            <Tooltip 
                                                                                                title={row.ipfsHash} 
                                                                                                aria-label={row.ipfsHash}
                                                                                                classes={{ tooltip: classes.noMaxWidth }}
                                                                                            >
                                                                                                <TableCell className={classes.transactionCell}>
                                                                                                    {row.ipfsHash}
                                                                                                </TableCell>
                                                                                            </Tooltip>
                                                                                            <TableCell>{moment(row.createdAt, "x").locale(getLang(i18n)).fromNow()}</TableCell>
                                                                                        </TableRow>
                                                                                    ))}
                                                                                    {emptyRows > 0 && (
                                                                                        <TableRow style={{ height: 49 * emptyRows }}>
                                                                                            <TableCell colSpan={3} />
                                                                                        </TableRow>
                                                                                    )}
                                                                                </VersionsTableLayout>
                                                                                <TablePagination
                                                                                    rowsPerPageOptions={[5, 10, 15]}
                                                                                    component="div"
                                                                                    labelRowsPerPage={t('numbersOfRows')}
                                                                                    labelDisplayedRows={({ from, to, count }) => `${from}-${to} ${t('from')} ${count}`}
                                                                                    count={data.getVersions.totalDocs}
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
                                                                        
                                                }
                                            </Paper>
                                            {!loadingMe && !errorMe && !loadingReport && !errorReport && dataReport.getReport.type === 'jobs' && <JobsDialog
                                                id={id}
                                                open={open}
                                                text={dataReport.getReport.text}
                                                author={dataReport.getReport.author}
                                                createdAt={dataReport.getReport.createdAt}
                                                myId={dataMe.me.id}
                                                transactionId={dataReport.getReport.transactionId}
                                                refetchReport={refetchReport}
                                                refetch={refetch}
                                                onClose={handleClose} 
                                                qrcode={`http://localhost:3000${pathname}`} 
                                            />}
                                            {!loadingMe && !errorMe && !loadingReport && !errorReport && dataReport.getReport.type === 'work' && <WorkDialog
                                                id={id}
                                                open={open}
                                                text={dataReport.getReport.text}
                                                author={dataReport.getReport.author}
                                                createdAt={dataReport.getReport.createdAt}
                                                myId={dataMe.me.id}
                                                transactionId={dataReport.getReport.transactionId}
                                                refetchReport={refetchReport}
                                                refetch={refetch}
                                                onClose={handleClose} 
                                                qrcode={`http://localhost:3000${pathname}`} 
                                            />}
                                             {!loadingMe && !errorMe && !loadingReport && !errorReport && dataReport.getReport.type === 'wage' && <WageDialog
                                                id={id}
                                                open={open}
                                                text={dataReport.getReport.text}
                                                author={dataReport.getReport.author}
                                                createdAt={dataReport.getReport.createdAt}
                                                myId={dataMe.me.id}
                                                transactionId={dataReport.getReport.transactionId}
                                                refetchReport={refetchReport}
                                                refetch={refetch}
                                                onClose={handleClose} 
                                                qrcode={`http://localhost:3000${pathname}`} 
                                            />}
                                            {!loadingReport && !errorReport && dataReport.getReport.type === 'jobs' && <JobsVersionDialog
                                                id={id}
                                                open={openVersion}
                                                author={dataReport.getReport.author}
                                                transactionId={transactionId}
                                                onClose={handleCloseVersion}
                                                qrcode={`http://localhost:3000${pathname}`} 
                                            />}
                                            {!loadingReport && !errorReport && dataReport.getReport.type === 'work' && <WorkVersionDialog
                                                id={id}
                                                open={openVersion}
                                                author={dataReport.getReport.author}
                                                transactionId={transactionId}
                                                onClose={handleCloseVersion}
                                                qrcode={`http://localhost:3000${pathname}`} 
                                            />}
                                            {!loadingReport && !errorReport && dataReport.getReport.type === 'wage' && <WageVersionDialog
                                                id={id}
                                                open={openVersion}
                                                author={dataReport.getReport.author}
                                                transactionId={transactionId}
                                                onClose={handleCloseVersion}
                                                qrcode={`http://localhost:3000${pathname}`} 
                                            />}
                                        </Fragment>
                                    )
                                }}
                            </Query>
                        )}
                    </Query>
                )}
            </Query>
            <div className={classes.subtitle}>
                <Typography 
                    component="h1" 
                    variant="h5"
                >
                    {t('QRcode')}
                </Typography>
                <Avatar className={classes.avatar}>
                    <CropFreeIcon />
                </Avatar>
            </div>
            <QRCode 
                className={classes.qrcode}
                size={176}
                value={`http://localhost:3000${pathname}`} 
            />
        </Fragment>
    )
}

export default withStyles(styles)(withTranslation()(Document))
