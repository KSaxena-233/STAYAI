const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config({ path: '.env.local' });

const app = express();
const PORT = 4000;

const EMAIL_USER = process.env.EMAIL_USER;
const EMAIL_PASS = process.env.EMAIL_PASS;

if (!EMAIL_USER || !EMAIL_PASS) {
  console.error('ERROR: EMAIL_USER and EMAIL_PASS must be set in .env.local');
  process.exit(1);
}

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: EMAIL_USER,
    pass: EMAIL_PASS,
  },
});

app.use(cors());
app.use(bodyParser.json());

// In-memory store for OTPs
const otps = {};

// In-memory store for users
const users = {};

// Generate random 6-digit OTP
function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Send OTP endpoint
app.post('/send-otp', async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email required' });
  const otp = generateOtp();
  otps[email] = otp;
  try {
    await transporter.sendMail({
      from: `STAY OTP <${EMAIL_USER}>`,
      to: email,
      subject: 'Your STAY OTP Code',
      text: `Your OTP code is: ${otp}`,
      html: `<h2>Your OTP code is: <b>${otp}</b></h2>`,
    });
    res.json({ success: true });
  } catch (err) {
    console.error('Failed to send OTP email:', err);
    res.status(500).json({ error: 'Failed to send OTP email' });
  }
});

// Verify OTP endpoint
app.post('/verify-otp', (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) return res.status(400).json({ error: 'Email and OTP required' });
  if (otps[email] && otps[email] === otp) {
    delete otps[email];
    return res.json({ success: true });
  }
  res.status(401).json({ error: 'Invalid OTP' });
});

// Sign Up endpoint
app.post('/signup', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  if (users[email]) return res.status(400).json({ error: 'User already exists' });
  users[email] = { password };
  res.json({ success: true });
});

// Login endpoint
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'Email and password required' });
  if (!users[email] || users[email].password !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`OTP server running on http://localhost:${PORT}`);
}); 