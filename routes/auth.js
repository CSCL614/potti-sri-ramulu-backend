const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // Check if the inputs are provided
    if (!username || !password) {
      console.warn('⚠️ Login attempt failed: Missing username or password');
      return res.status(400).json({ error: 'Username and password required.' });
    }

    console.log(`🔐 Login attempt for user/email: ${username}`);

    // Since the frontend could be using 'email' in the username field, we can let them input it.
    // However, our model specifically uses 'username', so we query by username here.
    const admin = await Admin.findOne({ username });
    if (!admin) {
      console.warn(`❌ Login failed: User '${username}' not found in database.`);
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Verify password securely
    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch) {
      console.warn(`❌ Login failed: Incorrect password for user '${username}'.`);
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Sign the token
    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, { expiresIn: '24h' });
    console.log(`✅ Login successful for user: ${username}`);
    res.json({ token, message: 'Login successful' });
  } catch (err) {
    console.error('🔥 Login server error:', err);
    res.status(500).json({ error: 'Server error during login. Check server logs.' });
  }
});

// GET /api/auth/verify
router.get('/verify', auth, (req, res) => {
  res.json({ valid: true });
});

module.exports = router;
