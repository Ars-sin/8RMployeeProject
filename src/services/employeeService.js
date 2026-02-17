import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc,
  query,
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../firebase';
import { addChangeLog, LOG_TYPES, createLogDescription } from './changeLogService';

const EMPLOYEES_COLLECTION = 'employees';

// Add new employee
export const addEmployee = async (employeeData, contractFile = null) => {
  try {
    let contractUrl = null;
    
    // Upload contract file if provided
    if (contractFile) {
      const storageRef = ref(storage, `contracts/${Date.now()}_${contractFile.name}`);
      const snapshot = await uploadBytes(storageRef, contractFile);
      contractUrl = await getDownloadURL(snapshot.ref);
    }

    const employeeDoc = {
      ...employeeData,
      contractUrl,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
      isArchived: false
    };

    const docRef = await addDoc(collection(db, EMPLOYEES_COLLECTION), employeeDoc);
    const newEmployee = { id: docRef.id, ...employeeDoc };
    
    // Log the activity
    await addChangeLog({
      type: LOG_TYPES.EMPLOYEE_ADDED,
      action: 'Create',
      description: createLogDescription(LOG_TYPES.EMPLOYEE_ADDED, employeeData.fullName),
      employeeId: docRef.id,
      employeeName: employeeData.fullName,
      performedBy: 'Admin',
      details: {
        position: employeeData.position,
        employmentId: employeeData.employmentId
      }
    });
    
    return newEmployee;
  } catch (error) {
    console.error('Error adding employee:', error);
    throw error;
  }
};

// Get all employees
export const getEmployees = async (includeArchived = false) => {
  try {
    let q = collection(db, EMPLOYEES_COLLECTION);
    
    if (!includeArchived) {
      q = query(q, where('isArchived', '==', false));
    }
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting employees:', error);
    throw error;
  }
};

// Update employee
export const updateEmployee = async (employeeId, updates, contractFile = null) => {
  try {
    const employeeRef = doc(db, EMPLOYEES_COLLECTION, employeeId);
    const updateData = {
      ...updates,
      updatedAt: Timestamp.now()
    };
    
    // Upload new contract file if provided
    if (contractFile) {
      const storageRef = ref(storage, `contracts/${Date.now()}_${contractFile.name}`);
      const snapshot = await uploadBytes(storageRef, contractFile);
      updateData.contractUrl = await getDownloadURL(snapshot.ref);
    } else if (updates.contractUrl) {
      // Keep existing contract URL if no new file
      updateData.contractUrl = updates.contractUrl;
    }
    
    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    await updateDoc(employeeRef, updateData);
    
    // Log the activity
    await addChangeLog({
      type: LOG_TYPES.EMPLOYEE_UPDATED,
      action: 'Update',
      description: createLogDescription(LOG_TYPES.EMPLOYEE_UPDATED, updates.fullName || 'Employee'),
      employeeId: employeeId,
      employeeName: updates.fullName,
      performedBy: 'Admin',
      details: {
        updatedFields: Object.keys(updates)
      }
    });
    
    return { id: employeeId, ...updateData };
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
};

// Archive employee (soft delete)
export const archiveEmployee = async (employeeId) => {
  try {
    // Get employee data first for logging
    const employees = await getEmployees();
    const employee = employees.find(emp => emp.id === employeeId);
    
    const employeeRef = doc(db, EMPLOYEES_COLLECTION, employeeId);
    await updateDoc(employeeRef, {
      isArchived: true,
      archivedAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    // Log the activity
    await addChangeLog({
      type: LOG_TYPES.EMPLOYEE_ARCHIVED,
      action: 'Archive',
      description: createLogDescription(LOG_TYPES.EMPLOYEE_ARCHIVED, employee?.fullName || 'Employee'),
      employeeId: employeeId,
      employeeName: employee?.fullName,
      performedBy: 'Admin',
      details: {
        employmentId: employee?.employmentId,
        position: employee?.position
      }
    });
  } catch (error) {
    console.error('Error archiving employee:', error);
    throw error;
  }
};

// Restore archived employee
export const restoreEmployee = async (employeeId) => {
  try {
    // Get employee data first for logging
    const employees = await getEmployees(true);
    const employee = employees.find(emp => emp.id === employeeId);
    
    const employeeRef = doc(db, EMPLOYEES_COLLECTION, employeeId);
    await updateDoc(employeeRef, {
      isArchived: false,
      archivedAt: null,
      updatedAt: Timestamp.now()
    });
    
    // Log the activity
    await addChangeLog({
      type: LOG_TYPES.EMPLOYEE_RESTORED,
      action: 'Restore',
      description: createLogDescription(LOG_TYPES.EMPLOYEE_RESTORED, employee?.fullName || 'Employee'),
      employeeId: employeeId,
      employeeName: employee?.fullName,
      performedBy: 'Admin',
      details: {
        employmentId: employee?.employmentId,
        position: employee?.position
      }
    });
  } catch (error) {
    console.error('Error restoring employee:', error);
    throw error;
  }
};

// Delete employee permanently
export const deleteEmployee = async (employeeId) => {
  try {
    // Get employee data first for logging
    const employees = await getEmployees(true);
    const employee = employees.find(emp => emp.id === employeeId);
    
    await deleteDoc(doc(db, EMPLOYEES_COLLECTION, employeeId));
    
    // Log the activity
    await addChangeLog({
      type: LOG_TYPES.EMPLOYEE_DELETED,
      action: 'Delete',
      description: createLogDescription(LOG_TYPES.EMPLOYEE_DELETED, employee?.fullName || 'Employee'),
      employeeId: employeeId,
      employeeName: employee?.fullName,
      performedBy: 'Admin',
      details: {
        employmentId: employee?.employmentId,
        position: employee?.position,
        warning: 'Permanently deleted from database'
      }
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
};

// Search employees
export const searchEmployees = async (searchTerm) => {
  try {
    const employees = await getEmployees();
    return employees.filter(emp => 
      emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.employmentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.position?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  } catch (error) {
    console.error('Error searching employees:', error);
    throw error;
  }
};
