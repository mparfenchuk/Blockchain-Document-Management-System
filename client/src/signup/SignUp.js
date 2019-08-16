import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import { withStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import Paper from '@material-ui/core/Paper';
import MenuItem from '@material-ui/core/MenuItem';
import Typography from '@material-ui/core/Typography';

import LockOutlinedIcon from '@material-ui/icons/LockOutlined';

import Mutation from '../app/graphql/components/Mutation'
import gql from 'graphql-tag'

import { Formik } from 'formik';
import * as Yup from 'yup';

import login from '../app/helpers/login';
import roles from '../app/helpers/roles';

// graphql mutation
const signUpMutation = gql`
  mutation($passport: String!, $firstName: String!, $lastName: String!, $role: String!, $password: String!) {
    signUp(passport: $passport, firstName: $firstName, lastName: $lastName, role: $role, password: $password) {
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
    },
    menu: {
        width: 200,
    },
});

// yup validation
const signUpSchema = t => Yup.object().shape({
    passport: Yup.string()
      .min(2, t('smallDataAlert'))
      .max(20, t('largeDataAlert'))
      .required(t('required')),
    firstName: Yup.string()
      .min(2, t('smallDataAlert'))
      .max(20, t('largeDataAlert'))
      .required(t('required')),
    lastName: Yup.string()
      .min(2, t('smallDataAlert'))
      .max(20, t('largeDataAlert'))
      .required(t('required')),
    role: Yup.string()
      .required(t('required')),
    password: Yup.string()
      .min(8, t('smallPasswordAlert'))
      .max(50, t('largePasswordAlert'))
      .required(t('required')),
    passwordConfirm: Yup.string()
      .oneOf([Yup.ref('password'), null], t('passwordsDoNotMatch'))
      .required(t('required'))
});

// component
const SignUp = ({ classes, history, t }) => (
    <div className={classes.main}>
        <Paper className={classes.paper}>
            <Avatar className={classes.avatar}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography 
                component="h1" 
                variant="h5"
            >
                {t('registration')}
            </Typography>
            <Mutation 
                errorPolicy="all"
                mutation={signUpMutation}
                onCompleted={({ signUp: { token } }) => {
                    login(token, history);
                }}
            >
            {(signUp, { data, loading, error }) => (
                <Formik
                    initialValues={{ passport: '', firstName: '', lastName: '', role: '', password: '', passwordConfirm: '' }}
                    validationSchema={() => signUpSchema(t)}
                    onSubmit={async (values, { setSubmitting }) => {
                        try {
                            await signUp({variables: { passport: values.passport, firstName: values.firstName, lastName: values.lastName, role: values.role, password: values.password }})
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
                    >
                        <TextField
                            name="passport" 
                            type="text"
                            label={t('passport')}
                            placeholder={t('passportAlert')}
                            margin="normal"
                            autoComplete="off"
                            fullWidth
                            onChange={handleChange}
                            onBlur={handleBlur} 
                            value={values.passport}
                            helperText={touched.passport ? errors.passport : ""}
                            error={touched.passport && Boolean(errors.passport)}
                        />
                        <TextField
                            name="role" 
                            type="text"
                            label={t('position')}
                            placeholder={t('positionAlert')}
                            margin="normal"
                            SelectProps={{
                                MenuProps: {
                                    className: classes.menu,
                                },
                            }}
                            select
                            fullWidth
                            onChange={handleChange}
                            onBlur={handleBlur} 
                            value={values.role}
                            helperText={touched.role ? errors.role : ""}
                            error={touched.role && Boolean(errors.role)}
                        >
                            {roles(t).map(option => (
                                <MenuItem 
                                    key={option.value} 
                                    value={option.value}
                                >
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            name="firstName" 
                            type="text"
                            label={t('firstName')}
                            placeholder={t('firstNameAlert')}
                            margin="normal"
                            autoComplete="off"
                            fullWidth
                            onChange={handleChange}
                            onBlur={handleBlur} 
                            value={values.firstName}
                            helperText={touched.firstName ? errors.firstName : ""}
                            error={touched.firstName && Boolean(errors.firstName)}
                        />
                        <TextField
                            name="lastName" 
                            type="text"
                            label={t('lastName')}
                            placeholder={t('lastNameAlert')}
                            margin="normal"
                            autoComplete="off"
                            fullWidth
                            onChange={handleChange}
                            onBlur={handleBlur} 
                            value={values.lastName}
                            helperText={touched.lastName ? errors.lastName : ""}
                            error={touched.lastName && Boolean(errors.lastName)}
                        />
                        <TextField
                            name="password" 
                            type="password"
                            label={t('password')}
                            placeholder={t('passwordAlert')}
                            margin="normal"
                            autoComplete="off"
                            fullWidth
                            onChange={handleChange}
                            onBlur={handleBlur} 
                            value={values.password}
                            helperText={touched.password ? errors.password : ""}
                            error={touched.password && Boolean(errors.password)}
                        />
                        <TextField
                            name="passwordConfirm" 
                            type="password"
                            label={t('confirmPassword')}
                            placeholder={t('passwordConfirmation')}
                            margin="normal"
                            autoComplete="off"
                            fullWidth
                            onChange={handleChange}
                            onBlur={handleBlur} 
                            value={values.passwordConfirm}
                            helperText={touched.passwordConfirm ? errors.passwordConfirm : ""}
                            error={touched.passwordConfirm && Boolean(errors.passwordConfirm)}
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

export default withStyles(styles)(withRouter(withTranslation()(SignUp)))
