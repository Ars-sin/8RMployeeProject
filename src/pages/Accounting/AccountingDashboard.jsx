import React, { useState, useEffect } from 'react';
import { DollarSign, TrendingUp, FileText, CreditCard, LogOut, Briefcase, Archive, ClipboardList, Search, Filter, Download, Plus, Trash2 } from 'lucide-react';
import editIcon from '../../Components/ui/edit.png';
import AccountingArchived from './AccountingArchived';
import AccountingChangeLogs from './AccountingChangeLogs';
import ConfirmationModal from '../../Components/ConfirmationModal';
import LoadingSpinner from '../../Components/LoadingSpinner';
import ViewEmployeeDetails from '../HR/ViewEmployeeDetails';
import { getProjects } from '../../services/projectService';
import { getEmployees } from '../../services/employeeService';

const AccountingDashboard = ({ user, onLogout }) => {
  const [currentView, setCurrentView] = useState('projects'); // 'projects', 'employees', 'archived', 'changelogs'
  const [selectedProject, setSelectedProject] = useState(null); // Currently selected project
  const [projects, setProjects] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [projectsLoading, setProjectsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentProjectPage, setCurrentProjectPage] = useState(1);
  const [currentEmployeePage, setCurrentEmployeePage] = useState(1);
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
    loadProjects();
    loadEmployees();
  }, []);

  const loadProjects = async () => {
    try {
      setProjectsLoading(true);
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setProjectsLoading(false);
    }
  };

  const loadEmployees = async () => {
    try {
      setLoading(true);
      const data = await getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error loading employees:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleProjectClick = (project) => {
    setSelectedProject(project);
    setCurrentView('employees');
    setSearchTerm(''); // Reset search when switching projects
  };

  const handleBackToProjects = () => {
    setSelectedProject(null);
    setCurrentView('projects');
    setSearchTerm('');
  };

  // Filter employees by selected project
  const projectEmployees = selectedProject 
    ? employees.filter(emp => emp.projectId === selectedProject.id)
    : employees;

  const filteredEmployees = projectEmployees.filter(emp => 
    emp.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.employmentId?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    emp.position?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredProjects = projects.filter(proj => 
    proj.projectName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proj.location?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    proj.status?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Pagination for Projects
  const totalProjectPages = Math.ceil(filteredProjects.length / itemsPerPage);
  const projectStartIndex = (currentProjectPage - 1) * itemsPerPage;
  const projectEndIndex = projectStartIndex + itemsPerPage;
  const paginatedProjects = filteredProjects.slice(projectStartIndex, projectEndIndex);

  // Pagination for Employees
  const totalEmployeePages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const employeeStartIndex = (currentEmployeePage - 1) * itemsPerPage;
  const employeeEndIndex = employeeStartIndex + itemsPerPage;
  const paginatedEmployees = filteredEmployees.slice(employeeStartIndex, employeeEndIndex);

  // Reset to page 1 when search changes
  useEffect(() => {
    setCurrentProjectPage(1);
    setCurrentEmployeePage(1);
  }, [searchTerm]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'active':
      case 'in progress':
        return 'bg-green-100 text-green-800';
      case 'completed':
        return 'bg-blue-100 text-blue-800';
      case 'on hold':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'planning':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleLogoutClick = () => {
    setConfirmModal({
      isOpen: true,
      title: 'Logout',
      message: 'Are you sure you want to logout?',
      onConfirm: onLogout,
      type: 'info'
    });
  };

  const handleViewEmployeeClick = (employee) => {
    setViewingEmployee(employee);
    setShowViewEmployeeDetails(true);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="bg-white w-64 flex flex-col border-r border-gray-200">
        <div className="p-6 pb-24 flex-1">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8">
            <div className="w-10 h-10 bg-white border-2 border-gray-200 rounded-lg flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M5 17 L5 10 L10 5 L15 10 L15 17" stroke="#666" strokeWidth="1.5" fill="none"/>
                <rect x="7.5" y="12.5" width="5" height="4.5" fill="#666"/>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold">
                <span className="text-green-600">8</span>
                <span className="text-gray-800">RM</span>
              </h1>
            </div>
          </div>

          {/* User Info */}
          

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-3 mt-20"></p>
            <nav className="space-y-1">
              <button 
                onClick={handleBackToProjects}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium ${
                  currentView === 'projects' || currentView === 'employees'
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Briefcase className="w-5 h-5" />
                Projects
              </button>
              
              <button 
                onClick={() => setCurrentView('archived')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium ${
                  currentView === 'archived' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Archive className="w-5 h-5" />
                Archived
              </button>

              <button 
                onClick={() => setCurrentView('changelogs')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium ${
                  currentView === 'changelogs' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <ClipboardList className="w-5 h-5" />
                Change Logs
              </button>
            </nav>
          </div>
        </div>

        {/* Logout Button */}
        <div className="p-6">
          <button 
            onClick={handleLogoutClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-sm"
          >
            <LogOut className="w-5 h-5" />
            Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden ml-1">
        {currentView === 'archived' ? (
          <AccountingArchived projects={projects} />
        ) : currentView === 'changelogs' ? (
          <AccountingChangeLogs />
        ) : currentView === 'employees' ? (
          // Employees List View (for selected project)
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 flex-shrink-0">
              <div className="px-8 py-5">
                <h2 className="text-2xl font-semibold text-gray-900 mb-1">
                  {selectedProject?.projectName || 'Project'} - Employees
                </h2>
                <div className="mb-4">
                  <button
                    onClick={handleBackToProjects}
                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline"
                  >
                    Projects › {selectedProject?.projectName || 'Project'}
                  </button>
                </div>
                
                {/* Search and Actions */}
                <div className="flex items-center justify-between gap-4">
                  {/* Search */}
                  <div className="flex-1 max-w-md relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search for id, name Employees"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                      <Filter className="w-4 h-4" />
                      Filter
                    </button>
                    
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
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
                  {loading ? (
                    <LoadingSpinner message="Loading Employees" />
                  ) : filteredEmployees.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">No employees found in this project</p>
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
                            GROSS PAY
                          </th>
                          <th className="pl-6 pr-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            NET PAY
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
                              <div className="text-sm text-gray-900">{employee.grossPay || '11,750.00'}</div>
                            </td>
                            <td className="pl-6 pr-8 py-4">
                              <div className="text-sm text-gray-900">{employee.netPay || '7,145.38'}</div>
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
                        Showing {employeeStartIndex + 1} - {Math.min(employeeEndIndex, filteredEmployees.length)} of {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''}
                      </>
                    ) : (
                      'No employees'
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Page</span>
                    <select 
                      value={currentEmployeePage}
                      onChange={(e) => setCurrentEmployeePage(Number(e.target.value))}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Array.from({ length: totalEmployeePages || 1 }, (_, i) => i + 1).map(page => (
                        <option key={page} value={page}>{page}</option>
                      ))}
                    </select>
                    <span className="text-sm text-gray-600">of {totalEmployeePages || 1}</span>
                    
                    <button 
                      onClick={() => setCurrentEmployeePage(prev => Math.max(1, prev - 1))}
                      disabled={currentEmployeePage === 1}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Previous page"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <button 
                      onClick={() => setCurrentEmployeePage(prev => Math.min(totalEmployeePages || 1, prev + 1))}
                      disabled={currentEmployeePage === (totalEmployeePages || 1)}
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
          </div>
        ) : (
          // Projects List View
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 flex-shrink-0">
              <div className="px-8 py-5">
                <h2 className="text-2xl font-semibold text-gray-900 mb-1">Projects</h2>
                <div className="mb-4">
                  <span className="text-sm text-blue-600">Projects</span>
                </div>
                
                {/* Search and Actions */}
                <div className="flex items-center justify-between gap-4">
                  {/* Search */}
                  <div className="flex-1 max-w-md relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search for id, name Projects"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-3">
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
                      <Filter className="w-4 h-4" />
                      Filter
                    </button>
                    
                    <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium">
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
                  {projectsLoading ? (
                    <LoadingSpinner message="Loading Projects" />
                  ) : filteredProjects.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">No projects found</p>
                    </div>
                  ) : (
                    <table className="w-full">
                      <thead className="bg-white sticky top-0 z-10">
                        <tr className="border-b border-gray-200">
                          <th className="pl-8 pr-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            PROJECT NAME
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            GROSS PAY
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            NET PAY
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            PAYROLL PERIOD
                          </th>
                          <th className="pl-6 pr-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            ACTION
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedProjects.map((project) => (
                          <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="pl-8 pr-6 py-4">
                              <button
                                onClick={() => handleProjectClick(project)}
                                className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors text-left font-medium"
                              >
                                {project.projectName}
                              </button>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{project.grossPay || '11,750.00'}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{project.netPay || '7145.38'}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-900">{project.payrollPeriod || 'January 16-22, 2026'}</div>
                            </td>
                            <td className="pl-6 pr-8 py-4">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => alert(`Edit ${project.projectName}`)}
                                  className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                                  title="Edit Project"
                                >
                                  <img src={editIcon} alt="Edit" className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => {
                                    setConfirmModal({
                                      isOpen: true,
                                      title: 'Delete Project',
                                      message: `Are you sure you want to delete ${project.projectName}? This action cannot be undone.`,
                                      onConfirm: () => {
                                        alert(`Delete ${project.projectName}`);
                                      },
                                      type: 'danger'
                                    });
                                  }}
                                  className="p-1.5 hover:bg-red-50 rounded transition-colors"
                                  title="Delete Project"
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
                    {filteredProjects.length > 0 ? (
                      <>
                        Showing {projectStartIndex + 1} - {Math.min(projectEndIndex, filteredProjects.length)} of {filteredProjects.length} project{filteredProjects.length !== 1 ? 's' : ''}
                      </>
                    ) : (
                      'No projects'
                    )}
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Page</span>
                    <select 
                      value={currentProjectPage}
                      onChange={(e) => setCurrentProjectPage(Number(e.target.value))}
                      className="px-3 py-1 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      {Array.from({ length: totalProjectPages || 1 }, (_, i) => i + 1).map(page => (
                        <option key={page} value={page}>{page}</option>
                      ))}
                    </select>
                    <span className="text-sm text-gray-600">of {totalProjectPages || 1}</span>
                    
                    <button 
                      onClick={() => setCurrentProjectPage(prev => Math.max(1, prev - 1))}
                      disabled={currentProjectPage === 1}
                      className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                      title="Previous page"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                    </button>
                    
                    <button 
                      onClick={() => setCurrentProjectPage(prev => Math.min(totalProjectPages || 1, prev + 1))}
                      disabled={currentProjectPage === (totalProjectPages || 1)}
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
          </div>
        )}
      </div>

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

export default AccountingDashboard;
