/**
 * @name: Main组件
 * @description: 主layout组件
 */

import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import './style.scss';

@inject('layoutStore')
@observer
export default class extends Component {
  render() {
    return (<div className="layout-content">
        {this.props.children}
      </div>
    );
  }
}
