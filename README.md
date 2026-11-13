# Mini Social Media - Backend

Backend API and real-time WebSocket server built with Node.js, Express, MongoDB (Mongoose), and Socket.io.

## Tech Stack
* **Runtime:** Node.js
* **Framework:** Express.js
* **Database:** MongoDB & Mongoose
* **Real-Time:** Socket.io
* **Authentication:** JSON Web Tokens (JWT) & bcryptjs

## Features
* User registration, password hashing, and JWT login authentication.
* Protected API routes with middleware verification.
* CRUD operations for posts (Text & Image URLs) with author population.
* Follow / Unfollow user relationship management.
* Real-time like toggling broadcasted via WebSockets.

## Getting Started

1. Install dependencies:
   ```bash
   npm install