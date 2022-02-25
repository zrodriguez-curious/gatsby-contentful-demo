const path = require('path');

exports.createPages = async ({ actions, graphql, reporter }) => {
  
  const MAX_ENTRIES = 3; // # related articles you want to query
  
  const { createPage } = actions
  const result = await graphql(`
    query ($id: String) {
      contentfulArticle(id: {eq: $id}) {
        contentful_id
        title
        blurb
        metadata {
          tags {
            contentful_id
          }
        }
      }
      allContentfulArticle {
        edges {
          node {
            title
            id
            contentful_id
            metadata {
              tags {
                name
                id
                contentful_id
              }
            }
          }
        }
      }
    }
  `)

  // handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return;
  }
  const articles = result.data.allContentfulArticle.edges;

  const findRelated = (ARTICLES, ARTICLE_ID, TAGS, MAX_ENTRIES) =>{

    if(!TAGS) return [];
    
    //find entries with tags in common
    let related = [...ARTICLES.filter(article => article.node.contentful_id != ARTICLE_ID && article.node.metadata.tags.some( tag => TAGS.includes(tag.contentful_id)))];
    
    //sort by max tags in common
    related = related.length > 0 ? 
      [...related.sort((a,b) => {
        function countRelated(article){ 
          let count = 0;
          article.node.metadata.tags.forEach(tag => TAGS.includes(tag.contentful_id) && count++);
          return count;
        };
      return countRelated(b) - countRelated(a);  
    })] : related;

    //if there are less than MAX_ENTRIES articles, add random articles to the end
    related = related.length < MAX_ENTRIES ? [...related, ...ARTICLES.filter(article => article.node.contentful_id != ARTICLE_ID && !related.map(item => item.contentful_id).includes(article.node.contentful_id)).slice(0, MAX_ENTRIES - related.length)] : related;

    //return article ids
    return related.length > 0 ? related.map(item => item.node.contentful_id).slice(0, MAX_ENTRIES) : [];
  }
  
  // Create post detail pages
  articles.forEach(({ node }) => {
    createPage({
      path: `${node.title}`,
      component: path.resolve("src/pages/{contentfulArticle.title}.js"),
      context: {
        id: node.id,
        relatedArticles: findRelated(articles, node.contentful_id, node.metadata.tags.map(tag => tag.contentful_id), MAX_ENTRIES),
        limit: MAX_ENTRIES,
      }
    })
  })
}