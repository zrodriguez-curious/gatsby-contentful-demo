const path = require('path');
const {relatedArticlesByTag} = require('./scripts/relatedArticlesByTag');

exports.createPages = async ({ actions, graphql, reporter }) => {
  
  const MAX_ENTRIES = 3; // # related articles you want to query
  
  const { createPage } = actions
  const result = await graphql(`
    query ($id: String) {
      contentfulArticle(id: {eq: $id}) {
        contentful_id
        title
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
  
  // Create post detail pages
  articles.forEach(({ node }) => {
    createPage({
      path: `${node.title}`,
      component: path.resolve("src/pages/{contentfulArticle.title}.js"),
      context: {
        id: node.id,
        relatedArticles: relatedArticlesByTag(articles, node.contentful_id, node.metadata.tags.map(tag => tag.contentful_id), MAX_ENTRIES,{table: true, returnTable: "log"}),
        limit: MAX_ENTRIES,
      }
    })
  })
}