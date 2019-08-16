import React from 'react';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import classNames from 'classnames';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';
import MenuIcon from '@material-ui/icons/Menu';

const drawerWidth = 240;

// material ui styles
const styles = theme => ({
    grow: {
        flexGrow: 1
    },
    toolbar: {
        paddingRight: 24,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginLeft: 12,
        marginRight: 36,
    },
    hide: {
        display: 'none',
    }
});

// title method
const getTitle = (match, t) => {
    if (match === null) {
        return t('pageNotFound')
    } else {
        switch (match.path) {
            case '/profile':
                return t('profile')
            case '/documents':
                return t('documents')
            case '/document/:id':
                return t('document')
            case '/employees':
                return t('employees')
            case '/employee/:id':
                return t('employee')
            case '/templates':
                return t('templates')
            default:
                return
        }
    }
    
}

// component
const Header = ({ classes, match, open, handleDrawerOpen, t, i18n }) => (
    <AppBar 
        position="fixed"
        className={classNames(classes.appBar, {
            [classes.appBarShift]: open,
        })}
    >
        <Toolbar 
            disableGutters={!open}
            className={classes.toolbar}
        >
            <IconButton
                color="inherit"
                aria-label="Open drawer"
                onClick={handleDrawerOpen}
                className={classNames(classes.menuButton, {
                    [classes.hide]: open,
                })}
            >
                <MenuIcon />
            </IconButton>
            <Typography 
                variant="h6" 
                color="inherit" 
                noWrap
            >
                {getTitle(match, t)}
            </Typography>
            <div className={classes.grow} />
            <Button 
                color="inherit"
                size="small"
                className={classes.button}
                disabled={i18n.language === 'en'}
                onClick={() => i18n.changeLanguage('en')}
            >
                en
            </Button>
            <Button 
                color="inherit"
                size="small"
                className={classes.button}
                disabled={i18n.language === 'uk'}
                onClick={() => i18n.changeLanguage('uk')}
            >
                укр
            </Button>
        </Toolbar>
    </AppBar>
)

export default withRouter(withStyles(styles)(withTranslation()(Header)))
