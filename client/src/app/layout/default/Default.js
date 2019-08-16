import React, { Fragment } from 'react';
import { withTranslation, Trans } from 'react-i18next';

import { withStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';

import Header from './Header';

// material ui styles
const styles = theme => ({
    footer: {
        marginTop: '48px',
        marginBottom: '32px'
    }
});

// component
const Default = ({ children, classes, name = 'JJsd' }) => (
    <Fragment>
        <Header />
        <main>
            {children}
        </main>
        <footer>
            <Typography
                align="center" 
                color="textSecondary"
                className={classes.footer}
            >
                <Trans i18nKey="madeWithLove">
                    Made with <span role="img" aria-label="Love">❤️</span>
                </Trans>
            </Typography>
        </footer>
    </Fragment>
)

export default withStyles(styles)(withTranslation()(Default));
