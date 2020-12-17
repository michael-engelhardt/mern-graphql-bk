const { AuthenticationError, UserInputError } = require('apollo-server');

const Post = require('../../models/Post');
const checkAuth = require('../../util/check-auth');

module.exports = {
  Query: {
    async getPosts() {
      try {
        const posts = await Post.find().sort({ createdAt: -1 });
        return posts;
      } catch (err) {
        throw new Error(err);
      }
    },
    async getPost(_, { postId }) {
      try {
        const post = await Post.findById(postId);
        if (post) {
          return post;
        } else {
          throw new Error('Post nicht gefunden');
        }
      } catch (err) {
        throw new Error(err);
      }
    }
  },
  Mutation: {
    async createPost(_, { isbn, title, author, condition, body, imgsrc }, context) {
      const user = checkAuth(context);

      if (isbn.trim() === '') {
        throw new Error('ISBN darf nicht leer sein');
      }

      if (title.trim() === '') {
        throw new Error('Titel darf nicht leer sein');
      }

      if (author.trim() === '') {
        throw new Error('Author darf nicht leer sein');
      }

      if (condition.trim() === '') {
        throw new Error('Zustand darf nicht leer sein');
      }

      if (body.trim() === '') {
        throw new Error('Beschreibung darf nicht leer sein');
      }

      const newPost = new Post({
        isbn,
        title,
        author,
        condition,
        body,
        imgsrc,
        user: user.id,
        username: user.username,
        createdAt: new Date().toISOString()
      });

      const post = await newPost.save();

      context.pubsub.publish('NEW_POST', {
        newPost: post
      });

      return post;
    },
    async deletePost(_, { postId }, context) {
      const user = checkAuth(context);

      try {
        const post = await Post.findById(postId);
        if (user.username === post.username) {
          await post.delete();
          return 'Angebot erfolgreich gelöscht';
        } else {
          throw new AuthenticationError('Das ist nicht erlaubt.');
        }
      } catch (err) {
        throw new Error(err);
      }
    },
    async likePost(_, { postId }, context) {
      const { username } = checkAuth(context);

      const post = await Post.findById(postId);
      if (post) {
        if (post.likes.find((like) => like.username === username)) {
          // Post already likes, unlike it
          post.likes = post.likes.filter((like) => like.username !== username);
        } else {
          // Not liked, like post
          post.likes.push({
            username,
            createdAt: new Date().toISOString()
          });
        }

        await post.save();
        return post;
      } else throw new UserInputError('Post nicht gefunden');
    }
  },
  Subscription: {
    newPost: {
      subscribe: (_, __, { pubsub }) => pubsub.asyncIterator('NEW_POST')
    }
  }
};
