import React from 'react';

const RelatedTagItem = (props) => {
  const item = props.item;
  const itemTags = item.metadata.tags;
  return (
    <li>
      <h4>{item.title}</h4>
      <p>Tags:</p>
      <ul>
        {itemTags && itemTags.map( (tag, index) => <li key={index}>{tag.contentful_id}</li>)}
      </ul>
    </li>
  );
};

export default RelatedTagItem;
