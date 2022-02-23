exports.createPages = async ({ actions, graphql, reporter }) => {
  const { createPage } = actions
  const result = await graphql`
    query($id: String) {
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
  `

  // handle errors
  if (result.errors) {
    reporter.panicOnBuild(`Error while running GraphQL query.`)
    return
  }
  const articles = result.data.allContentfulArticle.edges;
  const tags = result.data.contentfulArticle.metadata.tags;
  
  const findRelated = (tags, MAX_ENTRIES) =>{
    let related = [];
    //find entries with any tags in common
    related = [...articles.filter(article => article.metadata.tags.some( tag => tags.includes(tag)))];
    
    //sort by max tags in common
    //related = [...related.sort((a,b) =>{})

    related = [...related.slice(0, MAX_ENTRIES)];
    console.log("related1 : ", related);

    return related;
  }

  // Create post detail pages
  articles.forEach(({ node }) => {
    createPage({
      path: node.fields.title,
      component: "./src/pages/{contentfulArticle.title}.js",
      context: {
        relatedArticles: findRelated(node.metadata.tags, 3),
      }
    })
  })

}