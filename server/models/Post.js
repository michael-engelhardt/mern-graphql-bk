const { model, Schema } = require('mongoose');

const postSchema = new Schema({
  isbn: String,
  title: String,
  author: String,
  condition: String,
  body: String,
  imgsrc: String,
  username: String,
  createdAt: String,
  comments: [
    {
      body: String,
      username: String,
      createdAt: String
    }
  ],
  likes: [
    {
      username: String,
      createdAt: String
    }
  ],
  user: {
    type: Schema.Types.ObjectId,
    ref: 'users'
  }
});

module.exports = model('Post', postSchema);
