const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
require('dotenv').config();

// MongoDB URI and Google OAuth Client ID from environment variables
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/google-auth-db';
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;

// Initialize Express app and MongoDB connection
const app = express();
app.use(express.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected')).catch(err => console.log(err));

// Google OAuth client setup
const client = new OAuth2Client(GOOGLE_CLIENT_ID);

// User schema for MongoDB
const userSchema = new mongoose.Schema({
  googleId: String,
  name: String,
  email: String,
  picture: String,
});

const User = mongoose.model('User', userSchema);

// Endpoint to verify Google Token and log in user
app.post('/api/auth/google', async (req, res) => {
  const { token } = req.body; // Receive the Google OAuth token from frontend
  
  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: GOOGLE_CLIENT_ID,  // Ensure the token is for your app
    });
    const payload = ticket.getPayload();  // Decoded information

    // Check if the user exists in MongoDB
    let user = await User.findOne({ googleId: payload.sub });

    // If user doesn't exist, create a new user
    if (!user) {
      user = new User({
        googleId: payload.sub,
        name: payload.name,
        email: payload.email,
        picture: payload.picture,
      });
      await user.save();
    }

    // Create a JWT token for session management
    const jwtToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Return the JWT token to the frontend
    res.status(200).json({
      token: jwtToken,
      user: {
        name: user.name,
        email: user.email,
        picture: user.picture,
      },
    });
  } catch (error) {
    console.error('Error verifying Google token:', error);
    res.status(400).json({ error: 'Invalid Token' });
  }
});

// Start the backend server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
