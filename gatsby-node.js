const path = require('path');

exports.createPages = async ({ actions, graphql, reporter }) => {
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
    return
  }
  const articles = result.data.allContentfulArticle.edges;
  // const tags = result.data.contentfulArticle.metadata.tags;

  const findRelated = (ARTICLES, ARTICLE_ID, TAGS, MAX_ENTRIES) =>{

    if(!TAGS) return [];
    
    //find entries with tags in common
    console.log("articleId : ", ARTICLE_ID);
    let related = [...ARTICLES.filter(article => article.node.contentful_id != ARTICLE_ID && article.node.metadata.tags.some( tag => TAGS.includes(tag.contentful_id))).map(item => item.node.contentful_id)];

    console.log("contentful_ids : ", related);
    console.log("=====");
    
    //sort by max tags in common
    //related = [...related.sort((a,b) =>{})
    return related; 
  }
  
  // Create post detail pages
  articles.forEach(({ node }) => {
    createPage({
      path: `created-${node.title}`,
      component: path.resolve("src/pages/{contentfulArticle.title}.js"),
      context: {
        id: node.id,
        //relatedArticles: ["1N1O4CRiW7czoDIN7e1kXJ","4ezUdy1GeM3RuYZiMI6diy","7Fy41Y04OPrmIx1bv1Td1i"],
        relatedArticles: findRelated(articles, node.contentful_id, node.metadata.tags.map(tag => tag.contentful_id), 3),
      }
    })
  })

}