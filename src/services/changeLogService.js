import { collection, addDoc, getDocs, query, orderBy, limit, Timestamp } from 'firebase/firestore';
import { db } from '../firebase';

const CHANGELOGS_COLLECTION = 'changeLogs';

// Log types
export const LOG_TYPES = {
  EMPLOYEE_ADDED: 'employee_added',
  EMPLOYEE_UPDATED: 'employee_updated',
  EMPLOYEE_ARCHIVED: 'employee_archived',
  EMPLOYEE_RESTORED: 'employee_restored',
  EMPLOYEE_DELETED: 'employee_deleted',
  USER_LOGIN: 'user_login',
  USER_LOGOUT: 'user_logout'
};

// Add a change log entry
export const addChangeLog = async (logData) => {
  try {
    const logEntry = {
      type: logData.type,
      action: logData.action,
      description: logData.description,
      employeeId: logData.employeeId || null,
      employeeName: logData.employeeName || null,
      performedBy: logData.performedBy || 'Admin',
      performedByEmail: logData.performedByEmail || null,
      details: logData.details || {},
      timestamp: Timestamp.now(),
      createdAt: Timestamp.now()
    };

    const docRef = await addDoc(collection(db, CHANGELOGS_COLLECTION), logEntry);
    return { id: docRef.id, ...logEntry };
  } catch (error) {
    console.error('Error adding change log:', error);
    throw error;
  }
};

// Get all change logs
export const getChangeLogs = async (limitCount = 100) => {
  try {
    const q = query(
      collection(db, CHANGELOGS_COLLECTION),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting change logs:', error);
    throw error;
  }
};

// Get change logs for specific employee
export const getEmployeeChangeLogs = async (employeeId) => {
  try {
    const allLogs = await getChangeLogs();
    return allLogs.filter(log => log.employeeId === employeeId);
  } catch (error) {
    console.error('Error getting employee change logs:', error);
    throw error;
  }
};

// Helper function to create log description
export const createLogDescription = (type, employeeName, details = {}) => {
  switch (type) {
    case LOG_TYPES.EMPLOYEE_ADDED:
      return `Added new employee: ${employeeName}`;
    case LOG_TYPES.EMPLOYEE_UPDATED:
      return `Updated employee information for: ${employeeName}`;
    case LOG_TYPES.EMPLOYEE_ARCHIVED:
      return `Archived employee: ${employeeName}`;
    case LOG_TYPES.EMPLOYEE_RESTORED:
      return `Restored employee from archive: ${employeeName}`;
    case LOG_TYPES.EMPLOYEE_DELETED:
      return `Permanently deleted employee: ${employeeName}`;
    case LOG_TYPES.USER_LOGIN:
      return `User logged in: ${employeeName}`;
    case LOG_TYPES.USER_LOGOUT:
      return `User logged out: ${employeeName}`;
    default:
      return `Action performed on: ${employeeName}`;
  }
};

// Format timestamp for display
export const formatLogTimestamp = (timestamp) => {
  if (!timestamp) return 'Unknown time';
  
  const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
