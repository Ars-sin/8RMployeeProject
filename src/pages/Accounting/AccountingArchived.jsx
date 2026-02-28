import React, { useState, useEffect } from 'react';
import { Search, RotateCcw, Trash2 } from 'lucide-react';
import ConfirmationModal from '../../Components/ConfirmationModal';
import ViewEmployeeDetails from '../HR/ViewEmployeeDetails';
import { getEmployees, restoreEmployee, deleteEmployee, updateEmployee } from '../../services/employeeService';

const AccountingArchived = ({ projects }) => {
  const [archivedEmployees, setArchivedEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [showViewEmployeeDetails, setShowViewEmployeeDetails] = useState(false);
  const [viewingEmployee, setViewingEmployee] = useState(null);
  const itemsPerPage = 10;

  // Confirmation modal states
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'danger'
  });

  useEffect(() => {
    loadArchivedEmployees();
  }, []);

  const loadArchivedEmployees = async () => {
    try {
      setLoading(true);
      const allEmployees = await getEmployees(true); // Include archived
      const archived = allEmployees.filter(emp => emp.isArchived);
      setArchivedEmployees(archived);
    } catch (error) {
      console.error('Error loading archived employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRestoreClick = (employee) => {
    setSelectedEmployee(employee);
    setSelectedProjectId('');
    setShowRestoreModal(true);
  };

  const handleRestoreConfirm = async () => {
    if (!selectedProjectId) {
      alert('Please select a project to assign the employee to');
      return;
    }

    try {
      // Restore employee
      await restoreEmployee(selectedEmployee.id);
      
      // Update employee with new projectId
      await updateEmployee(selectedEmployee.id, { projectId: selectedProjectId });
      
      await loadArchivedEmployees();
      setShowRestoreModal(false);
      setSelectedEmployee(null);
      setSelectedProjectId('');
    } catch (error) {
      console.error('Error restoring employee:', error);
      alert('Failed to restore employee');
    }
  };

  const handleDelete = async (employee) => {
    setConfirmModal({
      isOpen: true,
      title: 'Permanently Delete Employee',
      message: `⚠️ WARNING: This will permanently delete ${employee.fullName || 'this employee'} from the database. This action cannot be undone. Are you sure?`,
      onConfirm: async () => {
        try {
          await deleteEmployee(employee.id);
          await loadArchivedEmployees();
        } catch (error) {
          console.error('Error deleting employee:', error);
          alert('Failed to delete employee');
        }
      },
      type: 'danger'
    });
  };

  const handleViewEmployeeClick = (employee) => {
    setViewingEmployee(employee);
    setShowViewEmployeeDetails(true);
  };

  const filteredEmployees = archivedEmployees.filter(emp => 
    emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employmentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(startIndex, endIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const getProjectName = (projectId) => {
    const project = projects.find(p => p.id === projectId);
    return project ? project.projectName : 'Unknown Project';
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="px-8 py-5">
          <h2 className="text-2xl font-semibold text-gray-900 mb-1">Archived Employees</h2>
          <div className="mb-4">
            <span className="text-sm text-blue-600">Archived</span>
          </div>
          
          {/* Search and Actions */}
          <div className="flex items-center justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search archived employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col overflow-hidden p-8">
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

          {/* Scrollable Table Container */}
          <div className="flex-1 overflow-auto">
            {loading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">Loading archived employees...</p>
              </div>
            ) : filteredEmployees.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">No archived employees found</p>
              </div>
            ) : (
              <table className="w-full">
                <thead className="bg-white sticky top-0 z-10">
                  <tr className="border-b border-gray-200">
                    <th className="pl-8 pr-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      EMPLOYEE ID
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      NAME
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      EMAIL
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      POSITION
                    </th>
                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      PROJECT
                    </th>
                    <th className="pl-6 pr-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                      ACTIONS
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedEmployees.map((employee) => (
                    <tr key={employee.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                      <td className="pl-8 pr-6 py-4">
                        <div className="text-sm text-gray-900">{employee.employmentId}</div>
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleViewEmployeeClick(employee)}
                          className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                        >
                          {employee.fullName}
                        </button>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{employee.email}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{employee.position}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">{getProjectName(employee.projectId)}</div>
                      </td>
                      <td className="pl-6 pr-8 py-4">
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => handleRestoreClick(employee)}
                            className="p-1.5 hover:bg-green-50 rounded transition-colors"
                            title="Restore Employee"
                          >
                            <RotateCcw className="w-4 h-4 text-gray-500 hover:text-green-600" />
                          </button>
                          <button
                            onClick={() => handleDelete(employee)}
                            className="p-1.5 hover:bg-red-50 rounded transition-colors"
                            title="Delete Permanently"
                          >
                            <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Fixed Pagination at Bottom */}
          <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
            <div className="text-sm text-gray-600">
              {filteredEmployees.length > 0 ? (
                <>
                  Showing {startIndex + 1} - {Math.min(endIndex, filteredEmployees.length)} of {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''}
                </>
              ) : (
                'No employees'
              )}
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">Page</span>
              <select 
                value={currentPage}
                onChange={(e) => setCurrentPage(Number(e.target.value))}
                className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {Array.from({ length: totalPages || 1 }, (_, i) => i + 1).map(page => (
                  <option key={page} value={page}>{page}</option>
                ))}
              </select>
              <span className="text-sm text-gray-600">of {totalPages || 1}</span>
              
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Previous page"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages || 1, prev + 1))}
                disabled={currentPage === (totalPages || 1)}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Next page"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Restore Modal */}
      {showRestoreModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Restore Employee</h3>
            <p className="text-sm text-gray-600 mb-4">
              Select a project to assign <span className="font-semibold">{selectedEmployee?.fullName}</span> to:
            </p>
            
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
            >
              <option value="">-- Select Project --</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.projectName} - {project.location}
                </option>
              ))}
            </select>

            <div className="flex gap-3 justify-end">
              <button
                onClick={() => {
                  setShowRestoreModal(false);
                  setSelectedEmployee(null);
                  setSelectedProjectId('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRestoreConfirm}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Restore
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={confirmModal.isOpen}
        onClose={() => setConfirmModal({ ...confirmModal, isOpen: false })}
        onConfirm={confirmModal.onConfirm}
        title={confirmModal.title}
        message={confirmModal.message}
        type={confirmModal.type}
      />

      {/* View Employee Details Modal */}
      {showViewEmployeeDetails && viewingEmployee && (
        <ViewEmployeeDetails
          employee={viewingEmployee}
          onClose={() => {
            setShowViewEmployeeDetails(false);
            setViewingEmployee(null);
          }}
        />
      )}
    </div>
  );
};

export default AccountingArchived;
