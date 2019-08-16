import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import Mutation from '../app/graphql/components/Mutation'
import gql from 'graphql-tag'

import { Formik } from 'formik';
import * as Yup from 'yup';

import login from '../app/helpers/login';

// graphql mutation
const loginMutation = gql`
  mutation($passport: String!, $password: String!) {
    login(passport: $passport, password: $password) {
        token
    }
  }
`;

// material ui styles
const styles = theme => ({
    main: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        display: 'block',
        [theme.breakpoints.up(400 + theme.spacing.unit * 3 * 2)]: {
            width: 400,
            marginLeft: 'auto',
            marginRight: 'auto',
        }
    },
    paper: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
        marginTop: '64px'
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%',
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    }
});

// yup validation
const loginSchema = t => Yup.object().shape({
    passport: Yup.string()
      .min(2, t('smallDataAlert'))
      .max(20, t('largeDataAlert'))
      .required(t('required')),
    password: Yup.string()
      .min(8, t('smallPasswordAlert'))
      .max(50, t('largePasswordAlert'))
      .required(t('required')),
});

// component
const Login = ({ classes, history, t }) => (
    <div className={classes.main}>
        <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography 
                component="h1" 
                variant="h5"
            >
                {t('signIn')}
            </Typography>
            <Mutation 
                errorPolicy="all"
                mutation={loginMutation}
                onCompleted={({ login: { token } }) => {
                    login(token, history);
                }}
            >
            {(login, { data, loading, error }) => (
                <Formik
                    initialValues={{ passport: '', password: '' }}
                    validationSchema={() => loginSchema(t)}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            await login({variables: { passport: values.passport, password: values.password }})
                            setSubmitting(false)
                        } catch(e){
                            setSubmitting(false)
                        }
                    }}
                >
                {({ isSubmitting, isValid, handleSubmit, handleChange, handleBlur, values, errors, touched }) => (
                    <form 
                        className={classes.form} 
                        onSubmit={handleSubmit}
                        autoComplete="off"
                    >
                        <TextField
                            name="passport" 
                            type="text"
                            label={t('passport')}
                            placeholder={t('passportAlert')}
                            margin="normal"
                            fullWidth
                            onChange={handleChange}
                            onBlur={handleBlur} 
                            value={values.passport}
                            helperText={touched.passport ? errors.passport : ""}
                            error={touched.passport && Boolean(errors.passport)}
                        />
                        <TextField
                            name="password" 
                            type="password"
                            label={t('password')}
                            placeholder={t('passwordAlert')}
                            margin="normal"
                            fullWidth
                            onChange={handleChange}
                            onBlur={handleBlur} 
                            value={values.password}
                            helperText={touched.password ? errors.password : ""}
                            error={touched.password && Boolean(errors.password)}
                        />
                        <Button 
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            className={classes.submit} 
                            disabled={isSubmitting || !isValid}
                        >
                            {t('next')}
                        </Button>
                    </form>
                )}
                </Formik>
            )}
            </Mutation>
        </Paper>
    </div>
)

export default withStyles(styles)(withRouter(withTranslation()(Login)))
