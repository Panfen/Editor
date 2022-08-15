import React, { useState, useRef } from 'react';
import ContentEditable from 'react-contenteditable';
import { checkList } from '../test2/constants'; 
import './index.scss';

export default (props) => {

  const [html, setHtml] = useState('');
  const contentEditable = useRef();
  
  const handleChange = e => {
    setHtml(e.target.value);
    console.log(e.target.value)
    const sel = window.getSelection()
    console.log(sel)
  };

  const onSelect = (check) => {
    const newHtml = html + `<span id="1" class="tag">#${check.name}</span>`;
    setHtml(newHtml)
  }


  return (
    <div className="test-container">
      <div className="tag-box">
        {checkList.map(check => <div key={check.id} onClick={() => onSelect(check)}>{check.name}</div>)}
      </div>

      <ContentEditable
        innerRef={contentEditable}
        html={html}
        disabled={false}       // use true to disable editing
        onChange={handleChange} // handle innerHTML change
        tagName='article' // Use a custom HTML tag (uses a div by default)
      />
    </div>
  )

};