# Firebase Setup Guide

## Step 1: Create Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter project name (e.g., "8rm-employee-system")
4. Follow the setup wizard

## Step 2: Enable Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location closest to you
5. Click "Enable"

## Step 3: Enable Storage

1. Go to "Storage" in Firebase Console
2. Click "Get started"
3. Use default security rules for now
4. Click "Done"

## Step 4: Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Scroll down to "Your apps"
3. Click the web icon (</>)
4. Register your app with a nickname
5. Copy the firebaseConfig object

## Step 5: Update Configuration Files

### Update `src/firebase.js`:
Replace the firebaseConfig with your actual values:

```javascript
const firebaseConfig = {
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abc123"
};
```

### Update `.env`:
```env
VITE_FIREBASE_API_KEY=AIza...
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abc123
```

## Step 6: Install Firebase SDK

```bash
npm install firebase
```

## Step 7: Update Firestore Security Rules (Production)

In Firebase Console > Firestore Database > Rules:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /employees/{employeeId} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Step 8: Update Storage Security Rules (Production)

In Firebase Console > Storage > Rules:

```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /contracts/{fileName} {
      allow read, write: if request.auth != null;
    }
  }
}
```

## Usage in Your App

The employee service is ready to use:

```javascript
import { addEmployee, getEmployees, updateEmployee } from './services/employeeService';

// Add employee
const newEmployee = await addEmployee(employeeData, contractFile);

// Get all employees
const employees = await getEmployees();

// Update employee
await updateEmployee(employeeId, updates, newContractFile);
```
