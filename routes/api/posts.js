const express = require(`express`);
const router = express.Router();
const auth = require('../../middleware/auth');
const { check, validationResult } = require('express-validator');

const Post = require('../../models/Post');
const Profile = require('../../models/Profile');
const User = require('../../models/User');

// @route   POST api/posts
// @desc    Create a post
// @access  Private
router.post(`/`, [auth, [
  check('text', 'Text is required.').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) { // if errors occur
    return res.status(400).json({ errors: errors.array()} );
  }

  try {
    const user = await User.findById(req.user.id).select('-password');
    
    const newPost = new Post({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    })
    
    const post = await newPost.save();

    res.json(post);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error.');
  }
});

// @route   GET api/posts
// @desc    Get all posts.
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Get all posts { date: -1 } = most recent dates. 
    const posts = await Post.find().sort({ date: -1 })  
    res.json(posts);
  } catch (err) {
    console.log(err.message)
    res.status(500).send('Server Error.');
  }
})

// @route   GET api/posts/:post_id
// @desc    Get post by ID.
// @access  Private
router.get('/:post_id', auth, async (req, res) => {
  try {
    // Get all posts { date: -1 } = most recent dates. 
    const post = await Post.findById(req.params.post_id);
    if(!post) {
      return res.status(404).json({ msg: 'Post not found.'});
    }

    res.json(post);
  } catch (err) {
    console.log(err.message)
    
    if(err.kind === 'ObjectId') { // For when param is not formatted as proper Post object ID
      return res.status(404).json({ msg: 'Post not found.'});
    }

    res.status(500).send('Server Error');
  }
})

// @route   DELETE api/posts/:post_id
// @desc    Delete post by ID.
// @access  Private
router.delete('/:post_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    if(!post) { // For when param is not formatted as proper Post object ID
      return res.status(404).json({ msg: 'Post not found.'});
    }

    // Check user
    if(post.user.toString() !== req.user.id) {
      return res.status(401).json({ msg: 'User is not authorized.' });
    }

    await post.remove();

    res.json({ msg: 'Post removed.' });
  } catch (err) {
    console.log(err.message);

    if(err.kind === 'ObjectId') { // For when param is not formatted as proper Post object ID
      return res.status(404).json({ msg: 'Post not found.'});
    }
    
    res.status(500).send('Server Error');
  }
});

// @route   PUT api/posts/like/:post_id
// @desc    Like a post
// @access  Private
router.put('/like/:post_id', auth, async (req,res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    // Check if the post has already been liked
    // post.likes is an array
    if(post.likes.filter(like => like.user.toString() === req.user.id).length > 0) {
      return res.status(400).json({msg: 'Post already liked.'});
    }

    // Add to top of likes array
    post.likes.unshift({ user: req.user.id });

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.log(err.message);
  }
});

// @route   PUT api/posts/unlike/:post_id
// @desc    Unlike a post
// @access  Private
router.put('/unlike/:post_id', auth, async (req,res) => {
  try {
    const post = await Post.findById(req.params.post_id);

    // Check if the post has already been liked
    // post.likes is an array
    if(post.likes.filter(like => like.user.toString() === req.user.id).length === 0) {
      return res.status(400).json({msg: 'Post has not yet been liked.'});
    }

    // Get remove index
    const removeIndex = post.likes.map(like => like.user.toString()).indexOf(req.user.id);

    post.likes.splice(removeIndex, 1);

    await post.save();
    res.json(post.likes);
  } catch (err) {
    console.log(err.message);
  }
});

// @route   POST api/posts/comment/:post_id
// @desc    Comment on a post. Comments are identical to posts, but do not have likes.
// @access  Private
router.post(`/comment/:post_id`, [auth, [
  check('text', 'Text is required.').not().isEmpty()
]], async (req, res) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) { // if errors occur
    return res.status(400).json({ errors: errors.array()} );
  }

  try {
    const user = await User.findById(req.user.id).select('-password');
    const post = await Post.findById(req.params.post_id);

    // Comment is not a model in the database; just an object.
    const newComment = ({
      text: req.body.text,
      name: user.name,
      avatar: user.avatar,
      user: req.user.id
    });

    post.comments.unshift(newComment);
    
    await post.save();

    res.json(post.comments);
  } catch (err) {
    console.log(err.message);
    res.status(500).send('Server Error.');
  }
});

// @route   DELETE api/posts/comment/:post_id/:comment_id
// @desc    Delete comment.
// @access  Private
router.delete('/comment/:post_id/:comment_id', auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.post_id);
    
    //Pull out comment
    const comment = post.comments.find(comment => comment.id === req.params.comment_id);

    // Check if comment exists
    if(!comment) {
      return res.status(404).json({ msg: 'That comment does not exist.' })
    }

    // Check whether the comment belongs to this user
    if(comment.user.toString() !== req.user.id) {
      return res.status(401).json( {msg: 'User is not authorized.' });
    }
    
    // Get remove index
    const removeIndex = post.comments.map(comment => comment.user.toString()).indexOf(req.user.id);

    post.comments.splice(removeIndex, 1);

    await post.save();
    res.json(post.comments);
  } catch (err) {
    console.log(err.message);

    if(err.kind === 'ObjectId') { // For when param is not formatted as proper Post object ID
      return res.status(404).json({ msg: 'Post not found.'});
    }
    
    res.status(500).send('Server Error');
  }
});

module.exports = router;