exports.relatedArticlesByTag = (ARTICLES, ARTICLE_ID, TAGS, MAX_ENTRIES = 3) => {
  if(!TAGS) return [];
  
  //find entries with tags in common
  let related = [...ARTICLES.filter(article => article.node.contentful_id != ARTICLE_ID && article.node.metadata.tags.some( tag => TAGS.includes(tag.contentful_id) ))];

  //sort by max tags in common
  if(related.length > 0) related = 
    [...related.sort((a,b) => {

      function countRelated(article, tags){ 
        let count = 0;
        article.node.metadata.tags.forEach(tag => tags.includes(tag.contentful_id) && count++);
        return count;
      };

      if (countRelated(a, TAGS) < countRelated(b, TAGS)) {
        return -1;
      }
      if (countRelated(a, TAGS) > countRelated(b, TAGS)) {
        return 1;
      }
      //if tie, choose random
      return Math.random() > .5 ? 1 : -1;
    }
  )];

  //if there are less than MAX_ENTRIES articles, add random articles to the end
  if(related.length < MAX_ENTRIES) related = [...related, ...ARTICLES.filter(article => article.node.contentful_id != ARTICLE_ID && !related.map(item => item.contentful_id).includes(article.node.contentful_id)).slice(0, MAX_ENTRIES - related.length)];

  //return article ids
  return related.length > 0 ? related.map(item => item.node.contentful_id).slice(0, MAX_ENTRIES) : [];
}