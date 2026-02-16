# Node.js OTP API with Nodemailer

## Installation Steps

1. Install dependencies:
   ```bash
   cd 8RMployeeProject/api
   npm install
   ```

2. Configure email settings in `.env`:
   - Update SMTP credentials
   - For Gmail, use App Password (not regular password)
   - Enable 2FA and generate App Password at: https://myaccount.google.com/apppasswords

3. Start the API server:
   ```bash
   npm start
   ```

   The server will run on http://localhost:8000

## Gmail Setup (if using Gmail)

1. Enable 2-Factor Authentication on your Google Account
2. Generate App Password:
   - Go to Google Account → Security → 2-Step Verification → App passwords
   - Select "Mail" and your device
   - Copy the 16-character password (remove spaces)
3. Use this App Password in `.env` as `SMTP_PASS`

## Environment Variables

Copy `.env.example` to `.env` and update:

```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-16-char-app-password
SMTP_FROM_EMAIL=your-email@gmail.com
SMTP_FROM_NAME=Employee Management System
PORT=8000
SESSION_SECRET=your-random-secret-key
OTP_EXPIRY_MINUTES=10
```

## API Endpoints

### POST /api/send-otp
Send OTP to email
```json
{
  "email": "user@example.com"
}
```

### POST /api/verify-otp
Verify OTP code
```json
{
  "email": "user@example.com",
  "otp": "123456"
}
```

## Usage in React

```javascript
import { sendOTP, verifyOTP } from './OTPService';

// Send OTP
const result = await sendOTP('user@example.com');

// Verify OTP
const verified = await verifyOTP('user@example.com', '123456');
```

## Testing

You can test the API using curl or Postman:

```bash
# Send OTP
curl -X POST http://localhost:8000/api/send-otp -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\"}"

# Verify OTP
curl -X POST http://localhost:8000/api/verify-otp -H "Content-Type: application/json" -d "{\"email\":\"test@example.com\",\"otp\":\"123456\"}"
```
