const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
require('dotenv').config();

// Import database connection file
const connectDB = require('./config/database');

const authRoutes = require('./routes/authRoutes');
const postRoutes = require('./routes/postRoutes');
const Post = require('./models/Post');

const app = express();
const server = http.createServer(app);

// Initialize Socket.io with CORS enabled
const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
    }
});

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/posts', postRoutes);

// Socket.io Real-Time Event Handlers
io.on('connection', (socket) => {
    console.log(`User connected: ${socket.id}`);

    // Listen for a like event from any client
    socket.on('like_post', async ({ postId, userId }) => {
        try {
            const post = await Post.findById(postId);
            if (!post) return;

            const userIndex = post.likes.indexOf(userId);
            if (userIndex === -1) {
                post.likes.push(userId); // Add like
            } else {
                post.likes.splice(userIndex, 1); // Unlike (toggle)
            }

            await post.save();
            const updatedPost = await Post.findById(postId).populate('author', 'name profilePicUrl email');

            // Broadcast the updated post state to ALL connected clients instantly
            io.emit('post_liked', updatedPost);
        } catch (err) {
            console.error('Socket like error:', err);
        }
    });

    socket.on('disconnect', () => {
        console.log(`User disconnected: ${socket.id}`);
    });
});

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});