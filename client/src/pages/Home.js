import React from 'react';
import { useQuery } from '@apollo/react-hooks';
import { Grid, Transition, Loader } from 'semantic-ui-react';


import PostCard from '../components/PostCard';
import { FETCH_POSTS_QUERY } from '../util/graphql';

import './Home.css'

function Home() {
  const {
    loading,
    data: { getPosts: posts } = {}} = useQuery(FETCH_POSTS_QUERY);

  return (
    <Grid className="home" columns={3}>
      <Grid.Row className="page-title">
        <h1>Entdecke</h1>
      </Grid.Row>
      <Grid.Row>
        {loading ? (
          <Loader indeterminate active inline='centered'><h3>Durchstöbere Bücherregal . .</h3></Loader>
        ) : (
          <Transition.Group>
            {posts &&
              posts.map((post) => (
                <Grid.Column key={post.id} style={{ marginBottom: 20 }}>
                  <PostCard post={post} />
                </Grid.Column>
              ))}
          </Transition.Group>
        )}
      </Grid.Row>
    </Grid>
  );
}

export default Home;
