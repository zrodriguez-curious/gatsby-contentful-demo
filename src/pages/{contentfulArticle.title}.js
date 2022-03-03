import React from 'react';
import { graphql, Link } from 'gatsby';

import RelatedTagItem from '../components/RelatedTagItem';
import {sortRelatedTags} from '../../scripts/relatedArticlesByTag';

const Page = ({ data }) => {     
  const relatedArticles = sortRelatedTags(data.relatedArticles.edges, data.contentfulArticle.metadata.tags.map(tag => tag.contentful_id));

  return (
    <>
    <Link to="/"> ← Back to Index</Link>
    {!data.contentfulArticle ?
      <p>No article found</p> :
      <>
        <h2>{data.contentfulArticle.title}</h2>
        <p>{data.contentfulArticle.blurb}</p>
        <p>My tags:</p>
        <ul>
          {data.contentfulArticle.metadata.tags.map(tag => <li>{tag.contentful_id}</li>)}
        </ul>
        <hr />
        <h3>Related by tag:</h3>
        <ul>
          {relatedArticles && relatedArticles.length > 0 ?  
            relatedArticles.map((item, index) => <RelatedTagItem item={item.node} key={index} />)
          : <p>No data yet...</p>
        }
        </ul>
      </>
      }
      <hr />
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
