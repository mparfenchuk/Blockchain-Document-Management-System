import React, { useEffect, useRef } from 'react';
import { withTranslation } from 'react-i18next';
import { withSnackbar } from 'notistack';
import * as moment from 'moment';

import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';

import ReactToPrint from 'react-to-print';
import QRCode from 'qrcode.react';

import Query from '../../app/graphql/components/Query'
import gql from 'graphql-tag'

import { Formik } from 'formik';

import getRole from '../../app/helpers/getRole'
import getLang from '../../app/helpers/getLang'

// graphql query
const getVersion = gql`
  query($reportId: String!, $transactionId: String!){
    getVersion(reportId: $reportId, transactionId: $transactionId) {
        text,
        createdAt
    }
  }
`;

// material ui styles
const styles = theme => ({
    form: {
        width: '100%',
    },
    date: {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center'
    },
    dense: {
        marginTop: '12px',
        marginBottom: '4px'
    },
    denseTop: {
        marginTop: '8px',
    },
    textMR: {
        marginRight: '4px'
    },
    textML: {
        marginLeft: '4px'
    },
    title: {
        marginTop: '64px'
    },
    buttons: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    qrcode: {
        marginTop: theme.spacing.unit * 3,
        marginBottom: theme.spacing.unit
    },
});

// component
const WorkVersionDialog = ({ classes, id, transactionId, author, qrcode, open, onClose, t, i18n }) => {

    const componentRef = useRef(null);

    useEffect(() => {
        moment.locale(getLang(i18n))
    });

    return (
        <Dialog
            fullWidth
            disableBackdropClick
            disableEscapeKeyDown
            open={open}
            onClose={onClose} 
            scroll="body"
        >
            <Query 
                fetchPolicy="network-only"
                query={getVersion}
                variables={{ reportId: id, transactionId }}
            >
                {({ loading, error, data }) => {
                    if (loading) return (
                        <DialogContent>
                            {t('loading')}
                        </DialogContent>
                    )

                    if (error) return (
                        <DialogContent>
                            {t('failedToLoadData')}
                        </DialogContent>
                    )

                    let text
                    try {
                        text = JSON.parse(data.getVersion.text);
                    } catch(e) {
                        return (
                            <DialogContent>
                                <Typography 
                                    align="left"
                                    paragraph
                                >
                                    {t('invalidType')}
                                </Typography>
                                <div className={classes.buttons}>
                                    <Button 
                                        color="secondary"
                                        onClick={onClose}
                                    >
                                        {t('cancel')}
                                    </Button>
                                </div>
                            </DialogContent>
                        )
                    }

                    return (
                        <Formik initialValues={{ ...text }}>
                            {({ values, errors, touched }) => (         
                                <form 
                                    className={classes.form}
                                    autoComplete="off"
                                >
                                    <DialogContent ref={componentRef}>
                                        <Typography 
                                            align="left"
                                            paragraph
                                        >
                                            {t('nykredit')}
                                        </Typography>
                                        <Typography 
                                            variant="h5" 
                                            align="center"
                                        >
                                            {t('report')} {moment(data.getVersion.createdAt, "x").locale(getLang(i18n)).format('DD MMMM YYYY')}
                                        </Typography>
                                        <Typography align="center">
                                            {t('manufacturedProducts')}
                                        </Typography>
                                        <div className={classNames(classes.date, classes.denseTop)}>
                                            <Typography 
                                                align="left"
                                                className={classes.textMR}
                                            >
                                                {t('periodFrom')}
                                            </Typography>
                                            <TextField
                                                name="fromDate"
                                                type="text"
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                value={moment(values.fromDate).locale(getLang(i18n)).format('DD MMMM YYYY')}
                                                helperText={errors.fromDate}
                                                error={Boolean(errors.fromDate)}
                                            />
                                            <Typography 
                                                align="left"
                                                className={classNames(classes.textMR, classes.textML)}
                                            >
                                                {t('to')}
                                            </Typography>
                                            <TextField
                                                name="toDate"
                                                type="text"
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                value={moment(values.toDate).locale(getLang(i18n)).format('DD MMMM YYYY')}
                                                helperText={errors.toDate}
                                                error={Boolean(errors.toDate)}
                                            />
                                        </div>
                                        <div className={classes.date}>
                                            <Typography 
                                                align="left"
                                                className={classes.textMR}
                                            >
                                                {t('iWasMade')}
                                            </Typography>
                                            <TextField
                                                name="amount"
                                                type="text"
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                value={values.amount}
                                                helperText={touched.amount ? errors.amount : ""}
                                                error={touched.amount && Boolean(errors.amount)}
                                            />
                                            <Typography 
                                                align="left"
                                                className={classes.textML}
                                            >
                                                {t('units')}
                                            </Typography>
                                        </div>
                                        <Typography 
                                            className={classes.dense} 
                                            align="right"
                                        >
                                            {getRole(author.role, t) === undefined ? '-' : getRole(author.role, t).label}
                                            <br/>
                                            {author.firstName + ' ' +author.lastName}
                                        </Typography>
                                        <QRCode 
                                            className={classes.qrcode}
                                            size={176}
                                            value={qrcode} 
                                        />
                                        <br/><small>{t('transactionPrint')}</small>
                                        <br/><small>{transactionId}</small>
                                    </DialogContent>
                                    <DialogActions>
                                        <div className={classes.buttons}>
                                            <Button 
                                                color="secondary"
                                                onClick={onClose}
                                            >
                                                {t('cancel')}
                                            </Button>
                                            <ReactToPrint
                                                trigger={() => <Button color="primary">
                                                    {t('print')}
                                                </Button>}
                                                content={() => componentRef.current}
                                            />
                                        </div>
                                    </DialogActions>
                                </form>
                            )}
                        </Formik>
                    )
                }}
            </Query>
        </Dialog>
    )
}

export default withSnackbar(withStyles(styles)(withTranslation()(WorkVersionDialog)))
