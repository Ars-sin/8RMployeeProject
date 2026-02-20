# Login Credentials Guide

## Super Admin Access (Hardcoded)
The super admin has full access to the Admin Dashboard where they can manage admins, view archived employees, and access change logs.

**Super Admin Credentials:**
- **Email:** `acharlesjyth@gmail.com`
- **Password:** `Ch@rles123`
- **Dashboard:** Admin Dashboard (Full System Access)

After login, you'll receive an OTP to your email for verification.

---

## Admin Access (Database-based)
Admins are created by the super admin through the Admin Dashboard. Each admin has their own credentials stored in the Firebase `admins` collection.

**Admin Login Method:**
- **Email:** Admin's email from database
- **Password:** Admin's ID Number

**Dashboard Routing:**
- Position contains "HR" → HR Dashboard
- Position contains "Accounting" → Accounting Dashboard
- Other positions → Admin Dashboard

**Example:**
1. Super admin adds an admin with:
   - Full Name: `John Smith`
   - ID Number: `123456789`
   - Email: `john.smith@example.com`
   - Position: `HR Manager`

2. Admin logs in with:
   - Email: `john.smith@example.com`
   - Password: `123456789`
   - Routes to: HR Dashboard

---

## Employee Access (Database-based)
Employees are added by admins or HR through their respective dashboards. Employee credentials are stored in the Firebase `employees` collection.

**Employee Login Method:**
- **Email:** Employee's email from database
- **Password:** Employee's Employment ID

**Dashboard Routing:**
- Position contains "HR" → HR Dashboard
- Position contains "Accounting" → Accounting Dashboard
- Other positions → Admin Dashboard

**Example:**
1. Add an employee with:
   - Email: `employee@example.com`
   - Employment ID: `EMP-2026-001`
   - Position: `Accountant`

2. Employee logs in with:
   - Email: `employee@example.com`
   - Password: `EMP-2026-001`
   - Routes to: Accounting Dashboard

---

## How It Works

1. **Super Admin Login:**
   - Uses hardcoded credentials
   - Routes to Admin Dashboard (full access to manage admins)

2. **Admin Login:**
   - Checks Firebase `admins` collection
   - Matches email + idNumber
   - Routes based on position

3. **Employee Login:**
   - Checks Firebase `employees` collection
   - Matches email + employmentId
   - Routes based on position

4. **Position-Based Routing:**
   - Position contains "HR" or "Human Resource" → HR Dashboard
   - Position contains "Accounting" or "Accountant" → Accounting Dashboard
   - All other positions → Admin Dashboard

5. **OTP Verification:**
   - After successful credential check
   - OTP sent to email
   - Must verify OTP to access dashboard
   - OTP expires after 10 minutes

---

## Admin Position Examples

When adding admins, use these position options:
- HR Manager
- HR Assistant
- Accounting Manager
- Accounting Assistant
- Admin
- Assistant

---

## Testing Steps

1. **Test Super Admin Access:**
   ```
   Email: acharlesjyth@gmail.com
   Password: Ch@rles123
   Expected: Admin Dashboard
   ```

2. **Add HR Admin:**
   - Login as super admin
   - Click "Add Admin"
   - Fill in details with HR position
   - Logout

3. **Test HR Admin Login:**
   - Use HR admin's email and ID Number
   - Verify OTP
   - Expected: HR Dashboard

4. **Add Accounting Admin:**
   - Login as super admin
   - Click "Add Admin"
   - Fill in details with Accounting position
   - Logout

5. **Test Accounting Admin Login:**
   - Use Accounting admin's email and ID Number
   - Verify OTP
   - Expected: Accounting Dashboard

6. **Add Employee (via HR Dashboard):**
   - Login as HR admin
   - Add employee with specific position
   - Logout

7. **Test Employee Login:**
   - Use employee's email and Employment ID
   - Verify OTP
   - Routes based on position

---

## Security Notes

- Super admin credentials are hardcoded for maximum security
- Admin passwords are their ID numbers
- Employee passwords are their Employment IDs
- All logins require OTP verification
- OTP codes expire after 10 minutes
- Sessions are managed securely
- Separate collections for admins and employees
