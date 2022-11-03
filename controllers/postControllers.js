const Post = require('../models/postModel')
const jwt = require('jsonwebtoken')

const getPosts = async (req, res) => {
    try {
        const posts = await Post.find();

        if (!posts) {
            res.status(404).json('Problem finding posts');
        } else {
            res.status(200).json(posts);
        }
    } catch (error) {
        res.status(500).json({ error: 'Problem returning posts' });
        console.error(error)
    }
}

const getPost = async (req, res) => {
    try {
        const { id } = req.params;
        const post = await Post.findById(id);

        if(!post) {
            res.status(404).json('Problem finding post');
        } else {
            res.status(200).json(post)
        }
    } catch (error) {
        res.status(500).json({ error: 'Problem returning post' });
    }
}

const postPost = async (req, res) => {
    try {
        const { title, body, author, user_id } = req.body;
        //grab the token & decode it to use the user._id off of it to set as the user_id of the post
        const token = req.headers.authorization;
        const user = jwt.verify(token, process.env.JWT_SECRET);
        
        if (!title || !body || !author) {
            res.status(400).json('Please fill in all fields')
        } else {
            const addPost = await Post.create({ title, body, author, user_id: user._id });
            console.log(user)
            res.status(201).json(addPost);
        }
    } catch (error) {
        res.status(500).json({ error: 'Problem adding post' });
        console.error(error);
    }
}

const deletePost = async (req, res) => {
    try {
        const { id } = req.params;
        const token = req.headers.authorization;
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);

        const deletedPost = await Post.findByIdAndDelete({ _id: id });

        if (!deletedPost) {
            res.status(404).json('Problem finding post to delete');
        } else {
            res.status(204).json(deletedPost);
        }
    } catch (error) {
        res.status(500).json({ error: 'Problem deleting posts' });
    }
}

const updatePost = async (req, res) => {
    try {
        const { title, body, author } = req.body;
        const { id } = req.params;        
        const token = req.headers.authorization;
        const { _id } = jwt.verify(token, process.env.JWT_SECRET);

        const updatedPost = await Post.findByIdAndUpdate({ _id: id }, { title, body, author });

        if (!updatedPost) {
            res.status(404).json('Proble finding post to update');
        } else if (!title || !body || !author) {
            res.status(400).json('Please fill in all fields')
        } else {
            res.status(201).json(updatedPost);
        }
    } catch (error) {
        res.status(500).json({ error: 'Problem updating posts' });
    }
}

module.exports = { getPosts, getPost, postPost, deletePost, updatePost }