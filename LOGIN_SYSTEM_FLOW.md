# Login System Flow Documentation

## Overview
The system has a smart login that automatically routes users to the correct dashboard based on their credentials and position.

---

## Login Flow Diagram

```
User enters email + password
         ↓
    Check credentials
         ↓
    ┌────────────────┐
    │ Is it Admin?   │
    └────────────────┘
         ↓
    YES ─────→ Admin Dashboard (Full Access)
         │
    NO   │
         ↓
    ┌────────────────┐
    │ Check Employee │
    │ in Database    │
    └────────────────┘
         ↓
    ┌────────────────┐
    │ Email + Emp ID │
    │ Match?         │
    └────────────────┘
         ↓
    YES ─────→ Check Position
         │           ↓
         │      ┌─────────────┐
         │      │ Position =  │
         │      │ "HR"?       │
         │      └─────────────┘
         │           ↓
         │      YES → HR Dashboard
         │           ↓
         │      NO  → Check Accounting
         │           ↓
         │      ┌─────────────┐
         │      │ Position =  │
         │      │ "Accounting"│
         │      └─────────────┘
         │           ↓
         │      YES → Accounting Dashboard
         │           ↓
         │      NO  → Admin Dashboard
         │
    NO ──────→ Invalid Credentials
```

---

## 1. Admin Login (Direct Access)

### Credentials (Hardcoded)
- **Email:** `acharlesjyth@gmail.com`
- **Password:** `Ch@rles123`

### Access Level
- **Dashboard:** Admin Dashboard
- **Permissions:** Full access
  - Add employees
  - Edit employees
  - Archive employees
  - Restore employees
  - Permanently delete employees
  - View change logs
  - View archived employees

### How It Works
```javascript
// In authService.js
const ADMIN_CREDENTIALS = {
  email: 'acharlesjyth@gmail.com',
  password: 'Ch@rles123'
};

// Admin check happens FIRST
if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
  return {
    dashboardType: 'employee', // Routes to Admin Dashboard
    role: 'admin'
  };
}
```

### Login Steps
1. Go to http://localhost:3000
2. Enter email: `acharlesjyth@gmail.com`
3. Enter password: `Ch@rles123`
4. Click "Sign In"
5. Enter OTP sent to email
6. **→ Redirected to Admin Dashboard**

---

## 2. Employee Login (Database-Based)

### Credentials (From Database)
- **Email:** Employee's email address
- **Password:** Employee's Employment ID

### How It Works

#### Step 1: Admin Adds Employee
Admin logs in and adds employee with:
```javascript
{
  fullName: "John Doe",
  email: "john.doe@company.com",
  employmentId: "EMP-HR-001",
  position: "HR Manager",
  // ... other details
}
```

#### Step 2: Employee Can Now Login
Employee uses:
- **Email:** `john.doe@company.com`
- **Password:** `EMP-HR-001` (their Employment ID)

#### Step 3: System Checks Position
```javascript
// In authService.js
const getDashboardRoute = (position) => {
  const positionLower = position?.toLowerCase() || '';
  
  if (positionLower.includes('hr') || positionLower.includes('human resource')) {
    return 'hr';  // → HR Dashboard
  } else if (positionLower.includes('accounting') || positionLower.includes('accountant')) {
    return 'accounting';  // → Accounting Dashboard
  } else {
    return 'employee';  // → Admin Dashboard (default)
  }
};
```

---

## 3. Position-Based Routing

### HR Dashboard
**Triggers when position contains:**
- "HR"
- "hr"
- "Human Resource"
- "human resource"
- "HR Manager"
- "HR Assistant"
- etc.

**Examples:**
```javascript
// These positions go to HR Dashboard:
position: "HR Manager"          → HR Dashboard
position: "HR Assistant"        → HR Dashboard
position: "Human Resources"     → HR Dashboard
position: "Senior HR"           → HR Dashboard
```

### Accounting Dashboard
**Triggers when position contains:**
- "Accounting"
- "accounting"
- "Accountant"
- "accountant"

**Examples:**
```javascript
// These positions go to Accounting Dashboard:
position: "Accountant"          → Accounting Dashboard
position: "Accounting Manager"  → Accounting Dashboard
position: "Senior Accountant"   → Accounting Dashboard
position: "Accounting Clerk"    → Accounting Dashboard
```

### Admin Dashboard (Default)
**All other positions:**
```javascript
// These positions go to Admin Dashboard:
position: "Developer"           → Admin Dashboard
position: "Manager"             → Admin Dashboard
position: "Assistant"           → Admin Dashboard
position: "Engineer"            → Admin Dashboard
```

---

## Complete Examples

### Example 1: Admin Login
```
Email: acharlesjyth@gmail.com
Password: Ch@rles123
→ OTP Verification
→ Admin Dashboard (Full Access)
```

### Example 2: HR Employee Login
```
Admin adds employee:
  - Name: Sarah Johnson
  - Email: sarah.johnson@company.com
  - Employment ID: EMP-HR-001
  - Position: HR Manager

Sarah logs in:
  Email: sarah.johnson@company.com
  Password: EMP-HR-001
  → OTP Verification
  → HR Dashboard
```

### Example 3: Accounting Employee Login
```
Admin adds employee:
  - Name: Mike Chen
  - Email: mike.chen@company.com
  - Employment ID: EMP-ACC-001
  - Position: Senior Accountant

Mike logs in:
  Email: mike.chen@company.com
  Password: EMP-ACC-001
  → OTP Verification
  → Accounting Dashboard
```

### Example 4: Regular Employee Login
```
Admin adds employee:
  - Name: Jane Smith
  - Email: jane.smith@company.com
  - Employment ID: EMP-DEV-001
  - Position: Software Developer

Jane logs in:
  Email: jane.smith@company.com
  Password: EMP-DEV-001
  → OTP Verification
  → Admin Dashboard (default for non-HR/Accounting)
```

---

## Security Features

### 1. OTP Verification
- All logins require OTP verification
- OTP sent to email address
- Expires after 10 minutes
- Cannot login without valid OTP

### 2. Password = Employment ID
- Unique per employee
- Easy to remember
- Can be changed by updating Employment ID

### 3. Database Validation
- Email must exist in database
- Employment ID must match
- Both must be correct to login

### 4. Role-Based Access
- Admin: Full access
- HR: HR-specific features
- Accounting: Accounting-specific features

---

## Testing the System

### Test 1: Admin Login
1. Go to login page
2. Email: `acharlesjyth@gmail.com`
3. Password: `Ch@rles123`
4. Verify OTP
5. ✅ Should see Admin Dashboard

### Test 2: Add HR Employee
1. Login as admin
2. Click "Add Employee"
3. Fill form:
   - Email: `hr.test@company.com`
   - Employment ID: `EMP-HR-TEST`
   - Position: `HR Manager`
4. Save employee
5. Logout

### Test 3: HR Employee Login
1. Go to login page
2. Email: `hr.test@company.com`
3. Password: `EMP-HR-TEST`
4. Verify OTP
5. ✅ Should see HR Dashboard

### Test 4: Add Accounting Employee
1. Login as admin
2. Click "Add Employee"
3. Fill form:
   - Email: `acc.test@company.com`
   - Employment ID: `EMP-ACC-TEST`
   - Position: `Accountant`
4. Save employee
5. Logout

### Test 5: Accounting Employee Login
1. Go to login page
2. Email: `acc.test@company.com`
3. Password: `EMP-ACC-TEST`
4. Verify OTP
5. ✅ Should see Accounting Dashboard

---

## Troubleshooting

### Issue: Admin can't login
**Check:**
- Email is exactly: `acharlesjyth@gmail.com`
- Password is exactly: `Ch@rles123`
- OTP email is being received

### Issue: Employee can't login
**Check:**
- Employee exists in database
- Email is correct
- Employment ID is correct (case-sensitive)
- Employee is not archived

### Issue: Wrong dashboard displayed
**Check:**
- Employee's position field
- Position spelling (HR, Accounting)
- Case doesn't matter (hr = HR)

### Issue: OTP not received
**Check:**
- Email address is valid
- SMTP settings in `api/.env`
- Gmail App Password is correct
- Check spam folder

---

## Code Reference

### Admin Credentials Location
```
File: src/services/authService.js
Lines: 6-9

const ADMIN_CREDENTIALS = {
  email: 'acharlesjyth@gmail.com',
  password: 'Ch@rles123'
};
```

### Position Routing Logic
```
File: src/services/authService.js
Lines: 60-70

const getDashboardRoute = (position) => {
  const positionLower = position?.toLowerCase() || '';
  
  if (positionLower.includes('hr') || positionLower.includes('human resource')) {
    return 'hr';
  } else if (positionLower.includes('accounting') || positionLower.includes('accountant')) {
    return 'accounting';
  } else {
    return 'employee';
  }
};
```

### Dashboard Routing
```
File: src/App.jsx

{dashboardType === 'hr' && <HRDashboard />}
{dashboardType === 'accounting' && <AccountingDashboard />}
{dashboardType === 'employee' && <AdminDashboard />}
```

---

## Summary

✅ **Admin Login:**
- Email: `acharlesjyth@gmail.com`
- Password: `Ch@rles123`
- Goes to: Admin Dashboard

✅ **Employee Login:**
- Email: Employee's email
- Password: Employee's Employment ID
- Goes to: Dashboard based on position

✅ **Position Routing:**
- Contains "HR" → HR Dashboard
- Contains "Accounting" → Accounting Dashboard
- Other → Admin Dashboard

✅ **Security:**
- OTP verification required
- Database validation
- Role-based access

---

**Last Updated:** 2024
**Version:** 1.0
