import React, { useContext } from 'react';
import { Container } from 'semantic-ui-react';

import { AuthContext } from '../context/auth';
import PostForm from '../components/PostForm';

function Create() {
  const { user } = useContext(AuthContext);
  return (
    user && (
      <Container className="create">
      <PostForm />
    </Container>
    )
  );
}

export default Create;
