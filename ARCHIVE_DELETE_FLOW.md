# Archive & Delete Flow

## Overview
The system now uses a two-step deletion process for employee records:
1. **Soft Delete (Archive)** - Employee is moved to Archive page
2. **Hard Delete (Permanent)** - Employee is permanently removed from database

---

## How It Works

### Step 1: Delete Button (Main Dashboard)
**Location:** Admin Dashboard → Employee List → Delete Icon

**Action:** Soft Delete (Archive)
- Clicking the delete button archives the employee
- Employee is marked as `isArchived: true` in database
- Employee disappears from main employee list
- Employee appears in Archive page
- **Data is NOT deleted** - can be restored

**Confirmation Message:**
```
"Are you sure you want to archive this employee?"
```

**Code:**
```javascript
const handleDelete = async (id) => {
  if (window.confirm('Are you sure you want to archive this employee?')) {
    await archiveEmployee(id);
    // Remove from current list
    setEmployees(employees.filter(emp => emp.id !== id));
  }
};
```

---

### Step 2: Archive Page
**Location:** Admin Dashboard → Sidebar → Archived

**Features:**
1. **View Archived Employees**
   - Shows all employees with `isArchived: true`
   - Displays employee information
   - Search and filter functionality

2. **Restore Employee** (Green Rotate Icon)
   - Restores employee to active status
   - Sets `isArchived: false`
   - Employee reappears in main list
   - Employee removed from archive list

3. **Permanent Delete** (Red Trash Icon)
   - **WARNING:** This action cannot be undone
   - Completely removes employee from database
   - All employee data is lost forever
   - Contract files remain in storage (manual cleanup needed)

**Confirmation Messages:**

Restore:
```
"Are you sure you want to restore this employee?"
```

Permanent Delete:
```
"⚠️ WARNING: This will permanently delete the employee from the database. 
This action cannot be undone. Are you sure?"
```

---

## Database Structure

### Active Employee
```javascript
{
  id: "abc123",
  fullName: "John Doe",
  email: "john@example.com",
  employmentId: "EMP-001",
  position: "Developer",
  isArchived: false,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Archived Employee
```javascript
{
  id: "abc123",
  fullName: "John Doe",
  email: "john@example.com",
  employmentId: "EMP-001",
  position: "Developer",
  isArchived: true,          // Changed to true
  archivedAt: Timestamp,     // Added timestamp
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Permanently Deleted
```
Employee document is completely removed from Firestore
```

---

## User Flow Diagram

```
Main Dashboard
    │
    ├─ Click Delete Button
    │       │
    │       ├─ Confirm Archive
    │       │       │
    │       │       └─> Employee Archived
    │       │               │
    │       │               └─> Moved to Archive Page
    │       │
    │       └─ Cancel
    │               │
    │               └─> No Action
    │
    └─ Navigate to Archive Page
            │
            ├─ Click Restore Button
            │       │
            │       ├─ Confirm Restore
            │       │       │
            │       │       └─> Employee Restored
            │       │               │
            │       │               └─> Back to Main List
            │       │
            │       └─ Cancel
            │               │
            │               └─> No Action
            │
            └─ Click Permanent Delete
                    │
                    ├─ Confirm Permanent Delete
                    │       │
                    │       └─> Employee Permanently Deleted
                    │               │
                    │               └─> Cannot be recovered
                    │
                    └─ Cancel
                            │
                            └─> No Action
```

---

## Benefits

### 1. Safety
- Accidental deletions can be recovered
- Two-step process prevents mistakes
- Clear warnings for permanent actions

### 2. Compliance
- Maintain employee records for legal requirements
- Audit trail of archived employees
- Can restore if needed for reports

### 3. Organization
- Separate active and inactive employees
- Clean main dashboard
- Easy to find archived employees

### 4. Flexibility
- Restore employees if they return
- Keep historical data
- Permanent delete when truly needed

---

## API Functions

### Archive Employee
```javascript
import { archiveEmployee } from './services/employeeService';

await archiveEmployee(employeeId);
// Sets isArchived: true, adds archivedAt timestamp
```

### Restore Employee
```javascript
import { restoreEmployee } from './services/employeeService';

await restoreEmployee(employeeId);
// Sets isArchived: false, removes archivedAt
```

### Permanent Delete
```javascript
import { deleteEmployee } from './services/employeeService';

await deleteEmployee(employeeId);
// Completely removes document from Firestore
```

### Get Archived Employees
```javascript
import { getEmployees } from './services/employeeService';

const allEmployees = await getEmployees(true); // Include archived
const archivedOnly = allEmployees.filter(emp => emp.isArchived);
```

---

## Best Practices

### When to Archive:
- Employee leaves company
- Temporary suspension
- Contract ended
- Need to keep records

### When to Permanently Delete:
- Legal requirement to remove data
- Employee requests data deletion (GDPR)
- Test/duplicate records
- After retention period expires

### Recommendations:
1. Set a retention policy (e.g., keep archived for 7 years)
2. Regular review of archived employees
3. Backup before permanent deletion
4. Document reason for permanent deletion
5. Train admins on the difference

---

## Security Considerations

### Firestore Rules
Ensure only authenticated admins can delete:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /employees/{employeeId} {
      // Only authenticated users can archive/restore
      allow update: if request.auth != null;
      
      // Only authenticated users can permanently delete
      allow delete: if request.auth != null;
    }
  }
}
```

### Admin Access
- Only Admin dashboard has delete/archive access
- HR and Accounting dashboards cannot delete
- Implement role-based access control if needed

---

## Troubleshooting

### Employee not appearing in Archive:
- Check `isArchived` field in Firestore
- Verify `getEmployees(true)` includes archived
- Check Firestore rules allow read access

### Cannot restore employee:
- Check Firestore rules allow update
- Verify employee ID is correct
- Check network connection

### Permanent delete not working:
- Check Firestore rules allow delete
- Verify employee ID is correct
- Check for any database constraints

---

## Future Enhancements

1. **Bulk Operations**
   - Archive multiple employees at once
   - Restore multiple employees
   - Bulk permanent delete

2. **Archive Reasons**
   - Add reason field when archiving
   - Track who archived the employee
   - Add notes/comments

3. **Auto-Archive**
   - Automatically archive after contract end date
   - Scheduled archiving based on rules

4. **Restore History**
   - Track restore count
   - Log restore actions
   - Show restore history

5. **Soft Delete Expiry**
   - Auto-delete after X days in archive
   - Warning before auto-deletion
   - Configurable retention period

---

**Last Updated:** 2024
**Version:** 1.0
