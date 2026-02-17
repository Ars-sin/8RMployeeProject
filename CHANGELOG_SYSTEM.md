# Change Logs System Documentation

## Overview
The system now automatically tracks all employee-related activities and displays them in the Change Logs page.

---

## Tracked Activities

### 1. Employee Added ➕
- **Trigger:** When a new employee is created
- **Logged Info:** Employee name, position, employment ID
- **Color:** Green

### 2. Employee Updated ✏️
- **Trigger:** When employee information is modified
- **Logged Info:** Employee name, updated fields
- **Color:** Blue

### 3. Employee Archived 📦
- **Trigger:** When employee is moved to archive (soft delete)
- **Logged Info:** Employee name, position, employment ID
- **Color:** Orange

### 4. Employee Restored ↩️
- **Trigger:** When archived employee is restored
- **Logged Info:** Employee name, position, employment ID
- **Color:** Purple

### 5. Employee Deleted 🗑️
- **Trigger:** When employee is permanently deleted
- **Logged Info:** Employee name, position, employment ID, warning
- **Color:** Red

---

## Change Log Structure

Each log entry contains:

```javascript
{
  id: "log_id",
  type: "employee_added",           // Action type
  action: "Create",                 // Action label
  description: "Added new employee: John Doe",
  employeeId: "emp_id",            // Employee Firebase ID
  employeeName: "John Doe",        // Employee full name
  performedBy: "Admin",            // Who performed the action
  performedByEmail: "admin@example.com",
  details: {                       // Additional details
    position: "Developer",
    employmentId: "EMP-001"
  },
  timestamp: Timestamp,            // When it happened
  createdAt: Timestamp
}
```

---

## Features

### Change Logs Page

**Location:** Admin Dashboard → Sidebar → Change Logs

**Features:**
1. **Real-time Activity Feed**
   - Shows all employee-related activities
   - Sorted by most recent first
   - Auto-loads last 200 logs

2. **Search Functionality**
   - Search by employee name
   - Search by action type
   - Search by description
   - Search by performer

3. **Filter by Action Type**
   - All Actions
   - Added
   - Updated
   - Archived
   - Restored
   - Deleted

4. **Refresh Button**
   - Manually reload logs
   - Shows loading animation
   - Updates with latest activities

5. **Visual Indicators**
   - Color-coded action badges
   - Icons for each action type
   - Relative timestamps (e.g., "5 minutes ago")

6. **Export Functionality**
   - Export logs to CSV/Excel
   - For reporting and auditing

---

## How It Works

### Automatic Logging

Every employee operation automatically creates a log entry:

```javascript
// Example: When adding an employee
await addEmployee(employeeData, contractFile);
// Automatically logs: "Added new employee: John Doe"

// Example: When archiving
await archiveEmployee(employeeId);
// Automatically logs: "Archived employee: John Doe"
```

### Log Service Functions

```javascript
import { addChangeLog, getChangeLogs, LOG_TYPES } from './services/changeLogService';

// Add a custom log
await addChangeLog({
  type: LOG_TYPES.EMPLOYEE_ADDED,
  action: 'Create',
  description: 'Added new employee: John Doe',
  employeeId: 'emp_123',
  employeeName: 'John Doe',
  performedBy: 'Admin',
  details: { position: 'Developer' }
});

// Get all logs
const logs = await getChangeLogs(100); // Get last 100 logs

// Get logs for specific employee
const employeeLogs = await getEmployeeChangeLogs('emp_123');
```

---

## Database Structure

### Firestore Collection: `changeLogs`

```
changeLogs/
├── log_id_1/
│   ├── type: "employee_added"
│   ├── action: "Create"
│   ├── description: "Added new employee: John Doe"
│   ├── employeeId: "emp_123"
│   ├── employeeName: "John Doe"
│   ├── performedBy: "Admin"
│   ├── performedByEmail: "admin@example.com"
│   ├── details: { position: "Developer" }
│   ├── timestamp: Timestamp
│   └── createdAt: Timestamp
├── log_id_2/
│   └── ...
```

---

## Timestamp Formatting

The system shows user-friendly relative timestamps:

- **Just now** - Less than 1 minute ago
- **5 minutes ago** - Less than 1 hour ago
- **3 hours ago** - Less than 24 hours ago
- **2 days ago** - Less than 7 days ago
- **Jan 15, 2024 2:30 PM** - Older than 7 days

---

## Security & Permissions

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /changeLogs/{logId} {
      // Only authenticated users can read logs
      allow read: if request.auth != null;
      
      // Only system can write logs (via backend)
      allow write: if request.auth != null;
    }
  }
}
```

---

## Use Cases

### 1. Audit Trail
- Track who made changes
- When changes were made
- What was changed

### 2. Compliance
- Maintain records for legal requirements
- GDPR compliance
- HR audits

### 3. Troubleshooting
- Investigate issues
- Track employee lifecycle
- Identify patterns

### 4. Reporting
- Generate activity reports
- Export for analysis
- Management dashboards

---

## Future Enhancements

### 1. Advanced Filtering
- Date range filter
- Multiple action types
- Performer filter
- Employee-specific view

### 2. Detailed Change Tracking
- Before/after values
- Field-level changes
- Change comparison view

### 3. Notifications
- Real-time activity alerts
- Email notifications
- Slack/Teams integration

### 4. Analytics
- Activity charts
- Most active users
- Peak activity times
- Trend analysis

### 5. Retention Policy
- Auto-delete old logs
- Archive old logs
- Configurable retention period

### 6. User Activity Logs
- Login/logout tracking
- Session duration
- Failed login attempts

---

## Testing

### Test Scenarios

1. **Add Employee**
   - Create new employee
   - Check Change Logs page
   - Verify "Added" entry appears

2. **Update Employee**
   - Edit employee information
   - Check Change Logs page
   - Verify "Updated" entry appears

3. **Archive Employee**
   - Delete employee from main list
   - Check Change Logs page
   - Verify "Archived" entry appears

4. **Restore Employee**
   - Restore from Archive page
   - Check Change Logs page
   - Verify "Restored" entry appears

5. **Permanent Delete**
   - Delete from Archive page
   - Check Change Logs page
   - Verify "Deleted" entry appears

---

## Troubleshooting

### Logs not appearing:
- Check Firestore rules allow read/write
- Verify Firebase connection
- Check browser console for errors

### Timestamps showing incorrectly:
- Check system timezone
- Verify Firestore timestamp format
- Check formatLogTimestamp function

### Filter not working:
- Verify filter type matches log type
- Check search query syntax
- Reload page

---

## Best Practices

1. **Regular Monitoring**
   - Check logs daily
   - Review unusual activities
   - Investigate anomalies

2. **Data Retention**
   - Set retention policy
   - Archive old logs
   - Backup regularly

3. **Access Control**
   - Limit who can view logs
   - Implement role-based access
   - Audit log access

4. **Performance**
   - Limit query results
   - Use pagination
   - Index frequently queried fields

---

**Last Updated:** 2024
**Version:** 1.0
