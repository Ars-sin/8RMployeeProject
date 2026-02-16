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
    return { id: docRef.id, ...employeeDoc };
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
    return { id: employeeId, ...updateData };
  } catch (error) {
    console.error('Error updating employee:', error);
    throw error;
  }
};

// Archive employee (soft delete)
export const archiveEmployee = async (employeeId) => {
  try {
    const employeeRef = doc(db, EMPLOYEES_COLLECTION, employeeId);
    await updateDoc(employeeRef, {
      isArchived: true,
      archivedAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error archiving employee:', error);
    throw error;
  }
};

// Restore archived employee
export const restoreEmployee = async (employeeId) => {
  try {
    const employeeRef = doc(db, EMPLOYEES_COLLECTION, employeeId);
    await updateDoc(employeeRef, {
      isArchived: false,
      archivedAt: null,
      updatedAt: Timestamp.now()
    });
  } catch (error) {
    console.error('Error restoring employee:', error);
    throw error;
  }
};

// Delete employee permanently
export const deleteEmployee = async (employeeId) => {
  try {
    await deleteDoc(doc(db, EMPLOYEES_COLLECTION, employeeId));
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
