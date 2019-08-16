import React, { Fragment } from 'react';
import { withTranslation } from 'react-i18next';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';

// images
import blockchain from './assets/blockchain.png'
import documents from './assets/documents.png'
import hyperledger from './assets/hyperledger-fabric.png'
import ipfs from './assets/ipfs.png'

// logos
import reactjs from './assets/reactjs.png'
import graphql from './assets/graphql.png'
import nodejs from './assets/nodejs.png'
import expressjs from './assets/expressjs.png'
import mongodb from './assets/mongodb.png'
import composer from './assets/composer.png'

// material ui styles
const styles = theme => ({
    main: {
        width: 'auto',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        display: 'block',
        [theme.breakpoints.up(900 + theme.spacing.unit * 3 * 2)]: {
            width: 900,
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
    section: {
        marginTop: '64px'
    },
    imageContainer: {
        zIndex: -1,
        textAlign: 'center',
    }
});

// component
const Main = ({ classes, t }) => (
    <Fragment>
        <div className={classes.main}>
            <Grid 
                container
                spacing={16}
                alignItems="center"
                className={classes.section}
            >
                <Grid
                    item
                    md={6}
                    xs={12}
                >
                    <Typography 
                        component="h1" 
                        variant="h2" 
                        align="left"
                        color="textPrimary" 
                        gutterBottom
                    >
                        {t('DMS')}
                    </Typography>
                    <Typography 
                        variant="subtitle1"
                        color="textSecondary" 
                        paragraph
                    >
                        {t('DMSdescription')}
                    </Typography>
                </Grid>
                <Grid
                    item
                    md={6}
                    xs={12}
                >
                    <div className={classes.imageContainer}>
                        <img 
                            src={documents} 
                            alt="documents"
                            width="400px" 
                        />
                    </div>
                </Grid>
            </Grid>
            <Paper className={classes.paper}>
                <Grid 
                    container
                    spacing={16}
                    alignItems="center"
                >
                    <Grid
                        item
                        md={8}
                        xs={12}
                    >
                        <Typography 
                            component="h1" 
                            variant="h5"
                            gutterBottom
                        >
                            {t('blockchainTechnology')}
                        </Typography>
                        <Typography 
                            variant="subtitle1"
                            color="textSecondary" 
                            paragraph
                        >
                            {t('blockchainDescription')}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        md={4}
                        xs={12}
                    >
                        <div className={classes.imageContainer}>
                            <img 
                                src={blockchain} 
                                alt="blockchain"
                                width="200px"
                            />
                        </div>
                    </Grid>
                </Grid>
            </Paper>
            <Grid 
                container
                spacing={16}
                alignItems="center"
                className={classes.section}
            >
                <Grid
                    item
                    md={6}
                    xs={12}
                >
                    <div className={classes.imageContainer}>
                        <img 
                            src={hyperledger} 
                            alt="hyperledger"
                            width="400px" 
                        />
                    </div>
                </Grid>
                <Grid
                    item
                    md={6}
                    xs={12}
                >
                    <Typography 
                        component="h1" 
                        variant="h5"
                        gutterBottom
                    >
                        {t('hyperledgerFabric')}
                    </Typography>
                    <Typography 
                        variant="subtitle1"
                        color="textSecondary" 
                        paragraph
                    >
                        {t('fabricDescription')}
                    </Typography>
                </Grid>
            </Grid>
            <Paper className={classes.paper}>
                <Grid 
                    container
                    spacing={16}
                    alignItems="center"
                >
                    <Grid
                        item
                        md={8}
                        xs={12}
                    >
                        <Typography 
                            component="h1" 
                            variant="h5"
                            gutterBottom
                        >
                            {t('IPFS')}
                        </Typography>
                        <Typography 
                            variant="subtitle1"
                            color="textSecondary" 
                            paragraph
                        >
                            {t('IPFSdescription')}
                        </Typography>
                    </Grid>
                    <Grid
                        item
                        md={4}
                        xs={12}
                    >
                        <div className={classes.imageContainer}>
                            <img 
                                src={ipfs} 
                                alt="ipfs"
                                width="200px"
                            />
                        </div>
                    </Grid>
                </Grid>
            </Paper>
            <Grid 
                container
                spacing={16}
                alignItems="center"
                className={classes.section}
            >
                <Grid
                    item
                    md={2}
                    xs={12}
                >
                    <div className={classes.imageContainer}>
                        <img 
                            src={reactjs} 
                            alt="reactjs"
                            width="100px"
                        />
                    </div>
                </Grid>
                <Grid
                    item
                    md={2}
                    xs={12}
                >
                    <div className={classes.imageContainer}>
                        <img 
                            src={graphql} 
                            alt="graphql"
                            width="100px"
                        />
                    </div>
                </Grid>
                <Grid
                    item
                    md={2}
                    xs={12}
                >
                    <div className={classes.imageContainer}>
                        <img 
                            src={nodejs} 
                            alt="nodejs"
                            width="100px"
                        />
                    </div>
                </Grid>
                <Grid
                    item
                    md={2}
                    xs={12}
                >
                    <div className={classes.imageContainer}>
                        <img 
                            src={expressjs} 
                            alt="expressjs"
                            width="100px"
                        />
                    </div>
                </Grid>
                <Grid
                    item
                    md={2}
                    xs={12}
                >
                    <div className={classes.imageContainer}>
                        <img 
                            src={mongodb} 
                            alt="mongodb"
                            width="100px"
                        />
                    </div>
                </Grid>
                <Grid
                    item
                    md={2}
                    xs={12}
                >
                    <div className={classes.imageContainer}>
                        <img 
                            src={composer} 
                            alt="composer"
                            width="100px"
                        />
                    </div>
                </Grid>
            </Grid>
        </div>
    </Fragment>
)

export default withStyles(styles)(withTranslation()(Main));
