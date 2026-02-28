import React, { useState, useMemo, useEffect } from 'react';
import { ArrowLeft, Download, Printer, Calendar, Edit2, X, DollarSign } from 'lucide-react';
import { getEmployeesRates, saveEmployeeRates } from '../../services/payrollService';

const GeneratePayroll = ({ project, employees, onBack }) => {
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [editingAttendance, setEditingAttendance] = useState(null);
  const [editingCalculation, setEditingCalculation] = useState(null);
  const [showRatesModal, setShowRatesModal] = useState(false);
  const [editingRate, setEditingRate] = useState(null);
  const [loadingRates, setLoadingRates] = useState(true);
  
  // Store attendance and calculation data for each employee
  const [attendanceData, setAttendanceData] = useState({});
  const [calculationData, setCalculationData] = useState({});
  const [ratesData, setRatesData] = useState({});

  // Generate month options
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  // Generate year options (current year and 2 years back)
  const years = Array.from({ length: 3 }, (_, i) => new Date().getFullYear() - i);

  // Load rates from database when component mounts or employees change
  useEffect(() => {
    const loadRates = async () => {
      if (employees && employees.length > 0) {
        try {
          setLoadingRates(true);
          const employeeIds = employees.map(emp => emp.id);
          const savedRates = await getEmployeesRates(employeeIds);
          setRatesData(savedRates);
        } catch (error) {
          console.error('Error loading rates:', error);
        } finally {
          setLoadingRates(false);
        }
      }
    };

    loadRates();
  }, [employees]);

  // Filter employees based on search
  const filteredEmployees = useMemo(() => {
    return employees;
  }, [employees]);

  // Get attendance data for an employee (with defaults)
  const getAttendanceData = (empId) => {
    const stored = attendanceData[empId] || {};
    const rates = getRatesData(empId);
    const perHour = parseFloat(rates.perHour) || 0;
    
    // Get OT hours and days
    const otHrs = parseFloat(stored.otHrs) || 0;
    const sundayOTHrs = parseFloat(stored.sundayOTHrs) || 0;
    const days = parseFloat(stored.days) || 0;
    const mealAllow = parseFloat(stored.mealAllow) || 0;
    
    // Calculate Total Reg OT = (OT/HRS × Per Hour) + 10%
    // Example: 10 hrs × ₱100 = ₱1,000 + 10% = ₱1,100
    const baseRegOT = otHrs * perHour;
    const calculatedTotalRegOT = baseRegOT + (baseRegOT * 0.10);
    
    // Calculate Total Sunday OT = (Sunday OT/Hrs × Per Hour) + 30%
    // Example: 8 hrs × ₱100 = ₱800 + 30% = ₱1,040
    const baseSundayOT = sundayOTHrs * perHour;
    const calculatedTotalSundayOT = baseSundayOT + (baseSundayOT * 0.30);
    
    // Calculate Total Meal Allow = Meal Allow × Days
    // Example: ₱50 × 20 days = ₱1,000
    const calculatedTotalMealAllow = mealAllow * days;
    
    // Use stored values if manually edited, otherwise use calculated
    const totalRegOT = stored.totalRegOTManuallyEdited ? (stored.totalRegOT || 0) : calculatedTotalRegOT;
    const totalSundayOT = stored.totalSundayOTManuallyEdited ? (stored.totalSundayOT || 0) : calculatedTotalSundayOT;
    const totalMealAllow = stored.totalMealAllowManuallyEdited ? (stored.totalMealAllow || 0) : calculatedTotalMealAllow;
    
    return {
      days: stored.days || 0,
      otHrs: stored.otHrs || 0,
      totalRegOT,
      sundayOTHrs: stored.sundayOTHrs || 0,
      totalSundayOT,
      addSundayMeal: stored.addSundayMeal || 0,
      specialHoliday: stored.specialHoliday || 0,
      mealAllow: stored.mealAllow || 0,
      totalMealAllow,
      totalRegOTManuallyEdited: stored.totalRegOTManuallyEdited || false,
      totalSundayOTManuallyEdited: stored.totalSundayOTManuallyEdited || false,
      totalMealAllowManuallyEdited: stored.totalMealAllowManuallyEdited || false
    };
  };

  // Get calculation data for an employee (with defaults)
  const getCalculationData = (empId) => {
    const stored = calculationData[empId] || {};
    
    // Get attendance data for calculations
    const attendance = getAttendanceData(empId);
    const rates = getRatesData(empId);
    
    // Calculate Gross Pay = Sum of ALL attendance fields
    // 1. Days × Per Day
    const daysPayment = (parseFloat(attendance.days) || 0) * (parseFloat(rates.perDay) || 0);
    
    // 2. Total Reg OT (already calculated with +10%)
    const totalRegOT = parseFloat(attendance.totalRegOT) || 0;
    
    // 3. Total Sunday OT (already calculated with +30%)
    const totalSundayOT = parseFloat(attendance.totalSundayOT) || 0;
    
    // 4. Add. Sunday MEAL
    const addSundayMeal = parseFloat(attendance.addSundayMeal) || 0;
    
    // 5. Special Holiday (with +30%)
    const specialHoliday = parseFloat(attendance.specialHoliday) || 0;
    const perHour = parseFloat(rates.perHour) || 0;
    const baseSpecialHoliday = specialHoliday * perHour;
    const specialHolidayPayment = baseSpecialHoliday + (baseSpecialHoliday * 0.30);
    
    // 6. Meal Allow
    const mealAllow = parseFloat(attendance.mealAllow) || 0;
    
    // 7. Total Meal Allow
    const totalMealAllow = parseFloat(attendance.totalMealAllow) || 0;
    
    // Calculate Gross Pay = Sum of ALL components
    const calculatedGrossPay = daysPayment + totalRegOT + totalSundayOT + addSundayMeal + specialHolidayPayment + mealAllow + totalMealAllow;
    
    // Use stored gross pay if manually edited, otherwise use calculated
    const grossPay = stored.grossPayManuallyEdited ? (stored.grossPay || 0) : calculatedGrossPay;
    
    // Get deductions (default to 0)
    const hdmf = parseFloat(stored.hdmf) || 0;
    const phic = parseFloat(stored.phic) || 0;
    const sssLoan = parseFloat(stored.sssLoan) || 0;
    const late = parseFloat(stored.late) || 0;
    const cashAdvance = parseFloat(stored.cashAdvance) || 0;
    
    // Calculate Net Pay = Gross Pay - (HDMF + PHIC + SSS LOAN + LATE + Cash Advance)
    const calculatedNetPay = grossPay - (hdmf + phic + sssLoan + late + cashAdvance);
    
    return {
      grossPay,
      hdmf,
      phic,
      sssLoan,
      late,
      cashAdvance,
      netPay: calculatedNetPay,
      grossPayManuallyEdited: stored.grossPayManuallyEdited || false
    };
  };

  // Get rates data for an employee (with defaults)
  const getRatesData = (empId) => {
    const baseSalary = parseFloat(employees.find(e => e.id === empId)?.salary) || 0;
    const stored = ratesData[empId] || {};
    const perMonthWeek = stored.perMonthWeek || baseSalary;
    const perDay = stored.perDay || (perMonthWeek / 30);
    const perHour = stored.perHour || (perDay / 8);
    return {
      perMonthWeek,
      perDay,
      perHour
    };
  };

  // Calculate totals for attendance table
  const attendanceTotals = useMemo(() => {
    return filteredEmployees.reduce((acc, emp) => {
      const data = getAttendanceData(emp.id);
      return {
        days: acc.days + (parseFloat(data.days) || 0),
        otHrs: acc.otHrs + (parseFloat(data.otHrs) || 0),
        totalRegOT: acc.totalRegOT + (parseFloat(data.totalRegOT) || 0),
        sundayOTHrs: acc.sundayOTHrs + (parseFloat(data.sundayOTHrs) || 0),
        totalSundayOT: acc.totalSundayOT + (parseFloat(data.totalSundayOT) || 0),
        addSundayMeal: acc.addSundayMeal + (parseFloat(data.addSundayMeal) || 0),
        specialHoliday: acc.specialHoliday + (parseFloat(data.specialHoliday) || 0),
        mealAllow: acc.mealAllow + (parseFloat(data.mealAllow) || 0),
        totalMealAllow: acc.totalMealAllow + (parseFloat(data.totalMealAllow) || 0)
      };
    }, {
      days: 0, otHrs: 0, totalRegOT: 0, sundayOTHrs: 0, totalSundayOT: 0,
      addSundayMeal: 0, specialHoliday: 0, mealAllow: 0, totalMealAllow: 0
    });
  }, [filteredEmployees, attendanceData]);

  // Calculate totals for calculation table
  const calculationTotals = useMemo(() => {
    return filteredEmployees.reduce((acc, emp) => {
      const data = getCalculationData(emp.id);
      return {
        grossPay: acc.grossPay + (parseFloat(data.grossPay) || 0),
        hdmf: acc.hdmf + (parseFloat(data.hdmf) || 0),
        phic: acc.phic + (parseFloat(data.phic) || 0),
        sssLoan: acc.sssLoan + (parseFloat(data.sssLoan) || 0),
        late: acc.late + (parseFloat(data.late) || 0),
        cashAdvance: acc.cashAdvance + (parseFloat(data.cashAdvance) || 0),
        netPay: acc.netPay + (parseFloat(data.netPay) || 0)
      };
    }, {
      grossPay: 0, hdmf: 0, phic: 0, sssLoan: 0, late: 0, cashAdvance: 0, netPay: 0
    });
  }, [filteredEmployees, calculationData]);

  // Calculate totals for rates table
  const ratesTotals = useMemo(() => {
    return filteredEmployees.reduce((acc, emp) => {
      const data = getRatesData(emp.id);
      return {
        perMonthWeek: acc.perMonthWeek + (parseFloat(data.perMonthWeek) || 0),
        perDay: acc.perDay + (parseFloat(data.perDay) || 0),
        perHour: acc.perHour + (parseFloat(data.perHour) || 0)
      };
    }, {
      perMonthWeek: 0, perDay: 0, perHour: 0
    });
  }, [filteredEmployees, ratesData]);

  // Handle attendance edit
  const handleAttendanceEdit = (employee) => {
    setEditingAttendance({
      ...employee,
      ...getAttendanceData(employee.id)
    });
  };

  // Handle rate edit
  const handleRateEdit = (employee) => {
    setEditingRate({
      ...employee,
      ...getRatesData(employee.id)
    });
  };

  // Handle calculation edit
  const handleCalculationEdit = (employee) => {
    setEditingCalculation({
      ...employee,
      ...getCalculationData(employee.id)
    });
  };

  // Save attendance changes
  const saveAttendanceChanges = () => {
    if (editingAttendance) {
      const newData = {
        days: parseFloat(editingAttendance.days) || 0,
        otHrs: parseFloat(editingAttendance.otHrs) || 0,
        sundayOTHrs: parseFloat(editingAttendance.sundayOTHrs) || 0,
        addSundayMeal: parseFloat(editingAttendance.addSundayMeal) || 0,
        specialHoliday: parseFloat(editingAttendance.specialHoliday) || 0,
        mealAllow: parseFloat(editingAttendance.mealAllow) || 0,
        // These fields are auto-calculated, not manually edited
        totalRegOTManuallyEdited: false,
        totalSundayOTManuallyEdited: false,
        totalMealAllowManuallyEdited: false
      };
      
      setAttendanceData(prev => ({
        ...prev,
        [editingAttendance.id]: newData
      }));
      
      // Reset gross pay manual edit flag so it recalculates
      setCalculationData(prev => ({
        ...prev,
        [editingAttendance.id]: {
          ...prev[editingAttendance.id],
          grossPayManuallyEdited: false
        }
      }));
      
      setEditingAttendance(null);
    }
  };

  // Save rate changes
  const saveRateChanges = async () => {
    if (editingRate) {
      try {
        const rateData = {
          perMonthWeek: parseFloat(editingRate.perMonthWeek) || 0,
          perDay: parseFloat(editingRate.perDay) || 0,
          perHour: parseFloat(editingRate.perHour) || 0
        };

        // Save to database
        await saveEmployeeRates(editingRate.id, rateData);

        // Update local state
        setRatesData(prev => ({
          ...prev,
          [editingRate.id]: rateData
        }));

        // Reset all calculation flags so everything recalculates with new rates
        setAttendanceData(prev => ({
          ...prev,
          [editingRate.id]: {
            ...prev[editingRate.id],
            totalRegOTManuallyEdited: false,
            totalSundayOTManuallyEdited: false,
            totalMealAllowManuallyEdited: false
          }
        }));
        
        setCalculationData(prev => ({
          ...prev,
          [editingRate.id]: {
            ...prev[editingRate.id],
            grossPayManuallyEdited: false
          }
        }));

        setEditingRate(null);
        alert('Rate saved successfully!');
      } catch (error) {
        console.error('Error saving rate:', error);
        alert('Failed to save rate');
      }
    }
  };

  // Save calculation changes (deductions only)
  const saveCalculationChanges = () => {
    if (editingCalculation) {
      const hdmf = parseFloat(editingCalculation.hdmf) || 0;
      const phic = parseFloat(editingCalculation.phic) || 0;
      const sssLoan = parseFloat(editingCalculation.sssLoan) || 0;
      const late = parseFloat(editingCalculation.late) || 0;
      const cashAdvance = parseFloat(editingCalculation.cashAdvance) || 0;

      setCalculationData(prev => ({
        ...prev,
        [editingCalculation.id]: {
          ...prev[editingCalculation.id],
          hdmf,
          phic,
          sssLoan,
          late,
          cashAdvance
        }
      }));
      setEditingCalculation(null);
    }
  };

  // Format number
  const formatNumber = (num) => {
    return parseFloat(num || 0).toFixed(2);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="px-8 py-5">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={onBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Back to Employees"
            >
              <ArrowLeft className="w-5 h-5 text-gray-600" />
            </button>
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Generate Payroll</h2>
              <p className="text-sm text-gray-500 mt-1">
                {project?.projectName || 'Project'} - {months[selectedMonth]} {selectedYear}
              </p>
            </div>
          </div>

          {/* Filters and Actions */}
          <div className="flex items-center justify-between gap-4">
            {/* Period Selection */}
            <div className="flex items-center gap-3">
              <Calendar className="w-5 h-5 text-gray-400" />
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {months.map((month, index) => (
                  <option key={index} value={index}>{month}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(Number(e.target.value))}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>

              {/* Rates Button */}
              <button
                onClick={() => setShowRatesModal(true)}
                className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium ml-4"
              >
                <DollarSign className="w-4 h-4" />
                Rates
              </button>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button
                onClick={() => window.print()}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 overflow-auto p-8 space-y-8">
        {/* Attendance/Overtime/Meal Allowance Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Attendance/Overtime/Meal Allowance</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Employees</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">Days</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">OT/HRS</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">Total Reg OT</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">Sunday OT/Hrs</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">Total Sunday OT</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">Add. Sunday MEAL</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">Special Holiday</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">Meal Allow</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">Total Meal Allow</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => {
                  const data = getAttendanceData(employee.id);
                  return (
                    <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{employee.fullName}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">{formatNumber(data.days)}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">{formatNumber(data.otHrs)}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">{formatNumber(data.totalRegOT)}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">{formatNumber(data.sundayOTHrs)}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">{formatNumber(data.totalSundayOT)}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">{formatNumber(data.addSundayMeal)}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">{formatNumber(data.specialHoliday)}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">{formatNumber(data.mealAllow)}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">{formatNumber(data.totalMealAllow)}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleAttendanceEdit(employee)}
                          className="p-2 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-100">
                <tr className="border-t-2 border-gray-300">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">Total</td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-blue-600">{formatNumber(attendanceTotals.days)}</td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-blue-600">{formatNumber(attendanceTotals.otHrs)}</td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-blue-600">{formatNumber(attendanceTotals.totalRegOT)}</td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-blue-600">{formatNumber(attendanceTotals.sundayOTHrs)}</td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-blue-600">{formatNumber(attendanceTotals.totalSundayOT)}</td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-blue-600">{formatNumber(attendanceTotals.addSundayMeal)}</td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-blue-600">{formatNumber(attendanceTotals.specialHoliday)}</td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-blue-600">{formatNumber(attendanceTotals.mealAllow)}</td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-blue-600">{formatNumber(attendanceTotals.totalMealAllow)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Calculations Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">Calculations</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Employees</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">Gross Pay</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">HDMF</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">PHIC</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">SSS LOAN</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">LATE</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">Cash Advance</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">NET PAY</th>
                  <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">Action</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee) => {
                  const data = getCalculationData(employee.id);
                  return (
                    <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="px-6 py-4 text-sm text-gray-900">{employee.fullName}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">{formatNumber(data.grossPay)}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">{formatNumber(data.hdmf)}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">{formatNumber(data.phic)}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">{formatNumber(data.sssLoan)}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">{formatNumber(data.late)}</td>
                      <td className="px-6 py-4 text-center text-sm text-gray-900">{formatNumber(data.cashAdvance)}</td>
                      <td className="px-6 py-4 text-center text-sm font-bold text-green-600">{formatNumber(data.netPay)}</td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleCalculationEdit(employee)}
                          className="p-2 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Edit2 className="w-4 h-4 text-gray-600" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
              <tfoot className="bg-gray-100">
                <tr className="border-t-2 border-gray-300">
                  <td className="px-6 py-4 text-sm font-bold text-gray-900">Totals</td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-blue-600">{formatNumber(calculationTotals.grossPay)}</td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-blue-600">{formatNumber(calculationTotals.hdmf)}</td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-blue-600">{formatNumber(calculationTotals.phic)}</td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-blue-600">{formatNumber(calculationTotals.sssLoan)}</td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-blue-600">{formatNumber(calculationTotals.late)}</td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-blue-600">{formatNumber(calculationTotals.cashAdvance)}</td>
                  <td className="px-6 py-4 text-center text-sm font-bold text-green-600">{formatNumber(calculationTotals.netPay)}</td>
                  <td></td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

        {/* Save Changes Button */}
        <div className="flex justify-end">
          <button className="px-6 py-3 bg-blue-900 text-white rounded-lg hover:bg-blue-800 transition-colors font-semibold">
            Save Changes
          </button>
        </div>
      </main>

      {/* Attendance Edit Modal */}
      {editingAttendance && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Attendance - {editingAttendance.fullName}
              </h2>
              <button 
                onClick={() => setEditingAttendance(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Total Reg OT, Total Sunday OT, and Total Meal Allow are automatically calculated and will be displayed in the table.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Days</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingAttendance.days}
                    onChange={(e) => setEditingAttendance({...editingAttendance, days: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">OT/HRS</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingAttendance.otHrs}
                    onChange={(e) => setEditingAttendance({...editingAttendance, otHrs: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Sunday OT/Hrs</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingAttendance.sundayOTHrs}
                    onChange={(e) => setEditingAttendance({...editingAttendance, sundayOTHrs: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Add. Sunday MEAL</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingAttendance.addSundayMeal}
                    onChange={(e) => setEditingAttendance({...editingAttendance, addSundayMeal: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Holiday</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingAttendance.specialHoliday}
                    onChange={(e) => setEditingAttendance({...editingAttendance, specialHoliday: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Meal Allow</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingAttendance.mealAllow}
                    onChange={(e) => setEditingAttendance({...editingAttendance, mealAllow: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setEditingAttendance(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={saveAttendanceChanges}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Calculation Edit Modal */}
      {editingCalculation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Deductions - {editingCalculation.fullName}
              </h2>
              <button 
                onClick={() => setEditingCalculation(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>Note:</strong> Gross Pay and Net Pay are automatically calculated. You can only edit the deduction amounts.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Gross Pay (Read-only)</label>
                  <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-100 text-gray-700 font-semibold">
                    {formatNumber(editingCalculation.grossPay)}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">HDMF</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingCalculation.hdmf}
                    onChange={(e) => setEditingCalculation({...editingCalculation, hdmf: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">PHIC</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingCalculation.phic}
                    onChange={(e) => setEditingCalculation({...editingCalculation, phic: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">SSS LOAN</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingCalculation.sssLoan}
                    onChange={(e) => setEditingCalculation({...editingCalculation, sssLoan: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">LATE</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingCalculation.late}
                    onChange={(e) => setEditingCalculation({...editingCalculation, late: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cash Advance</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingCalculation.cashAdvance}
                    onChange={(e) => setEditingCalculation({...editingCalculation, cashAdvance: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">NET PAY (Calculated)</label>
                  <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-green-50 text-green-700 font-bold text-lg">
                    {formatNumber(
                      (parseFloat(editingCalculation.grossPay) || 0) -
                      (parseFloat(editingCalculation.hdmf) || 0) -
                      (parseFloat(editingCalculation.phic) || 0) -
                      (parseFloat(editingCalculation.sssLoan) || 0) -
                      (parseFloat(editingCalculation.late) || 0) -
                      (parseFloat(editingCalculation.cashAdvance) || 0)
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setEditingCalculation(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={saveCalculationChanges}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rates Modal */}
      {showRatesModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Rates</h2>
              <button 
                onClick={() => setShowRatesModal(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {loadingRates ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading rates...</p>
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr className="border-b border-gray-200">
                        <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase">Employees</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">Per Month/Week</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">Per Day</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">Per Hour</th>
                        <th className="px-6 py-3 text-center text-xs font-bold text-gray-700 uppercase">Action</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredEmployees.map((employee) => {
                        const data = getRatesData(employee.id);
                        return (
                          <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50">
                            <td className="px-6 py-4 text-sm text-gray-900">{employee.fullName}</td>
                            <td className="px-6 py-4 text-center text-sm text-gray-900">{formatNumber(data.perMonthWeek)}</td>
                            <td className="px-6 py-4 text-center text-sm text-gray-900">{formatNumber(data.perDay)}</td>
                            <td className="px-6 py-4 text-center text-sm text-gray-900">{formatNumber(data.perHour)}</td>
                            <td className="px-6 py-4 text-center">
                              <button
                                onClick={() => handleRateEdit(employee)}
                                className="p-2 hover:bg-blue-50 rounded transition-colors"
                                title="Edit"
                              >
                                <Edit2 className="w-4 h-4 text-gray-600" />
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot className="bg-gray-100">
                      <tr className="border-t-2 border-gray-300">
                        <td className="px-6 py-4 text-sm font-bold text-gray-900">Total</td>
                        <td className="px-6 py-4 text-center text-sm font-bold text-blue-600">{formatNumber(ratesTotals.perMonthWeek)}</td>
                        <td className="px-6 py-4 text-center text-sm font-bold text-blue-600">{formatNumber(ratesTotals.perDay)}</td>
                        <td className="px-6 py-4 text-center text-sm font-bold text-blue-600">{formatNumber(ratesTotals.perHour)}</td>
                        <td></td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end">
              <button
                onClick={() => setShowRatesModal(false)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Rate Edit Modal */}
      {editingRate && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Edit Rate - {editingRate.fullName}
              </h2>
              <button 
                onClick={() => setEditingRate(null)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Per Month/Week</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingRate.perMonthWeek}
                    onChange={(e) => setEditingRate({...editingRate, perMonthWeek: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Per Day</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingRate.perDay}
                    onChange={(e) => setEditingRate({...editingRate, perDay: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Per Hour</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingRate.perHour}
                    onChange={(e) => setEditingRate({...editingRate, perHour: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
              <button
                onClick={() => setEditingRate(null)}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={saveRateChanges}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeneratePayroll;
