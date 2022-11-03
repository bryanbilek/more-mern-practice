const router = require('express').Router()
const { getPosts, getPost, postPost, deletePost, updatePost } = require('../controllers/postControllers')
const auth = require('../middleware/authorization')
//get all posts
router.get('/', auth, getPosts);
//get post by id
router.get('/:id', auth, getPost);
//post a post
router.post('/', auth, postPost);
//delete a post by id
router.delete('/:id', auth, deletePost);
//update a post by id
router.put('/:id', auth, updatePost);

module.exports = router;