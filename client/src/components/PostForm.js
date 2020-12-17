import React, { useState, useEffect } from 'react';
import { Grid, Button, Form } from 'semantic-ui-react';
import gql from 'graphql-tag';
import { useMutation } from '@apollo/react-hooks';
import axios from 'axios';

import { useForm } from '../util/hooks';
import { FETCH_POSTS_QUERY } from '../util/graphql';


require('../index.css');

function PostForm() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState([]);
  const { values, onChange, onSubmit, fillForm } = useForm(createPostCallback, {
    isbn: '',
    title: '',
    author: '',
    condition: '',
    body: ''
  });

  const [createPost, { error }] = useMutation(CREATE_POST_MUTATION, {
    variables: values,
    update(proxy, result) {
      const data = proxy.readQuery({
        query: FETCH_POSTS_QUERY
      });
      data.getPosts = [result.data.createPost, ...data.getPosts];
      proxy.writeQuery({ query: FETCH_POSTS_QUERY, data });
      values.isbn = '';
      values.title = '';
      values.author = '';
      values.condition = '';
      values.body = '';
    }
  });

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      console.log(query)
      axios
        .get(
          "https://www.googleapis.com/books/v1/volumes?q=" +
            query +
            "&maxResults=40"
        )
        .then((data) => {
          console.log(data.data.items);
          if (data.data.items !== undefined) {setItems(data.data.items);}
        });
    }, 1)

    return () => clearTimeout(delayDebounceFn)
  }, [query])

  function createPostCallback() {
    createPost();
  }



  return (
    <>
      <Grid columns={2}>
        <Grid.Row className="page-title">
          <h1>Angebot Erstellen</h1>
        </Grid.Row>

        <Grid.Row>
          
            <Grid.Column className="postform">
            <Form>
              <h3>Finden Sie Ihr Buch:</h3>
              <Form.Field>
                <Form.Input
                  placeholder="Suchen"
                  name="search"
                  onChange={(e) => setQuery(e.target.value)}
                  >
                </Form.Input>
              </Form.Field>
            </Form>
            <div class="ui divider"></div>
                <Form onSubmit={onSubmit}>
                  <Form.Field>
                  <Form.Input
                      placeholder="ISBN"
                      name="isbn"
                      value={values.isbn}
                      error={error ? true : false}
                    />
                  <Form.Input
                      placeholder="Titel"
                      name="title"
                      value={values.title}
                      error={error ? true : false}
                    />
                  <Form.Input
                      placeholder="Autor"
                      name="author"
                      value={values.author}
                      error={error ? true : false}
                    />
                  <Form.Input
                      placeholder="Zustand"
                      name="condition"
                      onChange={onChange}
                      value={values.condition}
                      error={error ? true : false}
                    />
                    <Form.Input
                      placeholder="Beschreibung"
                      name="body"
                      onChange={onChange}
                      value={values.body}
                      error={error ? true : false}
                    />
                    <div class="ui placeholder segment">
                      <div class="ui icon header">
                        <i class="image file outline icon"></i>
                        Fotos hier hochladen
                      </div>
                      <div class="ui primary button">Hochladen</div>
                    </div>
                    <Button type="submit" color="primary">
                      Veröffentlichen
                    </Button>
                  </Form.Field>
                </Form>
                {error && (
                  <div className="ui error message" style={{ marginBottom: 20 }}>
                    <ul className="list">
                      <li>{error.graphQLErrors[0].message}</li>
                    </ul>
                  </div>
                )}
                
            </Grid.Column>
            <Grid.Column>
            <div>
              {items.map((query, i) => (
                <img 
                  key={i}
                  className="bookApiImage"
                  src={
                    query.volumeInfo.imageLinks === undefined
                      ? ""
                      : query.volumeInfo.imageLinks.thumbnail
                  } 
                  alt={query.title} 
                  onClick={() => {
                    const identifier = query.volumeInfo.industryIdentifiers[1]
                      ? query.volumeInfo.industryIdentifiers[1].identifier
                      : "Nicht vorhanden";
                    fillForm(identifier, query.volumeInfo.title, query.volumeInfo.authors[0]);
                  }}
                />
              ))}
            </div>
            </Grid.Column>
        </Grid.Row>
      </Grid>
    </>
  );
}

const CREATE_POST_MUTATION = gql`
  mutation createPost(
    $isbn: String!
    $title: String!
    $author: String!
    $condition: String!
    $body: String!
    ) {
    createPost(
      isbn: $isbn
      title: $title
      author: $author
      condition: $condition
      body: $body
      ) {
      id
      isbn
      title
      author
      condition
      body
      createdAt
      username
      likes {
        id
        username
        createdAt
      }
      likeCount
      comments {
        id
        body
        username
        createdAt
      }
      commentCount
    }
  }
`;

export default PostForm;