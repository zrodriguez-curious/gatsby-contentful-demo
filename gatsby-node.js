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

  const findRelated = (ARTICLES, TAGS, MAX_ENTRIES) =>{
    
    //let related = [];
    //find entries with tags in common
    // console.log("article", JSON.stringify(articles.map(article => article.node), null,2));
    let related = [...ARTICLES.filter(article => article.node.metadata.tags.some( tag => TAGS.includes(tag))).map(item => item.node.contentful_id)];
    console.log("contentful_ids",related);
    
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
        relatedArticles: findRelated(articles, node.metadata.tags, 3),
      }
    })
  })

}