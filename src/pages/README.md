# Pages Folder Structure

This folder contains all the dashboard pages organized by user role.

## Folder Structure

```
src/pages/
├── Admin/
│   └── AdminDashboard.jsx          # Main admin dashboard (can add/edit/delete employees)
├── HR/
│   ├── HRDashboard.jsx             # HR dashboard (for HR employees)
│   ├── AddEmployeeForm.jsx         # Form to add/edit employees
│   ├── ArchivedPage.jsx            # View archived employees
│   ├── ChangeLogsPage.jsx          # View change logs
│   └── EmployeeDetailsView.jsx     # View employee details
└── Accounting/
    └── AccountingDashboard.jsx     # Accounting dashboard (for accounting employees)
```

## Dashboard Access

### Admin Dashboard
- **Location:** `pages/Admin/AdminDashboard.jsx`
- **Access:** Hardcoded credentials (acharlesjyth@gmail.com / Ch@rles123)
- **Features:** Full employee management (add, edit, delete, archive)
- **Components Used:**
  - AddEmployeeForm (from HR folder)
  - ArchivedPage (from HR folder)
  - ChangeLogsPage (from HR folder)
  - EmployeeDetailsView (from HR folder)

### HR Dashboard
- **Location:** `pages/HR/HRDashboard.jsx`
- **Access:** Employee email + Employment ID (position must contain "HR")
- **Features:** HR-specific features and employee management
- **Shared Components:** Uses components from HR folder

### Accounting Dashboard
- **Location:** `pages/Accounting/AccountingDashboard.jsx`
- **Access:** Employee email + Employment ID (position must contain "Accounting")
- **Features:** Accounting-specific features (payroll, expenses, reports)

## Import Examples

```javascript
// In App.jsx
import AdminDashboard from './pages/Admin/AdminDashboard';
import HRDashboard from './pages/HR/HRDashboard';
import AccountingDashboard from './pages/Accounting/AccountingDashboard';

// In AdminDashboard.jsx
import AddEmployeeForm from '../HR/AddEmployeeForm';
import ArchivedPage from '../HR/ArchivedPage';
import ChangeLogsPage from '../HR/ChangeLogsPage';
import EmployeeDetailsView from '../HR/EmployeeDetailsView';
```

## Notes

- HR folder contains shared components used by Admin dashboard
- All dashboards receive `onLogout` prop for logout functionality
- HR and Accounting dashboards also receive `user` prop with logged-in user data
