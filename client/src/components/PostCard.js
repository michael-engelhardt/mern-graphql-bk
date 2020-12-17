import React, { useContext } from 'react';
import { Button, Card, Icon, Label, Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import 'moment/locale/de';

import { AuthContext } from '../context/auth';
import LikeButton from './LikeButton';
import DeleteButton from './DeleteButton';
import MyPopup from '../util/MyPopup';

function PostCard({
  post: { title, author, condition, body, createdAt, id, username, likeCount, commentCount, likes }
}) {
  const { user } = useContext(AuthContext);

  return (
    <Card fluid>
      <Card.Content>
        <Image
          floated="right"
          size="mini"
          src="https://react.semantic-ui.com/images/avatar/large/molly.png"
        />
        <Card.Header>{title}</Card.Header>
        <Card.Meta as={Link} to={`/posts/${id}`}>
          vor {moment(createdAt).fromNow(true)} gepostet von {username}
        </Card.Meta>
        <Card.Description>{author}</Card.Description>
        <Card.Content>Zustand: {condition}</Card.Content>
        </Card.Content>
        <Card.Content extra>
          <LikeButton user={user} post={{ id, likes, likeCount }} />
          <MyPopup content="Kommentieren">
            <Button labelPosition="right" as={Link} to={`/posts/${id}`}>
              <Button color="blue" basic>
                <Icon name="comments" />
              </Button>
              <Label basic color="blue" pointing="left">
                {commentCount}
              </Label>
            </Button>
          </MyPopup>
          {user && user.username === username && <DeleteButton postId={id} />}
        </Card.Content>
    </Card>
  );
}

export default PostCard;
