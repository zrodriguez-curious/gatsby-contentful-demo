import React from 'react';
import { Link, graphql } from 'gatsby';

const Index = ({data}) => {
  return (
    <main>
        <h1>All articles:</h1>
        <ul>
            {data.allContentfulArticle.edges.map((article, index) => <li key={index}><Link to={`/${article.node.title}`}>{article.node.title}</Link></li>)}
        </ul>
    </main>
  );
};

export const data = graphql`
query {
    allContentfulArticle{
        edges {
            node {
                title
            }
        }
    }
}
`;

export default Index;
