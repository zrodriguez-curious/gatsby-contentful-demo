import React from 'react';
import { graphql } from 'gatsby';
import * as contentful from 'contentful';

import RelatedTagItem from '../components/RelatedTagItem';

const Page = ({ data }) => { 
  // function queryRelated (){
  //   const MAX_ENTRIES = 3; //maximum related articles that we want
  //   const TAGS = data.contentfulArticle.metadata.tags.map(tag => tag.contentful_id).join();

  //   /* query articles with related tags and store in state */
  //     const client = contentful.createClient({
  //       space: "tkehvr0h8fou",
  //       accessToken: "LjALFtRQ13-x8veoRDst8N0-J9N4L2J7gRS9GI2V3gc"
  //     });

  //       //first try to get articles that match ALL tags      
  //     client
  //       .getEntries({'metadata.tags.sys.id[all]': TAGS, limit: MAX_ENTRIES})
  //       .then(allEntries => {
  //         let resultsList = [...allEntries.items];
          
  //         //if we get less than the number of results we want, query results that match ANY tags
  //         return resultsList.length >= MAX_ENTRIES ? [...resultsList.items].slice(0, MAX_ENTRIES) 
  //           : client.getEntries({'metadata.tags.sys.id[in]': TAGS, limit: MAX_ENTRIES})
  //             .then(anyEntries => resultsList = [...resultsList, ...anyEntries.items].slice(0, MAX_ENTRIES));
  //       })
  //       .then(data => {
  //         console.log("res : ", data);
  //         setRelated(data);
  //       })
  //       .catch(err => console.log(err));
  //     }
    
  return (
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
      <p><strong>Raw:</strong></p>
      <pre>{JSON.stringify(data, null, 2)}</pre>
     </>
 );
};

export const data = graphql`
query ($id: String, $relatedArticles: [String]) {
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
  relatedArticles: allContentfulArticle(filter: {contentful_id: {in: $relatedArticles}}) {
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
