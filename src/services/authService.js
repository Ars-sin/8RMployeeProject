import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const EMPLOYEES_COLLECTION = 'employees';
const ADMINS_COLLECTION = 'admins';

// Admin credentials for super admin (hardcoded)
const SUPER_ADMIN_CREDENTIALS = {
  email: 'acharlesjyth@gmail.com',
  password: 'Ch@rles123'
};

// Login function - checks super admin first, then admins collection, then employee database
export const loginUser = async (email, password) => {
  try {
    // Check if super admin login
    if (email === SUPER_ADMIN_CREDENTIALS.email && password === SUPER_ADMIN_CREDENTIALS.password) {
      return {
        success: true,
        user: {
          email: SUPER_ADMIN_CREDENTIALS.email,
          fullName: 'Super Admin',
          position: 'Administrator',
          role: 'super_admin'
        },
        dashboardType: 'employee',
        message: 'Super admin login successful'
      };
    }

    // Check admins collection (email + idNumber as password)
    const adminQuery = query(
      collection(db, ADMINS_COLLECTION),
      where('email', '==', email),
      where('idNumber', '==', password)
    );

    const adminSnapshot = await getDocs(adminQuery);

    if (!adminSnapshot.empty) {
      const adminDoc = adminSnapshot.docs[0];
      const admin = {
        id: adminDoc.id,
        ...adminDoc.data(),
        role: 'admin'
      };

      // Determine dashboard based on admin position
      const dashboardType = getDashboardRoute(admin.position);

      return {
        success: true,
        user: admin,
        dashboardType,
        message: 'Admin login successful'
      };
    }

    // Check employee database (email + employmentId as password)
    const employeeQuery = query(
      collection(db, EMPLOYEES_COLLECTION),
      where('email', '==', email),
      where('employmentId', '==', password)
    );

    const employeeSnapshot = await getDocs(employeeQuery);

    if (employeeSnapshot.empty) {
      return { success: false, message: 'Invalid email or password/ID' };
    }

    const employeeDoc = employeeSnapshot.docs[0];
    const employee = {
      id: employeeDoc.id,
      ...employeeDoc.data(),
      role: 'employee'
    };

    // Determine dashboard based on position
    const dashboardType = getDashboardRoute(employee.position);

    return {
      success: true,
      user: employee,
      dashboardType,
      message: 'Login successful'
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'Login failed. Please try again.'
    };
  }
};

// Get dashboard route based on position
export const getDashboardRoute = (position) => {
  const positionLower = position?.toLowerCase() || '';
  
  if (positionLower.includes('hr') || positionLower.includes('human resource')) {
    return 'hr';
  } else if (positionLower.includes('accounting') || positionLower.includes('accountant')) {
    return 'accounting';
  } else {
    return 'employee';
  }
};
