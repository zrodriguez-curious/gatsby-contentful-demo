import React from 'react';
import { graphql } from 'gatsby';
import * as contentful from 'contentful';

import RelatedTagItem from '../components/RelatedTagItem';

const Page = ({ data }) => { 

  const [related, setRelated] = React.useState([]);

  React.useEffect(()=>{
    queryRelated();
  },[])

  function queryRelated (){
    const MAX_ENTRIES = 3; //maximum related articles that we want
    const TAGS = data.contentfulArticle.metadata.tags.map(tag => tag.contentful_id).join();

    /* query articles with related tags and store in state */
      const client = contentful.createClient({
        space: "tkehvr0h8fou",
        accessToken: "LjALFtRQ13-x8veoRDst8N0-J9N4L2J7gRS9GI2V3gc"
      });

        //first try to get articles that match ALL tags      
      client
        .getEntries({'metadata.tags.sys.id[all]': TAGS, limit: MAX_ENTRIES})
        .then(allEntries => {
          let resultsList = [...allEntries.items];
          
          //if we get less than the number of results we want, query results that match ANY tags
          return resultsList.length >= MAX_ENTRIES ? [...resultsList.items].slice(0, MAX_ENTRIES) 
            : client.getEntries({'metadata.tags.sys.id[in]': TAGS, limit: MAX_ENTRIES})
              .then(anyEntries => resultsList = [...resultsList, ...anyEntries.items].slice(0, MAX_ENTRIES));
        })
        .then(data => {
          console.log("res : ", data);
          setRelated(data);
        })
        .catch(err => console.log(err));
      }
    
  return (
    <>
      <h2>{data.contentfulArticle.blurb}</h2>
      <p>{data.contentfulArticle.content}</p>
      <h3>Related by tag:</h3>
      <ol>
        {related && related.length > 0 ?  
          related.map((item, index) => <RelatedTagItem item={item} key={index} />)
        : <p>No data yet...</p>
      }
      </ol>
     </>
 );
};

export const data = graphql`
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
}
`;

export default Page;
