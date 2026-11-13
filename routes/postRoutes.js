const express = require('express');
const router = express.Router();
const Post = require('../models/Post');
const authMiddleware = require('../middlewares/authMiddleware');

// Create a Post (Text + Image URL)
router.post('/', authMiddleware, async (req, res) => {
    try {
        const { text, imageUrl } = req.body;
        const newPost = new Post({
            text,
            imageUrl: imageUrl || '',
            author: req.user.id
        });
        await newPost.save();

        const populatedPost = await Post.findById(newPost._id).populate('author', 'name profilePicUrl email');
        res.status(201).json(populatedPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Posts (Feed)
router.get('/', async (req, res) => {
    try {
        const posts = await Post.find()
            .populate('author', 'name profilePicUrl email')
            .sort({ createdAt: -1 }); // Newest first
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Post (Only author can delete)
router.delete('/:id', authMiddleware, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ message: 'Post not found.' });
        }

        if (post.author.toString() !== req.user.id) {
            return res.status(403).json({ message: 'Unauthorized action.' });
        }

        await post.deleteOne();
        res.json({ message: 'Post deleted successfully.' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;