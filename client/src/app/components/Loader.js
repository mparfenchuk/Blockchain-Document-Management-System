import React from 'react';

import CircularProgress from '@material-ui/core/CircularProgress';
import Grid from '@material-ui/core/Grid';

import { withStyles } from '@material-ui/core/styles';

// material ui styles
const styles = theme => ({
    fullScreen: {
        minHeight: "100vh"
    },
    progress: {
        marginTop: "-200px",
        zIndex: "-1",
        margin: theme.spacing.unit * 2,
    },
});

// component
const Loader = ({ classes }) => (
    <Grid 
        container
        className={classes.fullScreen}
        alignItems="center"
        direction="row"
        justify="center"
    >
        <CircularProgress className={classes.progress} />
    </Grid>
)

export default withStyles(styles)(Loader)
