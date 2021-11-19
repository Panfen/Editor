import React, { useState } from 'react';
import { Icon } from 'antd';
import Toolbar from './components/Toolbar';
import './index.scss';

export default () => {

  return (
    <div className="container">
      <Toolbar />
      <div id="editor" contenteditable="true"></div>
    </div>
  );
}
