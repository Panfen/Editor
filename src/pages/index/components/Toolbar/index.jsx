import React from 'react';
import { Icon, Tooltip } from 'antd';
import { tools } from 'src/constants';
import './index.scss';

export default () => (
  <div className="toolbar-container">
    {tools.map(group => (
      <div className="group" key={group.id}>
        {group.children.map(tool => (
          <Tooltip key={tool.key} title={tool.title}>
            <Icon type={tool.key} />
          </Tooltip>
        ))}
      </div>
    ))}
  </div>
);
