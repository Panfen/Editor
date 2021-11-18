import React from 'react';
import ReactDOM from 'react-dom';
import { useStrict } from 'mobx';
import { Provider } from 'mobx-react';
import { LocaleProvider } from 'antd';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import RouterConfig from './router';
import moment from 'moment';
import 'moment/locale/zh-cn';
moment.locale('zh-cn');
// import 'antd/dist/antd.css';
import './index.css';

import stores from '../stores';

useStrict(true);
ReactDOM.render(<LocaleProvider locale={zhCN}><Provider {...stores}><RouterConfig /></Provider></LocaleProvider>, document.getElementById('root'));
