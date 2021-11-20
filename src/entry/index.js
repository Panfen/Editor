import React from 'react';
import ReactDOM from 'react-dom';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import RouterConfig from './router';
import './index.css';

import stores from '../stores';

useStrict(true);
ReactDOM.render(<Provider {...stores}><RouterConfig /></Provider>, document.getElementById('root'));
