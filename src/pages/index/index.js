import React from 'react';
import { Icon } from 'antd';
import Toolbar from './components/Toolbar';
import EditArea from './components/EditArea';
import { initData } from 'src/constants';
import './index.scss';

export default () => {

  return (
    <div className="container">
      <Toolbar />
      <EditArea data={initData} />
    </div>
  );
}
