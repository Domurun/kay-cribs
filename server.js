const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
// You can put this connection string in a .env file as MONGO_URI
const mongoUri = process.env.MONGO_URI || "mongodb://localhost:27017/kaycribs"; 
const JWT_SECRET = process.env.JWT_SECRET || "super-secret-key-123";

mongoose.connect(mongoUri)
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.error("❌ MongoDB Connection Error:", err));

// Import Models
// Ensure you have created models/Listing.js and models/User.js
const Listing = require('./models/Listing');
const User = require('./models/User');

// --- ROUTES ---

// 0. Root Route (Health Check)
// This fixes the "Cannot GET /" error when you open localhost:5000 in browser
app.get('/', (req, res) => {
  res.send('API is running successfully!');
});

// 1. Get All Listings
app.get('/api/listings', async (req, res) => {
  try {
    const listings = await Listing.find().sort({ createdAt: -1 });
    res.json(listings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Create Listing
app.post('/api/listings', async (req, res) => {
  try {
    // In a production app, verify the JWT token here
    const newListing = new Listing(req.body);
    const savedListing = await newListing.save();
    res.status(201).json(savedListing);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// 3. REGISTER User
app.post('/api/auth/register', async (req, res) => {
  const { firstName, lastName, email, password, role, idNumber } = req.body;

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "User already exists" });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password: hashedPassword,
      role,
      // Only save ID number if they are a seller
      idNumber: role === 'seller' ? idNumber : undefined
    });

    const savedUser = await newUser.save();

    // Create Token
    const token = jwt.sign({ id: savedUser._id, role: savedUser.role }, JWT_SECRET);

    res.json({
      token,
      user: {
        id: savedUser._id,
        name: `${savedUser.firstName} ${savedUser.lastName}`,
        email: savedUser.email,
        role: savedUser.role
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. LOGIN User
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check for user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User does not exist" });

    // Validate password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Create Token
    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET);

    res.json({
      token,
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        role: user.role
      }
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Seed Route (Optional - resets DB)
app.get('/api/seed', async (req, res) => {
  try {
    await Listing.deleteMany({});
    const sampleListings = [
      { title: "Modern 4 Bedroom Duplex", price: 85000000, location: "GRA Phase 2, Port Harcourt", type: "For Sale", image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=800&auto=format&fit=crop", verified: true, advertiser: "KayCribs Realty", description: "A stunning masterpiece in the heart of GRA." },
      { title: "Luxury Serviced Apartment", price: 3500000, location: "Peter Odili Rd, PH", type: "For Rent", image: "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800&auto=format&fit=crop", verified: true, advertiser: "Elite Homes", description: "Fully serviced with 24/7 power." }
    ];
    await Listing.insertMany(sampleListings);
    res.json({ message: "Database seeded successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));