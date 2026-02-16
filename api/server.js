import express from 'express';
import cors from 'cors';
import session from 'express-session';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware
app.use(cors({
  origin: true, // Allow all origins in development
  credentials: true
}));
app.use(express.json());
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, // Set to true if using HTTPS
    maxAge: 1000 * 60 * 30 // 30 minutes
  }
}));

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'OTP API is running', timestamp: new Date().toISOString() });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is working' });
});

// Send OTP endpoint
app.post('/api/send-otp', async (req, res) => {
  const { email } = req.body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid email address' 
    });
  }

  const otp = generateOTP();
  const expiryMinutes = parseInt(process.env.OTP_EXPIRY_MINUTES) || 10;

  // Store OTP in session
  req.session.otp = otp;
  req.session.otpEmail = email;
  req.session.otpExpiry = Date.now() + (expiryMinutes * 60 * 1000);

  try {
    await transporter.sendMail({
      from: `"${process.env.SMTP_FROM_NAME}" <${process.env.SMTP_FROM_EMAIL}>`,
      to: email,
      subject: 'Your OTP Code',
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>Your OTP Code</h2>
          <p>Your one-time password is:</p>
          <h1 style="color: #4F46E5; font-size: 32px; letter-spacing: 5px;">${otp}</h1>
          <p>This code will expire in ${expiryMinutes} minutes.</p>
          <p style="color: #666;">If you didn't request this code, please ignore this email.</p>
        </div>
      `,
      text: `Your OTP code is: ${otp}. This code will expire in ${expiryMinutes} minutes.`
    });

    res.json({ 
      success: true, 
      message: 'OTP sent successfully' 
    });
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to send OTP: ' + error.message 
    });
  }
});

// Verify OTP endpoint
app.post('/api/verify-otp', (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ 
      success: false, 
      message: 'Email and OTP are required' 
    });
  }

  if (!req.session.otp || !req.session.otpEmail || !req.session.otpExpiry) {
    return res.status(400).json({ 
      success: false, 
      message: 'No OTP found. Please request a new one.' 
    });
  }

  if (Date.now() > req.session.otpExpiry) {
    delete req.session.otp;
    delete req.session.otpEmail;
    delete req.session.otpExpiry;
    return res.status(400).json({ 
      success: false, 
      message: 'OTP has expired' 
    });
  }

  if (req.session.otpEmail !== email || req.session.otp !== otp) {
    return res.status(400).json({ 
      success: false, 
      message: 'Invalid OTP' 
    });
  }

  // Clear OTP from session after successful verification
  delete req.session.otp;
  delete req.session.otpEmail;
  delete req.session.otpExpiry;

  res.json({ 
    success: true, 
    message: 'OTP verified successfully' 
  });
});

app.listen(PORT, () => {
  console.log(`OTP API server running on http://localhost:${PORT}`);
});
