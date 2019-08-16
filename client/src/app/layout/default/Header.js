import React from 'react';
import { Link } from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';

import { withStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';

// material ui styles
const styles = theme => ({
    root: {
      flexGrow: 1,
    },
    grow: {
      flexGrow: 1,
    },
    brand: {
        textDecoration: 'none'
    },
    button: {
        '&:hover': {
            color: 'white'
        }
    }
});

// component
const Header = ({ location: { pathname }, classes, t, i18n }) => (
    <AppBar 
        position="static"
        className={classes.root}
    >
        <Toolbar>
            <Typography 
                noWrap
                variant="h6" 
                color="inherit" 
                to="/"
                replace={"/" === pathname}
                component={Link}
                className={classes.brand}
            >
                {t('DMS')}
            </Typography>
            <div className={classes.grow} />
            <Button 
                color="inherit"
                to="/signup"
                replace={"/signup" === pathname}
                component={Link}
                className={classes.button}
            >
                {t('registration')}
            </Button>
            <Button 
                color="inherit"
                to="/login"
                replace={"/login" === pathname}
                component={Link}
                className={classes.button}
            >
                {t('signIn')}
            </Button>
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

export default withStyles(styles)((withRouter(withTranslation()(Header))))
