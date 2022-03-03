function sortRelated(a, b, tags, {ties = "date"}={}){
  function countRelated(article){ 
  let count = 0;
  article.node.metadata.tags.forEach(articleTag => tags.includes(articleTag.contentful_id) && ++count);        
  return count;
};

  if (countRelated(a) > countRelated(b)) {
    return -1;
  }
  if (countRelated(a) < countRelated(b)) {
    return 1;
  }

  if(ties === "random") return Math.random() > .5 ? 1 : -1;
  else if(ties === "date"){
    if (a.node.createdAt > b.node.createdAt) {
      return -1;
    }
    if (a.node.createdAt < b.node.createdAt) {
      return 1;
    }
  }

  return 0
}

/* 
  returns sorted list of ids for articles with tags in common with ARTICLE_ID 
*/
exports.getRelatedTags = (ARTICLES, ARTICLE_ID, TAGS, MAX_ENTRIES = 3) => {
  if(!TAGS) return [];
  
  //find entries with tags in common
  let related = [...ARTICLES.filter(article => article.node.contentful_id !== ARTICLE_ID && article.node.metadata.tags.some( tag => TAGS.includes(tag.contentful_id) ))];

  //sort by max tags in common
  if(related.length > 0) related = [...related.sort((a,b) => sortRelated(a,b,TAGS))];

  //if there are less than MAX_ENTRIES articles, add random articles to the end
  if(related.length < MAX_ENTRIES) related = [...related, ...ARTICLES.filter(article => article.node.contentful_id !== ARTICLE_ID && !related.map(item => item.contentful_id).includes(article.node.contentful_id)).slice(0, MAX_ENTRIES - related.length)];

  //return article ids
  return related.length > 0 ? related.map(item => item.node.contentful_id).slice(0, MAX_ENTRIES) : [];
}

/*
  sorts ARTICLES with tags in common with TAGS
  returns whole article, not ids 
*/
exports.sortRelatedTags = (ARTICLES, TAGS) => {
  if(!TAGS) return [];
  
  //sort by max tags in common
  return [...ARTICLES.sort((a,b) => sortRelated(a,b,TAGS))];
}