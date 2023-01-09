/**
 * 复查计划编辑器优化版本
 */

import React, { useState, useRef } from 'react';

const checkList = [
  {
    key: '1',
    name: '血常规',
  },
  {
    key: '2',
    name: '血生化',
  },
  {
    key: '3',
    name: '肝功能',
  },
  {
    key: '4',
    name: '肾功能',
  },
  {
    key: '5',
    name: '电解质',
  },
];

const PlanEditor = () => {
  const [selectList, setSelectList] = useState([]);
  const editorRef = useRef();

  /**
   * 编辑区输入
   */
  const onEditorInput = () => {

  };

  /**
   * 编辑区点击
   */
  const onEditorClick = () => {

  };

  /**
   * 编辑区失焦
   */
  const onEditorBlur = () => {

  };

  /**
   * 选择标签
   */
  const onTagSelect = () => {

  };


  return (
    <div className="test-container">

      <div className="tag-box">
        {checkList.map(check => <div key={check.key} onClick={() => onTagSelect(check)}>{check.name}</div>)}
      </div>

      <div
        ref={editorRef}
        className="editor"
        contentEditable="true"
        onInput={onEditorInput}
        onClick={onEditorClick}
        onBlur={onEditorBlur}
      />
    </div>
  );
};

export default PlanEditor;
