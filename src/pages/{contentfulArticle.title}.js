import React from 'react';
import { graphql, Link } from 'gatsby';

import RelatedTagItem from '../components/RelatedTagItem';

const Page = ({ data }) => {     
  return (
    <>
    <Link to="/"> ← Back to Index</Link>
    {!data.contentfulArticle ?
      <p>No article found</p> :
      <>
        <h2>{data.contentfulArticle.title}</h2>
        <p>{data.contentfulArticle.blurb}</p>
        <p>my tags:</p>
        <ul>
          {data.contentfulArticle.metadata.tags.map(tag => <li>{tag.contentful_id}</li>)}
        </ul>
        <h3>Related by tag:</h3>
        <ol>
          {data.relatedArticles.edges && data.relatedArticles.edges.length > 0 ?  
            data.relatedArticles.edges.map((item, index) => <RelatedTagItem item={item.node} key={index} />)
          : <p>No data yet...</p>
        }
        </ol>
      </>
      }
      <p><strong>Raw:</strong></p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
      <a href="#">^Top</a><br />
      <Link to="/"> ← Back to index</Link>
    </>
 );
};

export const data = graphql`
query ($id: String, $relatedArticles: [String], $limit: Int) {
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
  relatedArticles: allContentfulArticle(filter: {contentful_id: {in: $relatedArticles}}, limit: $limit) {
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
`;

export default Page;
