import React, { useState } from 'react';
import classNames from 'classnames';
import { Link, withRouter } from 'react-router-dom';
import { withTranslation } from 'react-i18next';
import { withApollo } from 'react-apollo';

import { withStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import Badge from '@material-ui/core/Badge';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';

import PeopleIcon from '@material-ui/icons/People';
import SettingsPowerIcon from '@material-ui/icons/SettingsPower';
import AssignmentIcon from '@material-ui/icons/Assignment';
import LayersIcon from '@material-ui/icons/Layers';
import AccountCircle from '@material-ui/icons/AccountCircle';

// import gql from 'graphql-tag'
// import { Subscription } from 'react-apollo';

import logout from '../../helpers/logout'

//  qraphql subscription
// const newDocumentsCount = gql`
//     subscription {
//         newDocumentsCount {
//             count
//         }
//     }
// `;

const drawerWidth = 240;

// material ui styles
const styles = theme => ({
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing.unit * 7 + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing.unit * 9 + 1,
        },
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: '0 8px',
        ...theme.mixins.toolbar,
    },
    badgeMargin: {
        margin: '0 16px',
    }
});

// component
const Sidebar = ({ classes, theme, open, handleDrawerClose, history, location: { pathname }, client, t }) => {

    const [count, setCount] = useState(0)

    return (
        <Drawer
            variant="permanent"
            className={classNames(classes.drawer, {
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
            })}
            classes={{
                paper: classNames({
                [classes.drawerOpen]: open,
                [classes.drawerClose]: !open,
                }),
            }}
            open={open}
        >
            <div className={classes.toolbar}>
                <IconButton onClick={handleDrawerClose}>
                    {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                </IconButton>
            </div>
            <Divider />
            <List>
                <ListItem 
                    button
                    disableRipple
                    component={Link}
                    to="/profile"
                    replace={"/profile" === pathname}
                >
                    <ListItemIcon><AccountCircle /></ListItemIcon>
                    <ListItemText primary={t('profile')} />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem 
                    button
                    disableRipple
                    component={Link}
                    to="/documents"
                    replace={"/documents" === pathname}
                    onClick={() => setCount(0)}
                >
                    <ListItemIcon><AssignmentIcon /></ListItemIcon>
                    {/* <Subscription
                        subscription={newDocumentsCount}
                        onSubscriptionData={() => {
                            if ("/documents" !== pathname) {
                                setCount(count + 1)
                            }   
                        }}
                    /> */}
                    <Badge color="primary" badgeContent={count} className={classes.badgeMargin}>
                        <ListItemText primary={t('documents')} />
                    </Badge>
                </ListItem>
                <ListItem 
                    button
                    disableRipple
                    component={Link}
                    to="/employees"
                    replace={"/employees" === pathname}
                >
                    <ListItemIcon><PeopleIcon /></ListItemIcon>
                    <ListItemText primary={t('employees')} />
                </ListItem>
                <ListItem 
                    button
                    disableRipple
                    component={Link}
                    to="/templates"
                    replace={"/templates" === pathname}
                >
                    <ListItemIcon><LayersIcon /></ListItemIcon>
                    <ListItemText primary={t('templates')} />
                </ListItem>
            </List>
            <Divider />
            <List>
                <ListItem 
                    button
                    disableRipple
                    onClick={async () => {
                        await logout(client, history)
                    }}
                >
                    <ListItemIcon><SettingsPowerIcon /></ListItemIcon>
                    <ListItemText primary={t('logout')} />
                </ListItem>
            </List>
        </Drawer>
    )
}

export default withRouter(withApollo(withStyles(styles, { withTheme: true })(withTranslation()(Sidebar))))
