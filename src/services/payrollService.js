import { 
  collection, 
  doc, 
  setDoc, 
  getDoc,
  getDocs,
  query,
  where,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../firebase';

const PAYROLL_RATES_COLLECTION = 'payrollRates';

// Save or update employee rates
export const saveEmployeeRates = async (employeeId, ratesData) => {
  try {
    const rateDoc = {
      employeeId,
      perMonthWeek: parseFloat(ratesData.perMonthWeek) || 0,
      perDay: parseFloat(ratesData.perDay) || 0,
      perHour: parseFloat(ratesData.perHour) || 0,
      updatedAt: Timestamp.now()
    };

    await setDoc(doc(db, PAYROLL_RATES_COLLECTION, employeeId), rateDoc);
    return rateDoc;
  } catch (error) {
    console.error('Error saving employee rates:', error);
    throw error;
  }
};

// Get employee rates
export const getEmployeeRates = async (employeeId) => {
  try {
    const docRef = doc(db, PAYROLL_RATES_COLLECTION, employeeId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error('Error getting employee rates:', error);
    throw error;
  }
};

// Get all rates for multiple employees
export const getEmployeesRates = async (employeeIds) => {
  try {
    const ratesMap = {};
    
    for (const empId of employeeIds) {
      const rates = await getEmployeeRates(empId);
      if (rates) {
        ratesMap[empId] = rates;
      }
    }
    
    return ratesMap;
  } catch (error) {
    console.error('Error getting employees rates:', error);
    throw error;
  }
};

// Get all rates
export const getAllRates = async () => {
  try {
    const querySnapshot = await getDocs(collection(db, PAYROLL_RATES_COLLECTION));
    const ratesMap = {};
    
    querySnapshot.docs.forEach(doc => {
      ratesMap[doc.id] = doc.data();
    });
    
    return ratesMap;
  } catch (error) {
    console.error('Error getting all rates:', error);
    throw error;
  }
};
