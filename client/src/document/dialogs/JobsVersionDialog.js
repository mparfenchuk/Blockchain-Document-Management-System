import React, { useEffect, useRef } from 'react';
import { withTranslation } from 'react-i18next';
import { withSnackbar } from 'notistack';
import * as moment from 'moment';

import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import InputAdornment from '@material-ui/core/InputAdornment';
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
        marginTop: '8px',
        marginBottom: '4px'
    },
    dateText: {
        marginRight: '4px'
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
const JobsVersionDialog = ({ classes, id, transactionId, author, qrcode, open, onClose, t, i18n }) => {

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
                                            {t('order')} {moment(data.getVersion.createdAt, "x").locale(getLang(i18n)).format('DD MMMM YYYY')}
                                        </Typography>
                                        <Typography align="center">
                                            {t('hiring')}
                                        </Typography>
                                        <TextField
                                            margin="dense"
                                            name="name"
                                            label={t('fullName')}
                                            type="text"
                                            fullWidth
                                            InputProps={{
                                                readOnly: true,
                                            }} 
                                            value={values.name}
                                            helperText={touched.name ? errors.name : ""}
                                            error={touched.name && Boolean(errors.name)}
                                        />
                                        <div className={classNames(classes.date, classes.dense)}>
                                            <Typography 
                                                align="left"
                                                className={classes.dateText}
                                            >
                                                {t('takeFrom')}
                                            </Typography>
                                            <TextField
                                                name="date"
                                                type="text"
                                                InputProps={{
                                                    readOnly: true,
                                                }}
                                                value={moment(values.date).locale(getLang(i18n)).format('DD MMMM YYYY')}
                                                helperText={errors.date}
                                                error={Boolean(errors.date)}
                                            />
                                        </div>
                                        <TextField
                                            margin="dense"
                                            name="job"
                                            label={t('profession')}
                                            type="text"
                                            fullWidth
                                            InputProps={{
                                                readOnly: true,
                                            }}
                                            value={values.job}
                                            helperText={touched.job ? errors.job : ""}
                                            error={touched.job && Boolean(errors.job)}
                                        />
                                        <Grid 
                                            container 
                                            spacing={16}
                                            className={classes.dense}
                                        >
                                            <Grid item xs={12} sm={6}>
                                                <Typography align="center">
                                                    {t('recruitmentConditions')}
                                                </Typography>
                                                <TextField
                                                    margin="dense"
                                                    name="recruitments"
                                                    type="text"
                                                    multiline
                                                    fullWidth
                                                    // rows={5}
                                                    // rowsMax={5}
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    value={values.recruitments}
                                                    helperText={touched.recruitments ? errors.recruitments : ""}
                                                    error={touched.recruitments && Boolean(errors.recruitments)}
                                                />
                                            </Grid>
                                            <Grid item xs={12} sm={6}>
                                                <Typography align="center">
                                                    {t('workingConditions')}
                                                </Typography>
                                                <TextField
                                                    margin="dense"
                                                    name="terms"
                                                    type="text"
                                                    multiline
                                                    fullWidth
                                                    // rows={5}
                                                    // rowsMax={5}
                                                    InputProps={{
                                                        readOnly: true,
                                                    }}
                                                    value={values.terms}
                                                    helperText={touched.terms ? errors.terms : ""}
                                                    error={touched.terms && Boolean(errors.terms)}
                                                />
                                            </Grid>
                                        </Grid>
                                        <TextField
                                            margin="dense"
                                            name="salary"
                                            label={t('salary')}
                                            type="text"
                                            fullWidth
                                            InputProps={{
                                                endAdornment: <InputAdornment position="end">{t('uah')}</InputAdornment>,
                                                readOnly: true,
                                            }}
                                            value={values.salary}
                                            helperText={touched.salary ? errors.salary : ""}
                                            error={touched.salary && Boolean(errors.salary)}
                                        />
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

export default withSnackbar(withStyles(styles)(withTranslation()(JobsVersionDialog)))
