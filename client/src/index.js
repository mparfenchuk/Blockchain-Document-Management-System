import React from 'react';
import ReactDOM from 'react-dom';
import 'typeface-roboto';

import App from './app';

import * as serviceWorker from './serviceWorker';

import './i18n';

ReactDOM.render((<App />),document.getElementById('root'));

serviceWorker.unregister();
