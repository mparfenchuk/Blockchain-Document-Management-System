import React, { useEffect } from 'react';
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

import MomentUtils from '@date-io/moment';
import { DatePicker, MuiPickersUtilsProvider } from 'material-ui-pickers';

import Mutation from '../../app/graphql/components/Mutation'
import gql from 'graphql-tag'

import { Formik } from 'formik';
import * as Yup from 'yup';

import getRole from '../../app/helpers/getRole'
import getLang from '../../app/helpers/getLang'

// graphql mutation
const createReportMutation = gql`
  mutation($text: String!, $type: String!) {
    createReport(text: $text, type: $type) {
        id
        text
        type
        transactionId
        ipfsHash
        createdAt
        updatedAt
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
        alignItems: 'baseline',
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
});

// yup validation
const jobsSchema = t => Yup.object().shape({
    fromDate: Yup.mixed()
      .required(t('required')),
    toDate: Yup.mixed()
      .required(t('required')),
    amount: Yup.string()
      .min(1, t('smallDataAlert'))
      .max(20, t('largeDataAlert'))
      .required(t('required')),
});

// component
const WorkDialog = ({ classes, enqueueSnackbar, open, onClose, t, i18n, role, name }) => {

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
            <Mutation 
                    errorPolicy="all"
                    mutation={createReportMutation}
                    onCompleted={({ createReport: { transactionId } }) => {
                        enqueueSnackbar(`The document was created by the transaction ${transactionId}`, { 
                            variant: 'success',
                        })
                    }}
                >
                {(createReport, { data, loading, error }) => (
                    <Formik
                        initialValues={{ fromDate: new Date(), toDate: new Date(), amount: "" }}
                        validationSchema={() => jobsSchema(t)}
                        onSubmit={async (values, { setSubmitting, resetForm }) => {
                            try {
                                const text = JSON.stringify(values)
                                await createReport({variables: { text: text, type: 'work' }})
                                resetForm()
                            } catch(e){
                                setSubmitting(false)
                            }
                        }}
                    >
                    {({ isSubmitting, isValid, handleSubmit, handleChange, handleBlur, setFieldValue, setFieldError, values, errors, touched }) => (
                        <form 
                            className={classes.form} 
                            onSubmit={handleSubmit}
                            autoComplete="off"
                        >
                            <DialogContent>
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
                                    {t('report')} {moment().locale(getLang(i18n)).format('DD MMMM YYYY')}
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
                                    <MuiPickersUtilsProvider 
                                        utils={MomentUtils}
                                        locale={getLang(i18n)}
                                        moment={moment}
                                    >
                                        <DatePicker 
                                            name="fromDate"
                                            disableFuture
                                            disabled={isSubmitting}
                                            cancelLabel={t('cancel')}
                                            clearLabel={t('clear')}
                                            okLabel={t('ok')}
                                            format="DD MMMM YYYY"
                                            onChange={date => setFieldValue('fromDate', date, true)}
                                            onError={(_, error) => setFieldError('fromDate', error)}
                                            value={values.fromDate}
                                            helperText={errors.fromDate}
                                            error={Boolean(errors.fromDate)}
                                        />
                                    </MuiPickersUtilsProvider>
                                    <Typography 
                                        align="left"
                                        className={classNames(classes.textMR, classes.textML)}
                                    >
                                        {t('to')}
                                    </Typography>
                                    <MuiPickersUtilsProvider 
                                        utils={MomentUtils}
                                        locale={getLang(i18n)}
                                        moment={moment}
                                    >
                                        <DatePicker 
                                            name="toDate"
                                            disableFuture
                                            disabled={isSubmitting}
                                            cancelLabel={t('cancel')}
                                            clearLabel={t('clear')}
                                            okLabel={t('ok')}
                                            format="DD MMMM YYYY"
                                            onChange={date => setFieldValue('toDate', date, true)}
                                            onError={(_, error) => setFieldError('toDate', error)}
                                            value={values.toDate}
                                            helperText={errors.toDate}
                                            error={Boolean(errors.toDate)}
                                        />
                                    </MuiPickersUtilsProvider>
                                </div>
                                <div className={classes.date}>
                                    <Typography 
                                        align="left"
                                        className={classes.textMR}
                                    >
                                        {t('iWasMade')}
                                    </Typography>
                                    <TextField
                                        // margin="dense"
                                        name="amount"
                                        type="text"
                                        // fullWidth
                                        disabled={isSubmitting}
                                        onChange={handleChange}
                                        onBlur={handleBlur} 
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
                                    {getRole(role, t) === undefined ? '-' : getRole(role, t).label}
                                    <br/>
                                    {name}
                                </Typography>
                            </DialogContent>
                            <DialogActions>
                                <div className={classes.buttons}>
                                    <Button 
                                        color="secondary"
                                        onClick={onClose}
                                        disabled={isSubmitting}
                                    >
                                        {t('cancel')}
                                    </Button>
                                    <Button 
                                        type="submit"
                                        color="primary"
                                        disabled={isSubmitting || !isValid}
                                    >
                                        {t('sign')}
                                    </Button>
                                </div>
                            </DialogActions>
                        </form>
                    )}
                    </Formik>
                )}
            </Mutation>
        </Dialog>
    )
}

export default withSnackbar(withStyles(styles)(withTranslation()(WorkDialog)))
