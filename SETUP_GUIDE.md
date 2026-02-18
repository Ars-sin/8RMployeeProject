# Setup Guide - Clone & Run on Another Computer

This guide will help you set up the 8RM Employee Management System on a new computer.

---

## Prerequisites

Before you begin, make sure you have these installed:

1. **Node.js** (v16 or higher)
   - Download: https://nodejs.org/
   - Check version: `node -v`

2. **npm** (comes with Node.js)
   - Check version: `npm -v`

3. **Git** (for cloning)
   - Download: https://git-scm.com/
   - Check version: `git --version`

---

## Step 1: Clone the Repository

```bash
# Clone the repository
git clone <your-repository-url>

# Navigate to the project folder
cd 8RMployeeProject
```

---

## Step 2: Install Dependencies

### Frontend Dependencies
```bash
# Install frontend dependencies
npm install
```

### Backend API Dependencies
```bash
# Navigate to API folder
cd api

# Install API dependencies
npm install

# Go back to root
cd ..
```

---

## Step 3: Configure Environment Variables

### Frontend Configuration

1. **Update Firebase Config** (`src/firebase.js`):
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSyAsHmmUm1OYYzhFGyLjs8i1QeNEUHph4tU",
     authDomain: "rm-employee-system.firebaseapp.com",
     projectId: "rm-employee-system",
     storageBucket: "rm-employee-system.firebasestorage.app",
     messagingSenderId: "2956601752",
     appId: "1:2956601752:web:86346c1c694b72da87e3ed",
     measurementId: "G-Y15MZB01ST"
   };
   ```

2. **Update `.env`** (optional - if using environment variables):
   ```env
   VITE_FIREBASE_API_KEY=AIzaSyAsHmmUm1OYYzhFGyLjs8i1QeNEUHph4tU
   VITE_FIREBASE_AUTH_DOMAIN=rm-employee-system.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=rm-employee-system
   VITE_FIREBASE_STORAGE_BUCKET=rm-employee-system.firebasestorage.app
   VITE_FIREBASE_MESSAGING_SENDER_ID=2956601752
   VITE_FIREBASE_APP_ID=1:2956601752:web:86346c1c694b72da87e3ed
   ```

### Backend API Configuration

1. **Update `api/.env`**:
   ```env
   # Email Configuration
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=acharlesjyth@gmail.com
   SMTP_PASS=vidm lcoc yrhq mgnz
   SMTP_FROM_EMAIL=acharlesjyth@gmail.com
   SMTP_FROM_NAME=Employee Management System

   # Server Configuration
   PORT=3002
   SESSION_SECRET=your-random-secret-key-here

   # OTP Configuration
   OTP_EXPIRY_MINUTES=10
   ```

2. **Important:** Change `SESSION_SECRET` to a random string for security

---

## Step 4: Firebase Setup

### If Using Existing Firebase Project:

The project is already configured with Firebase credentials. Just make sure:

1. **Firestore Rules** are set to allow read/write:
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /{document=**} {
         allow read, write: if true;
       }
     }
   }
   ```

2. **Storage Rules** are set:
   ```javascript
   rules_version = '2';
   service firebase.storage {
     match /b/{bucket}/o {
       match /{allPaths=**} {
         allow read, write: if true;
       }
     }
   }
   ```

### If Creating New Firebase Project:

Follow the guide in `FIREBASE_SETUP.md`

---

## Step 5: Run the Application

You need to run TWO servers:

### Terminal 1 - Backend API Server
```bash
cd api
npm run dev
```

You should see:
```
OTP API server running on http://localhost:3002
```

### Terminal 2 - Frontend React App
```bash
# From project root
npm run dev
```

You should see:
```
VITE v5.4.21  ready in 950 ms
➜  Local:   http://localhost:3000/
```

---

## Step 6: Access the Application

Open your browser and go to:
```
http://localhost:3000
```

---

## Login Credentials

### Admin Dashboard (Full Access)
- **Email:** `acharlesjyth@gmail.com`
- **Password:** `Ch@rles123`

### HR/Accounting Dashboard
- Login with employee email + Employment ID
- Must add employees first via Admin dashboard

---

## Troubleshooting

### Issue: `npm install` fails

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### Issue: Port already in use

**Solution:**

**Windows:**
```bash
# Find process using port 3000
netstat -ano | findstr :3000

# Kill process (replace PID with actual number)
taskkill /PID <PID> /F
```

**Mac/Linux:**
```bash
# Find and kill process
lsof -ti:3000 | xargs kill -9
```

### Issue: Firebase permission denied

**Solution:**
- Check Firestore rules (see Step 4)
- Verify Firebase config is correct
- Check browser console for specific errors

### Issue: OTP emails not sending

**Solution:**
- Verify SMTP credentials in `api/.env`
- Check Gmail App Password is correct
- Ensure 2FA is enabled on Gmail account
- Test with a different email service if needed

### Issue: Module not found errors

**Solution:**
```bash
# Reinstall dependencies
npm install

# For API
cd api
npm install
```

### Issue: Build errors

**Solution:**
```bash
# Clear Vite cache
rm -rf node_modules/.vite

# Restart dev server
npm run dev
```

---

## Project Structure

```
8RMployeeProject/
├── api/                          # Backend API
│   ├── node_modules/
│   ├── .env                      # API environment variables
│   ├── package.json
│   └── server.js                 # Express server
├── src/
│   ├── pages/
│   │   ├── Admin/               # Admin dashboard
│   │   ├── HR/                  # HR dashboard & components
│   │   └── Accounting/          # Accounting dashboard
│   ├── services/
│   │   ├── authService.js       # Authentication
│   │   ├── employeeService.js   # Employee CRUD
│   │   └── changeLogService.js  # Activity logs
│   ├── firebase.js              # Firebase config
│   ├── App.jsx                  # Main app
│   └── main.jsx                 # Entry point
├── .env                         # Frontend environment variables
├── package.json
└── vite.config.js
```

---

## Development Workflow

### Making Changes

1. **Edit code** in your IDE
2. **Save files** - Vite will auto-reload
3. **Check browser** for changes
4. **Check console** for errors

### Adding New Features

1. Create new components in `src/pages/`
2. Add services in `src/services/`
3. Update routes in `App.jsx`
4. Test thoroughly

### Committing Changes

```bash
# Check status
git status

# Add files
git add .

# Commit
git commit -m "Your commit message"

# Push
git push origin main
```

---

## Building for Production

### Build Frontend
```bash
npm run build
```

This creates a `dist/` folder with optimized files.

### Build API
The API doesn't need building - it runs directly with Node.js.

---

## Deployment

See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions.

**Quick Deploy Options:**
- **Vercel** (Frontend) - Free, easy
- **Railway** (API) - Free tier available
- **Firebase Hosting** - Integrated solution

---

## Common Commands

### Frontend
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm install <pkg>    # Install new package
```

### Backend API
```bash
npm run dev          # Start API server
npm start            # Start API server (production)
npm install <pkg>    # Install new package
```

---

## Environment Variables Reference

### Frontend (`.env`)
```env
VITE_FIREBASE_API_KEY=<your-api-key>
VITE_FIREBASE_AUTH_DOMAIN=<your-auth-domain>
VITE_FIREBASE_PROJECT_ID=<your-project-id>
VITE_FIREBASE_STORAGE_BUCKET=<your-storage-bucket>
VITE_FIREBASE_MESSAGING_SENDER_ID=<your-sender-id>
VITE_FIREBASE_APP_ID=<your-app-id>
```

### Backend (`api/.env`)
```env
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=<your-email>
SMTP_PASS=<your-app-password>
SMTP_FROM_EMAIL=<your-email>
SMTP_FROM_NAME=<your-app-name>
PORT=3002
SESSION_SECRET=<random-secret>
OTP_EXPIRY_MINUTES=10
```

---

## Security Notes

1. **Never commit `.env` files** to Git
2. **Change default passwords** in production
3. **Update Firebase rules** for production
4. **Use strong SESSION_SECRET**
5. **Enable HTTPS** in production

---

## Getting Help

### Documentation
- `README.md` - Project overview
- `FIREBASE_SETUP.md` - Firebase configuration
- `DEPLOYMENT_GUIDE.md` - Deployment options
- `LOGIN_CREDENTIALS.md` - Login information
- `CHANGELOG_SYSTEM.md` - Activity logging
- `ARCHIVE_DELETE_FLOW.md` - Employee management

### Resources
- [React Documentation](https://react.dev/)
- [Vite Documentation](https://vitejs.dev/)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Express Documentation](https://expressjs.com/)

---

## Quick Start Checklist

- [ ] Node.js installed (v16+)
- [ ] Repository cloned
- [ ] Frontend dependencies installed (`npm install`)
- [ ] API dependencies installed (`cd api && npm install`)
- [ ] Firebase config updated (`src/firebase.js`)
- [ ] API environment variables set (`api/.env`)
- [ ] Firestore rules configured
- [ ] Storage rules configured
- [ ] API server running (`cd api && npm run dev`)
- [ ] Frontend running (`npm run dev`)
- [ ] Can access http://localhost:3000
- [ ] Can login with admin credentials
- [ ] OTP emails working

---

**Need Help?** Contact your development team or refer to the documentation files.

**Last Updated:** 2024
**Version:** 1.0
