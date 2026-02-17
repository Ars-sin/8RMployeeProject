import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const EMPLOYEES_COLLECTION = 'employees';

// Admin credentials for Employee Dashboard (hardcoded)
const ADMIN_CREDENTIALS = {
  email: 'acharlesjyth@gmail.com',
  password: 'Ch@rles123'
};

// Login function - checks admin first, then employee database
export const loginUser = async (email, password) => {
  try {
    // Check if admin login
    if (email === ADMIN_CREDENTIALS.email && password === ADMIN_CREDENTIALS.password) {
      return {
        success: true,
        user: {
          email: ADMIN_CREDENTIALS.email,
          fullName: 'Admin',
          position: 'Administrator',
          role: 'admin'
        },
        dashboardType: 'employee',
        message: 'Admin login successful'
      };
    }

    // Check employee database (email + employmentId as password)
    const q = query(
      collection(db, EMPLOYEES_COLLECTION),
      where('email', '==', email),
      where('employmentId', '==', password)
    );

    const querySnapshot = await getDocs(q);

    if (querySnapshot.empty) {
      return { success: false, message: 'Invalid password or Employee ID' };
    }

    const employeeDoc = querySnapshot.docs[0];
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
