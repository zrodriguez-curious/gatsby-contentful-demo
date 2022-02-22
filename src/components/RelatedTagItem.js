import React from 'react';

const RelatedTagItem = (props) => {
  const item = props.item;
  const itemTags = item.metadata.tags;
  return (
    <li>
      <h4>{item.fields.title}</h4>
      <p>Tags:</p>
      <ul>
        {itemTags && itemTags.map( (tag, index) => <li item={item} key={index}>{tag.sys.id}</li>)}
      </ul>
    </li>
  );
};

export default RelatedTagItem;
