# Login Credentials Guide

## Admin/Employee Dashboard (Hardcoded)
This dashboard allows adding and managing all employees.

**Credentials:**
- **Email:** `acharlesjyth@gmail.com`
- **Password:** `Ch@rles123`

After login, you'll receive an OTP to your email for verification.

---

## HR Dashboard (Employee-based)
For employees with "HR" or "Human Resource" in their position field.

**Login Method:**
- **Email:** Employee's email from database
- **Password:** Employee's Employment ID

**Example:**
1. Add an employee with:
   - Email: `hr@example.com`
   - Employment ID: `EMP-HR-001`
   - Position: `HR Manager`

2. Login with:
   - Email: `hr@example.com`
   - Password: `EMP-HR-001`

---

## Accounting Dashboard (Employee-based)
For employees with "Accounting" or "Accountant" in their position field.

**Login Method:**
- **Email:** Employee's email from database
- **Password:** Employee's Employment ID

**Example:**
1. Add an employee with:
   - Email: `accounting@example.com`
   - Employment ID: `EMP-ACC-001`
   - Position: `Accountant`

2. Login with:
   - Email: `accounting@example.com`
   - Password: `EMP-ACC-001`

---

## How It Works

1. **Admin Login:**
   - Uses hardcoded credentials
   - Routes to Employee Dashboard (full access)

2. **Employee Login:**
   - Checks Firebase database
   - Matches email + employmentId
   - Routes based on position:
     - Position contains "HR" → HR Dashboard
     - Position contains "Accounting" → Accounting Dashboard
     - Other positions → Employee Dashboard

3. **OTP Verification:**
   - After successful credential check
   - OTP sent to email
   - Must verify OTP to access dashboard

---

## Testing Steps

1. **Test Admin Access:**
   ```
   Email: acharlesjyth@gmail.com
   Password: Ch@rles123
   ```

2. **Add HR Employee:**
   - Login as admin
   - Add employee with HR position
   - Logout

3. **Test HR Login:**
   - Use HR employee's email and Employment ID
   - Verify OTP
   - Should see HR Dashboard

4. **Add Accounting Employee:**
   - Login as admin
   - Add employee with Accounting position
   - Logout

5. **Test Accounting Login:**
   - Use Accounting employee's email and Employment ID
   - Verify OTP
   - Should see Accounting Dashboard
