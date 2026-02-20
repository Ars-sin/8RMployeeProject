import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, Timestamp } from 'firebase/firestore';
import { addChangeLog, LOG_TYPES, createLogDescription } from './changeLogService';

// Get all admins
export const getAdmins = async () => {
  try {
    const adminsRef = collection(db, 'admins');
    const snapshot = await getDocs(adminsRef);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
  } catch (error) {
    console.error('Error getting admins:', error);
    throw error;
  }
};

// Add new admin
export const addAdmin = async (adminData) => {
  try {
    const adminsRef = collection(db, 'admins');
    const docRef = await addDoc(adminsRef, {
      ...adminData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    // Log the change
    await addChangeLog({
      type: 'admin_added',
      action: 'added',
      description: `Added new admin: ${adminData.fullName}`,
      employeeId: docRef.id,
      employeeName: adminData.fullName,
      performedBy: 'Super Admin',
      details: {
        position: adminData.position,
        email: adminData.email
      }
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error adding admin:', error);
    throw error;
  }
};

// Update admin
export const updateAdmin = async (adminId, adminData) => {
  try {
    const adminRef = doc(db, 'admins', adminId);
    await updateDoc(adminRef, {
      ...adminData,
      updatedAt: Timestamp.now()
    });
    
    // Log the change
    await addChangeLog({
      type: 'admin_updated',
      action: 'updated',
      description: `Updated admin information: ${adminData.fullName}`,
      employeeId: adminId,
      employeeName: adminData.fullName,
      performedBy: 'Super Admin',
      details: {
        position: adminData.position,
        email: adminData.email
      }
    });
  } catch (error) {
    console.error('Error updating admin:', error);
    throw error;
  }
};

// Delete admin
export const deleteAdmin = async (adminId) => {
  try {
    // Get admin data before deleting for logging
    const adminsRef = collection(db, 'admins');
    const snapshot = await getDocs(adminsRef);
    const adminDoc = snapshot.docs.find(doc => doc.id === adminId);
    const adminData = adminDoc ? adminDoc.data() : {};
    
    const adminRef = doc(db, 'admins', adminId);
    await deleteDoc(adminRef);
    
    // Log the change
    await addChangeLog({
      type: 'admin_deleted',
      action: 'deleted',
      description: `Deleted admin: ${adminData.fullName || 'Unknown'}`,
      employeeId: adminId,
      employeeName: adminData.fullName || 'Unknown',
      performedBy: 'Super Admin',
      details: {
        position: adminData.position,
        email: adminData.email
      }
    });
  } catch (error) {
    console.error('Error deleting admin:', error);
    throw error;
  }
};

// Get admin by email
export const getAdminByEmail = async (email) => {
  try {
    const adminsRef = collection(db, 'admins');
    const q = query(adminsRef, where('email', '==', email));
    const snapshot = await getDocs(q);
    
    if (snapshot.empty) {
      return null;
    }
    
    const doc = snapshot.docs[0];
    return {
      id: doc.id,
      ...doc.data()
    };
  } catch (error) {
    console.error('Error getting admin by email:', error);
    throw error;
  }
};
