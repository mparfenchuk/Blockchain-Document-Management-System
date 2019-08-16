import React, { Fragment, useState } from 'react';
import { withTranslation } from 'react-i18next';

import { withStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Button from '@material-ui/core/Button';
import Typography from '@material-ui/core/Typography';

import Query from '../app/graphql/components/Query'
import gql from 'graphql-tag'

import types from '../app/helpers/types';

import JobsDialog from './dialogs/JobsDialog'
import WorkDialog from './dialogs/WorkDialog'
import WageDialog from './dialogs/WageDialog'

// graphql query
const getMe = gql`
  {
    me {
        id
        firstName
        lastName,
        role
    }
  }
`;

// material ui styles
const styles = theme => ({
    paper: {
        padding: theme.spacing.unit * 2,
    },
    root: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
    },
});

// component
const Templates = ({ classes, t }) => {

    // hooks
    const [type, setType] = useState(null);
    const [open, setOpen] = useState(false);

    // methods
    const handleClickOpen = type => { 
        setType(type)
        setOpen(true)
    }
    const handleClose = () => setOpen(false)

    return (
        <Query query={getMe}>
            {({ loading, error, data }) => {
                if (loading) return t('loading')

                if (error) return t('failedToLoadData')
            
                return (
                    <Fragment>
                        <Grid container spacing={24}>
                            {types(t).map(type => (
                                <Grid 
                                    key={type.value} 
                                    item 
                                    xs={12} 
                                    sm={6} 
                                    md={4}
                                >
                                    <Paper className={classes.paper}>
                                        <Typography 
                                            variant="h5" 
                                            component="h2"
                                            gutterBottom
                                        >
                                            {type.label}
                                        </Typography>
                                        <Typography 
                                            color="textSecondary" 
                                            paragraph
                                        >
                                            {type.description}
                                        </Typography>
                                        <Button 
                                            size="small"
                                            color="primary"
                                            disabled={
                                                (type.value === 'jobs' && data.me.role !== 'director' && data.me.role !== 'administrator') ||
                                                (type.value === 'work' && data.me.role !== 'worker') ||
                                                (type.value === 'wage' && data.me.role !== 'accountant')
                                            }
                                            onClick={() => handleClickOpen(type.value)}
                                        >
                                            {t('create')}
                                        </Button>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                        {type === 'jobs' && <JobsDialog
                            open={open}
                            onClose={handleClose} 
                            role={data.me.role}
                            name={data.me.firstName + ' ' + data.me.lastName}
                        />}
                        {type === 'work' && <WorkDialog
                            open={open}
                            onClose={handleClose} 
                            role={data.me.role}
                            name={data.me.firstName + ' ' + data.me.lastName}
                        />}
                        {type === 'wage' && <WageDialog
                            open={open}
                            onClose={handleClose} 
                            role={data.me.role}
                            name={data.me.firstName + ' ' + data.me.lastName}
                        />}
                    </Fragment>
                )
            }}
        </Query>
        
    )
}

export default withStyles(styles)(withTranslation()(Templates))
