import { db } from '../firebase';
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, Timestamp } from 'firebase/firestore';
import { addChangeLog, LOG_TYPES, createLogDescription } from './changeLogService';

// Get all admins
export const getAdmins = async (includeArchived = false) => {
  try {
    let q = collection(db, 'admins');
    
    if (!includeArchived) {
      q = query(q, where('isArchived', '==', false));
    }
    
    const snapshot = await getDocs(q);
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
      updatedAt: Timestamp.now(),
      isArchived: false
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

// Archive admin (soft delete)
export const archiveAdmin = async (adminId) => {
  try {
    // Get admin data first for logging
    const admins = await getAdmins();
    const admin = admins.find(adm => adm.id === adminId);
    
    const adminRef = doc(db, 'admins', adminId);
    await updateDoc(adminRef, {
      isArchived: true,
      archivedAt: Timestamp.now(),
      updatedAt: Timestamp.now()
    });
    
    // Log the activity
    await addChangeLog({
      type: 'admin_archived',
      action: 'archived',
      description: `Archived admin: ${admin?.fullName || 'Unknown'}`,
      employeeId: adminId,
      employeeName: admin?.fullName || 'Unknown',
      performedBy: 'Super Admin',
      details: {
        position: admin?.position,
        email: admin?.email
      }
    });
  } catch (error) {
    console.error('Error archiving admin:', error);
    throw error;
  }
};

// Restore archived admin
export const restoreAdmin = async (adminId) => {
  try {
    // Get admin data first for logging
    const admins = await getAdmins(true);
    const admin = admins.find(adm => adm.id === adminId);
    
    const adminRef = doc(db, 'admins', adminId);
    await updateDoc(adminRef, {
      isArchived: false,
      archivedAt: null,
      updatedAt: Timestamp.now()
    });
    
    // Log the activity
    await addChangeLog({
      type: 'admin_restored',
      action: 'restored',
      description: `Restored admin: ${admin?.fullName || 'Unknown'}`,
      employeeId: adminId,
      employeeName: admin?.fullName || 'Unknown',
      performedBy: 'Super Admin',
      details: {
        position: admin?.position,
        email: admin?.email
      }
    });
  } catch (error) {
    console.error('Error restoring admin:', error);
    throw error;
  }
};

// Delete admin permanently
export const deleteAdmin = async (adminId) => {
  try {
    // Get admin data before deleting for logging
    const admins = await getAdmins(true);
    const admin = admins.find(adm => adm.id === adminId);
    
    const adminRef = doc(db, 'admins', adminId);
    await deleteDoc(adminRef);
    
    // Log the change
    await addChangeLog({
      type: 'admin_deleted',
      action: 'deleted',
      description: `Permanently deleted admin: ${admin?.fullName || 'Unknown'}`,
      employeeId: adminId,
      employeeName: admin?.fullName || 'Unknown',
      performedBy: 'Super Admin',
      details: {
        position: admin?.position,
        email: admin?.email,
        warning: 'Permanently deleted from database'
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

// Check for duplicate email or position
export const checkDuplicateAdmin = async (email, position, excludeAdminId = null) => {
  try {
    const admins = await getAdmins(false); // Only check active admins
    
    const duplicates = {
      email: false,
      position: false,
      emailAdmin: null,
      positionAdmin: null
    };
    
    for (const admin of admins) {
      // Skip the admin being edited
      if (excludeAdminId && admin.id === excludeAdminId) {
        continue;
      }
      
      // Check for duplicate email
      if (admin.email.toLowerCase() === email.toLowerCase()) {
        duplicates.email = true;
        duplicates.emailAdmin = admin.fullName;
      }
      
      // Check for duplicate position
      if (admin.position.toLowerCase() === position.toLowerCase()) {
        duplicates.position = true;
        duplicates.positionAdmin = admin.fullName;
      }
    }
    
    return duplicates;
  } catch (error) {
    console.error('Error checking duplicate admin:', error);
    throw error;
  }
};
