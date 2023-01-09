import React from 'react';
import Segment from '../Segment';

export default ({ data }) => {
  const { id, style, segments } = data;
  return (
    <div className="paragraph" id={id} style={style}>
      {segments.map(segment => <Segment key={segment.id} data={segment} />)}
    </div>
  );
};
