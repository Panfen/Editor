/**
 * 网易云课堂实践项目
 * https://course.study.163.com/480000006852373/learning
 */

import React from 'react';
import { initData } from 'src/constants';
import Toolbar from './components/Toolbar';
import EditArea from './components/EditArea';
import './index.scss';

export default () => (
  <div className="container">
    <Toolbar />
    <EditArea data={initData} />
  </div>
);
