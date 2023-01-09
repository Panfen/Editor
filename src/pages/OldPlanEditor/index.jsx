import React, { useState, useEffect, useRef } from 'react';
import { message } from 'antd';
import './index.scss';

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

export default (props) => {
  const editorRef = useRef();
  const previousInfo = useRef({}); // 光标位置
  const scrollInfo = useRef({}); // 滚动条位置
  const [content, setContent] = useState();
  const [selectList, setSelectList] = useState([]);

  useEffect(() => {
    initData();
    editorRef.current.addEventListener('scroll', onEditorScroll);
    return () => {
      editorRef.current.removeEventListener('scroll', onEditorScroll);
    };
  }, []);

  const initData = (content = '') => {
    const initDiv = document.createElement('div');
    const initSpan = createNode('INITTIAL_ID', '', content);
    initDiv.appendChild(initSpan);
    editorRef.current.innerHTML = '';
    editorRef.current.appendChild(initDiv);
    collapseNode('INITTIAL_ID');
  };

  const onEditorScroll = (e) => {
    scrollInfo.current = editorRef.current.scrollTop;
  };

  const onSelect = (check) => {
    const sel = window.getSelection();
    const range = document.createRange();
    const { id = 'INITTIAL_ID', offset = 0 } = previousInfo.current;
    const targetNode = document.getElementById(id);

    if (targetNode?.className === 'tag') {
      // 引用项名称中间不能插入引用项
      const check = checkList.find(item => item.key === id.split('-')[0]);
      if (offset > 0 && offset < check.name.length + 1) {
        range.setStart(targetNode.firstChild, offset);
        range.setEnd(targetNode.firstChild, offset);
        sel.removeAllRanges();
        sel.addRange(range);
        return;
      }
    }

    const content = targetNode.textContent;
    // 前部分文字处理
    targetNode.textContent = content.substr(0, offset);
    // 分号节点
    const semicolonNode = createNode('', 'semicolon', '；');
    // 段首不插入分号；前面已经是分号不插入分号
    if (offset && targetNode?.className !== 'semicolon') {
      targetNode.parentNode.insertBefore(semicolonNode, targetNode.nextSibling);
    }
    // 插入引用项
    const tagNode = createNode(check.key, 'tag', `#${check.name}`);
    targetNode.parentNode.insertBefore(tagNode, offset && targetNode?.className !== 'semicolon' ? semicolonNode.nextSibling : targetNode.nextSibling);

    if (offset < content.length) {
      // 后部分文字/应用项处理
      const textNode = createNode(id !== 'INITTIAL_ID' ? id.split('-')[0] : '', targetNode.className, content.substr(offset));
      targetNode.parentNode.insertBefore(textNode, tagNode.nextSibling);
    }

    // 在一个应用前插入另一个引用
    if (tagNode.nextSibling?.className === 'tag') {
      targetNode.parentNode.insertBefore(semicolonNode, tagNode.nextSibling);
    }
    // 如果目标节点内容为空，则删除
    if (!targetNode.textContent) {
      targetNode.parentNode.removeChild(targetNode);
    }

    // 设置选中节点的当前range
    range.selectNode(tagNode);
    range.setStart(tagNode.firstChild, check.name.length + 1);
    range.setEnd(tagNode.firstChild, check.name.length + 1);
    sel.removeAllRanges();
    sel.addRange(range);

    // 保存光标信息
    previousInfo.current = {
      id: tagNode.getAttribute('id'),
      offset: check.name.length + 1,
    };

    editorRef.current.scrollTo(0, scrollInfo.current);

    getContent();
  };

  const onBlur = (e) => {
    const sel = window.getSelection();
    const { anchorNode, anchorOffset } = sel;
    const id = anchorNode?.parentElement?.id || anchorNode?.id || anchorNode?.lastChild?.id;
    if (id) {
      previousInfo.current = {
        id,
        offset: anchorOffset,
      };
    } else {
      previousInfo.current = {
        id: 'INITTIAL_ID',
        offset: 0,
      };
    }
  };

  const onClick = () => {
    const sel = window.getSelection();
    // 光标在引用项目
    if (sel.anchorNode.parentNode.className === 'tag') {
      previousInfo.current = {
        id: sel.anchorNode.parentNode.id,
        offset: sel.anchorOffset,
      };
    }
  };

  /**
	 * 创建span节点
	 */
  const createNode = (id = '', className = '', text = '') => {
    const newId = generateId(id);
    const node = document.createElement('span');
    node.setAttribute('id', id === 'INITTIAL_ID' ? id : newId);
    if (className) {
      node.setAttribute('class', className);
    }
    node.textContent = text;
    return node;
  };

  const generateId = (id = '') => `${id}-${new Date().getTime()}${Math.random().toFixed(2)}`;

  /**
	 * 光标移动至某个节点后
	 */
  const collapseNode = (id) => {
    console.log(id);
    setTimeout(() => {
      const sel = window.getSelection();
      const range = document.createRange();
      // 设置选中节点的当前range
      const node = document.getElementById(id);
      const offset = node.textContent.length;
      range.setStart(node.firstChild || node, offset);
      range.setEnd(node.firstChild || node, offset);
      sel.removeAllRanges();
      sel.addRange(range);
    });
  };

  const onInput = (e) => {
    getContent();
    const fistNode = editorRef.current.childNodes[0];
    if (!fistNode || fistNode?.nodeType === 3 || fistNode?.childNodes[0]?.nodeType === 3 || fistNode?.nodeName === 'BR') {
      initData(editorRef.current.textContent);
      return;
    }

    editorRef.current.childNodes.forEach((_node) => {
      // 换行后为span添加id
      _node.childNodes.forEach(childNode => {
        if (!childNode?.hasAttribute('id')) {
          const id = generateId();
          childNode.setAttribute('id', id);
          childNode.removeAttribute('class');
          previousInfo.current = {
            id,
            offset: 0,
          };
        }
      });

      // 换行后在上一行末尾添加分号
      if (_node.previousSibling) {
        const content = _node.previousSibling.lastChild?.textContent;
        if (content && !content.endsWith('；')) {
          const semicolonNode = createNode('', 'semicolon', '；');
          _node.previousSibling.appendChild(semicolonNode);
        }
      }

      // 处理引用项后输入和删除引用项
      _node.childNodes.forEach((node) => {
        const check = checkList.find(item => item.key === node.id?.split('-')[0]);
        if (node?.className === 'tag') {
          const sel = window.getSelection();
          const range = document.createRange();
          if (node.textContent.length > check?.name.length + 1) {
            // 引用项中间输入处理：不允许输入，恢复原状
            if (previousInfo.current.offset > 0 && previousInfo.current.offset < check.name.length + 1) {
              // 引用项内容重置
              node.textContent = `#${check.name}`;
              range.setStart(node.firstChild, previousInfo.current.offset);
              range.setEnd(node.firstChild, previousInfo.current.offset);
              sel.removeAllRanges();
              sel.addRange(range);
              return;
            }
            // 新文本节点的内容
            const textNodeCont = node.textContent.substr(check.name.length + 1);
            // 引用项内容重置
            node.textContent = `#${check.name}`;
            // 添加文本节点
            const textNode = createNode('', '', textNodeCont);
            if (previousInfo.current.offset) {
              _node.insertBefore(textNode, node.nextSibling);
            } else {
              _node.insertBefore(textNode, node);
              const semicolonNode = createNode('', 'semicolon', '；');
              _node.insertBefore(semicolonNode, node);
            }

            // 设置选中节点的当前range
            range.selectNode(textNode);
            sel.removeAllRanges();
            sel.addRange(range);
            // 光标移到节点之后
            sel.collapseToEnd();
          } else if (node.textContent.length < check?.name.length + 1) {
            // 从引用项中间回车换行处理：：不允许换行，恢复原状
            if (node.textContent + editorRef.current.lastChild.textContent === `#${check.name}`) {
              editorRef.current.removeChild(editorRef.current.lastChild);
              // 引用项内容重置
              node.textContent = `#${check.name}`;
              range.setStart(node.firstChild, previousInfo.current.offset);
              range.setEnd(node.firstChild, previousInfo.current.offset);
              sel.removeAllRanges();
              sel.addRange(range);
            } else {
              if (node.previousSibling?.id) {
                collapseNode(node.previousSibling?.id);
              }
              _node.removeChild(node);
            }
          }
        }
      });
    });
  };

  const getContent = () => {
    setTimeout(() => {
      setContent(editorRef.current.textContent);
      const newSelectList = [];
      editorRef.current.childNodes.forEach(_node => {
        _node.childNodes.forEach(node => {
          if (node.className === 'tag') {
            const check = checkList.find(item => item.name === node.textContent.substr(1));
            newSelectList.push(check);
          }
        });
      });
      const obj = {};
      const distinctList = newSelectList.reduce((acc, val) => {
        obj[val.key] ? '' : obj[val.key] = true && acc.push(val);
        return acc;
      }, []);
      setSelectList([...distinctList]);
    });
  };

  return (
    <div className="test-container">

      <div className="tag-box">
        {checkList.map(check => <div key={check.key} onClick={() => onSelect(check)}>{check.name}</div>)}
      </div>

      <div
        ref={editorRef}
        className="editor"
        contentEditable="true"
        onInput={onInput}
        onClick={onClick}
        onBlur={onBlur}
      />

      <div>已引用项目：{selectList.reduce((acc, val) => {
        acc.push(val.name);
        return acc;
      }, []).join('、')}
      </div>

      <div>预览：{content}</div>

    </div>
  );
};
