import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, RotateCcw, Trash2 } from 'lucide-react';
import ConfirmationModal from '../../Components/ConfirmationModal';
import { getEmployees, restoreEmployee, deleteEmployee } from '../../services/employeeService';

const ArchivedPage = ({ onNavigate, projects }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [archivedEmployees, setArchivedEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showRestoreModal, setShowRestoreModal] = useState(false);
  const [restoringEmployee, setRestoringEmployee] = useState(null);
  const [selectedProjectId, setSelectedProjectId] = useState('');

  // Confirmation modal states
  const [confirmModal, setConfirmModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    type: 'danger'
  });

  // Load archived employees from Firebase
  useEffect(() => {
    const loadArchivedEmployees = async () => {
      try {
        const allEmployees = await getEmployees(true); // Include archived
        const archived = allEmployees.filter(emp => emp.isArchived);
        setArchivedEmployees(archived);
      } catch (error) {
        console.error('Error loading archived employees:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadArchivedEmployees();
  }, []);

  const handleRestore = async (employee) => {
    // Show modal to select project
    setRestoringEmployee(employee);
    setShowRestoreModal(true);
  };

  const handleConfirmRestore = async () => {
    if (!selectedProjectId) {
      alert('Please select a project');
      return;
    }

    try {
      // Restore employee and assign to selected project
      await restoreEmployee(restoringEmployee.id);
      
      // Update employee with new projectId
      const { updateEmployee } = await import('../../services/employeeService');
      await updateEmployee(restoringEmployee.id, { projectId: selectedProjectId });
      
      // Remove the restored employee from the archived list immediately
      setArchivedEmployees(prevEmployees => 
        prevEmployees.filter(emp => emp.id !== restoringEmployee.id)
      );
      
      // Close modal and reset state
      setShowRestoreModal(false);
      setRestoringEmployee(null);
      setSelectedProjectId('');
      
      alert('Employee restored successfully!');
    } catch (error) {
      console.error('Error restoring employee:', error);
      alert('Failed to restore employee. Please try again.');
    }
  };

  const handlePermanentDelete = async (employee) => {
    setConfirmModal({
      isOpen: true,
      title: 'Permanently Delete Employee',
      message: `⚠️ WARNING: This will permanently delete ${employee.fullName || employee.name} from the database. This action cannot be undone. Are you sure?`,
      onConfirm: async () => {
        try {
          await deleteEmployee(employee.id);
          // Remove the deleted employee from the list immediately
          setArchivedEmployees(prevEmployees => 
            prevEmployees.filter(emp => emp.id !== employee.id)
          );
          alert('Employee permanently deleted');
        } catch (error) {
          console.error('Error deleting employee:', error);
          alert('Failed to delete employee. Please try again.');
        }
      },
      type: 'danger'
    });
  };

  const handleExport = () => {
    alert('Exporting archived employee data...');
  };

  const filteredEmployees = archivedEmployees
    .filter(emp =>
      (emp.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (emp.fullName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (emp.id?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (emp.employmentId?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (emp.contact?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (emp.email?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );

  const totalPages = 13;

  return (
    <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 flex-shrink-0">
        <div className="px-8 py-5">
          <h1 className="text-2xl font-semibold text-gray-900 mb-1">Archived Employees</h1>
          <div className="mb-4">
            <span className="text-sm text-blue-600">Archived</span>
          </div>
          
          {/* Search and Actions */}
          <div className="flex items-center justify-between gap-4">
            {/* Search */}
            <div className="flex-1 max-w-md relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search for id, open Consumer"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3">
              <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                <Filter className="w-4 h-4" />
                Filter
              </button>
              
              <button 
                onClick={handleExport}
                className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
              >
                <Download className="w-4 h-4" />
                Export
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex flex-col overflow-hidden p-8">
        <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">

          {/* Scrollable Table Container */}
          <div className="flex-1 overflow-auto">
            <table className="w-full">
              <thead className="bg-white sticky top-0 z-10">
                <tr className="border-b border-gray-200">
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    EMPLOYEE
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    PROJECT
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    CONTACT
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    POSITION
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    ADDRESS
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    ACTION
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((employee, index) => (
                  <tr key={employee.id || index} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-gray-900 font-medium">
                          {employee.fullName || employee.name || 'No Name'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600">
                        {projects?.find(p => p.id === employee.projectId)?.projectName || 'Unassigned'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <div className="text-sm text-gray-900">{employee.email || 'N/A'}</div>
                        <div className="text-sm text-gray-500">{employee.contact || 'N/A'}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-700">{employee.position || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 leading-relaxed">{employee.address}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <button 
                          onClick={() => handleRestore(employee)}
                          className="p-1.5 hover:bg-green-50 rounded transition-colors"
                          title="Restore Employee"
                        >
                          <RotateCcw className="w-4 h-4 text-gray-500 hover:text-green-600" />
                        </button>
                        <button 
                          onClick={() => handlePermanentDelete(employee.id)}
                          className="p-1.5 hover:bg-red-50 rounded transition-colors"
                          title="Delete Permanently (Cannot be undone)"
                        >
                          <Trash2 className="w-4 h-4 text-gray-500 hover:text-red-600" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Fixed Pagination at Bottom */}
          <div className="px-6 py-4 border-t border-gray-200 flex-shrink-0 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-white">
            <div className="text-sm text-gray-600">
              1 - 10 of {totalPages} Pages
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">This page on</span>
              <select className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option>1</option>
                <option>2</option>
                <option>3</option>
              </select>
              <button 
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button 
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
                className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
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
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Restore Employee
            </h3>
            <p className="text-sm text-gray-600 mb-4">
              Select a project to assign <span className="font-semibold">{restoringEmployee?.fullName || restoringEmployee?.name}</span> to:
            </p>
            
            <select
              value={selectedProjectId}
              onChange={(e) => setSelectedProjectId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-6"
            >
              <option value="">Select a project...</option>
              {projects?.map(project => (
                <option key={project.id} value={project.id}>
                  {project.projectName} - {project.location}
                </option>
              ))}
            </select>

            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowRestoreModal(false);
                  setRestoringEmployee(null);
                  setSelectedProjectId('');
                }}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRestore}
                disabled={!selectedProjectId}
                className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
    </div>
  );
};

export default ArchivedPage;
