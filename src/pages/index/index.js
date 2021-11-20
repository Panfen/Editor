import React, { useState } from 'react';
import { Icon } from 'antd';
import Toolbar from './components/Toolbar';
import EditArea from './components/EditArea';
import { initData } from 'src/constants';
import DocumentModal from './model/Document'
import './index.scss';

export default () => {

  const [data, setData] = useState(DocumentModal.create(initData));

  return (
    <div className="container">
      <Toolbar />
      <EditArea data={data} />
    </div>
  );
}
