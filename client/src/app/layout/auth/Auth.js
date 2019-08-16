import React, { useState } from 'react';

import { withStyles } from '@material-ui/core/styles';

import Header from './Header';
import Sidebar from './Sidebar';

// material ui style
const styles = theme => ({
    root: {
        display: 'flex',
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing.unit * 3,
    }
});

const Auth = ({ classes, children }) => {

    // hooks
    const [open, setOpen] = useState(true);

    // methods
    const handleDrawerOpen = () => setOpen(true)
    const handleDrawerClose = () => setOpen(false)

    return (
        <div className={classes.root}>
            <Header
                open={open}
                handleDrawerOpen={handleDrawerOpen}
            />
            <Sidebar
                open={open}
                handleDrawerClose={handleDrawerClose}
            />
            <main className={classes.content}>
                <div className={classes.toolbar} />
                {children}
            </main> 
        </div>
    )
}

export default withStyles(styles)(Auth)
