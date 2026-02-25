import React, { useState, useEffect } from 'react';
import { Users, Archive, ClipboardList, LogOut, Plus, Trash2, Search, Briefcase } from 'lucide-react';
import ArchivedPage from './ArchivedPage';
import ChangeLogsPage from './ChangeLogsPage';
import AddEmployeeForm from './AddEmployeeForm';
import { getEmployees, addEmployee, updateEmployee, archiveEmployee } from '../../services/employeeService';
import { getProjects, addProject, updateProject, deleteProject } from '../../services/projectService';
import AddProjectModal from './AddProjectModal.jsx';
import editIcon from '../../Components/ui/edit.png';

const HRDashboard = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('projects'); // 'projects', 'employees', 'archived', 'changelogs'
  const [selectedProject, setSelectedProject] = useState(null); // Currently selected project
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentProjectPage, setCurrentProjectPage] = useState(1);
  const [currentEmployeePage, setCurrentEmployeePage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    loadEmployees();
    loadProjects();
  }, []);

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

  const loadProjects = async () => {
    try {
      const data = await getProjects();
      setProjects(data);
    } catch (error) {
      console.error('Error loading projects:', error);
    }
  };

  const handleAddEmployee = async (formData) => {
    try {
      // Add projectId if a project is selected
      const employeeData = selectedProject 
        ? { ...formData, projectId: selectedProject.id }
        : formData;
      
      await addEmployee(employeeData);
      await loadEmployees();
      setShowAddEmployeeForm(false);
      alert('Employee added successfully!');
    } catch (error) {
      console.error('Error adding employee:', error);
      alert('Failed to add employee');
    }
  };

  const handleEditEmployee = async (formData) => {
    try {
      // Add projectId if a project is selected and employee doesn't have one
      const employeeData = selectedProject 
        ? { ...formData, projectId: selectedProject.id }
        : formData;
      
      await updateEmployee(editingEmployee.id, employeeData);
      await loadEmployees();
      setEditingEmployee(null);
      setShowAddEmployeeForm(false);
      alert('Employee updated successfully!');
    } catch (error) {
      console.error('Error updating employee:', error);
      alert('Failed to update employee');
    }
  };

  const handleDeleteEmployee = async (employeeId) => {
    if (window.confirm('Are you sure you want to archive this employee?')) {
      try {
        await archiveEmployee(employeeId);
        await loadEmployees();
      } catch (error) {
        console.error('Error archiving employee:', error);
        alert('Failed to archive employee');
      }
    }
  };

  const handleEditEmployeeClick = (employee) => {
    setEditingEmployee(employee);
    setShowAddEmployeeForm(true);
  };

  const handleAddProject = async (formData) => {
    try {
      await addProject(formData);
      await loadProjects();
      setShowAddProjectModal(false);
      alert('Project added successfully!');
    } catch (error) {
      console.error('Error adding project:', error);
      alert('Failed to add project');
    }
  };

  const handleEditProject = async (formData) => {
    try {
      await updateProject(editingProject.id, formData);
      await loadProjects();
      setEditingProject(null);
      setShowAddProjectModal(false);
      alert('Project updated successfully!');
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project');
    }
  };

  const handleDeleteProject = async (projectId) => {
    if (window.confirm('Are you sure you want to delete this project?')) {
      try {
        await deleteProject(projectId);
        await loadProjects();
        alert('Project deleted successfully!');
      } catch (error) {
        console.error('Error deleting project:', error);
        alert('Failed to delete project');
      }
    }
  };

  const handleEditProjectClick = (project) => {
    setEditingProject(project);
    setShowAddProjectModal(true);
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

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className={`bg-white transition-all duration-300 relative ${sidebarOpen ? 'w-64' : 'w-0'} overflow-hidden flex flex-col`}>
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
          <div className="mb-6 p-3 bg-blue-50 rounded-lg">
            <p className="text-xs text-gray-500">Logged in as</p>
            <p className="text-sm font-semibold text-gray-900">{user?.fullName || 'HR User'}</p>
            <p className="text-xs text-gray-600">{user?.position || 'HR Department'}</p>
          </div>

          {/* Current Project Context */}
          {selectedProject && (
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-xs text-green-600 font-semibold mb-1">Current Project</p>
              <p className="text-sm font-semibold text-gray-900">{selectedProject.projectName}</p>
              <p className="text-xs text-gray-600">{selectedProject.location}</p>
            </div>
          )}

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-3 mt-20"></p>
            <nav className="space-y-1">
              <button 
                onClick={handleBackToProjects}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium ${
                  currentView === 'projects' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Briefcase className="w-5 h-5" />
                Projects
              </button>

              {selectedProject && (
                <button 
                  onClick={() => setCurrentView('employees')}
                  className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium ${
                    currentView === 'employees' 
                      ? 'bg-blue-50 text-blue-600' 
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <Users className="w-5 h-5" />
                  Employees
                </button>
              )}
              
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
            onClick={onLogout}
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
          <ArchivedPage projects={projects} />
        ) : currentView === 'changelogs' ? (
          <ChangeLogsPage selectedProject={null} />
        ) : currentView === 'projects' ? (
          // Projects List View
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-8 py-5 flex-shrink-0">
              <div>
                <h2 className="text-2xl font-semibold text-gray-900">Projects</h2>
                <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                  <span>HR Management</span>
                  <span>›</span>
                  <span className="text-blue-600">Projects</span>
                </div>
              </div>
            </header>

            {/* Content */}
            <main className="flex-1 flex flex-col overflow-hidden p-8">
              <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Toolbar */}
                <div className="p-6 border-b border-gray-200 flex-shrink-0">
                  <div className="flex items-center justify-between gap-4">
                    {/* Search */}
                    <div className="flex-1 max-w-md relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search projects..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => {
                        setEditingProject(null);
                        setShowAddProjectModal(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Add Project
                    </button>
                  </div>
                </div>

                {/* Scrollable Table Container */}
                <div className="flex-1 overflow-auto">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">Loading projects...</p>
                    </div>
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
                            LOCATION
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            START DATE
                          </th>
                          <th className="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            STATUS
                          </th>
                          <th className="pl-6 pr-8 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                            ACTIONS
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {paginatedProjects.map((project) => (
                          <tr key={project.id} className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
                            <td className="pl-8 pr-6 py-4">
                              <button
                                onClick={() => handleProjectClick(project)}
                                className="text-sm font-medium text-blue-600 hover:text-blue-800 hover:underline transition-colors"
                              >
                                {project.projectName}
                              </button>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-500">{project.location}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-500">{project.startDate}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                                {project.status}
                              </span>
                            </td>
                            <td className="pl-6 pr-8 py-4">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleEditProjectClick(project)}
                                  className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                                  title="Edit Project"
                                >
                                  <img src={editIcon} alt="Edit" className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteProject(project.id)}
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
        ) : currentView === 'employees' ? (
          // Employees List View (for selected project)
          <div className="flex-1 flex flex-col overflow-hidden bg-gray-50">
            {/* Header */}
            <header className="bg-white border-b border-gray-200 px-8 py-5 flex-shrink-0">
              <div>
                <div className="flex items-center gap-3">
                  <button
                    onClick={handleBackToProjects}
                    className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Back to Projects"
                  >
                    <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <div>
                    <h2 className="text-2xl font-semibold text-gray-900">
                      {selectedProject?.projectName || 'Project'} - Employees
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500 mt-0.5">
                      <span>HR Management</span>
                      <span>›</span>
                      <span>Projects</span>
                      <span>›</span>
                      <span className="text-blue-600">{selectedProject?.projectName || 'Project'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Content */}
            <main className="flex-1 flex flex-col overflow-hidden p-8">
              <div className="flex-1 flex flex-col bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Toolbar */}
                <div className="p-6 border-b border-gray-200 flex-shrink-0">
                  <div className="flex items-center justify-between gap-4">
                    {/* Search */}
                    <div className="flex-1 max-w-md relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                      <input
                        type="text"
                        placeholder="Search employees..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>

                    {/* Action Button */}
                    <button
                      onClick={() => {
                        setEditingEmployee(null);
                        setShowAddEmployeeForm(true);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="w-5 h-5" />
                      Add Employee
                    </button>
                  </div>
                </div>

                {/* Scrollable Table Container */}
                <div className="flex-1 overflow-auto">
                  {loading ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">Loading employees...</p>
                    </div>
                  ) : filteredEmployees.length === 0 ? (
                    <div className="flex items-center justify-center h-full">
                      <p className="text-gray-500">No employees found</p>
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
                            STATUS
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
                              <div className="text-sm font-medium text-gray-900">{employee.fullName}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-500">{employee.email}</div>
                            </td>
                            <td className="px-6 py-4">
                              <div className="text-sm text-gray-500">{employee.position}</div>
                            </td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                                employee.status === 'Regular' 
                                  ? 'bg-green-100 text-green-800' 
                                  : 'bg-yellow-100 text-yellow-800'
                              }`}>
                                {employee.status}
                              </span>
                            </td>
                            <td className="pl-6 pr-8 py-4">
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => handleEditEmployeeClick(employee)}
                                  className="p-1.5 hover:bg-blue-50 rounded transition-colors"
                                  title="Edit Employee"
                                >
                                  <img src={editIcon} alt="Edit" className="w-4 h-4" />
                                </button>
                                <button
                                  onClick={() => handleDeleteEmployee(employee.id)}
                                  className="p-1.5 hover:bg-red-50 rounded transition-colors"
                                  title="Archive Employee"
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
        ) : null}
      </div>

      {/* Add/Edit Employee Modal */}
      {showAddEmployeeForm && (
        <AddEmployeeForm
          employee={editingEmployee}
          onClose={() => {
            setShowAddEmployeeForm(false);
            setEditingEmployee(null);
          }}
          onSave={editingEmployee ? handleEditEmployee : handleAddEmployee}
        />
      )}

      {/* Add/Edit Project Modal */}
      {showAddProjectModal && (
        <AddProjectModal
          project={editingProject}
          onClose={() => {
            setShowAddProjectModal(false);
            setEditingProject(null);
          }}
          onSave={editingProject ? handleEditProject : handleAddProject}
        />
      )}
    </div>
  );
};

export default HRDashboard;
