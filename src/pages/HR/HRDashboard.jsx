import React, { useState, useEffect } from 'react';
import { Users, Archive, ClipboardList, LogOut, Plus, Edit2, Trash2, Search, Briefcase } from 'lucide-react';
import ArchivedPage from './ArchivedPage';
import ChangeLogsPage from './ChangeLogsPage';
import AddEmployeeForm from './AddEmployeeForm';
import { getEmployees, addEmployee, updateEmployee, archiveEmployee } from '../../services/employeeService';
import { getProjects, addProject, updateProject, deleteProject } from '../../services/projectService';
import AddProjectModal from './AddProjectModal.jsx';

const HRDashboard = ({ user, onLogout }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [currentView, setCurrentView] = useState('projects'); // 'projects', 'employees', 'archived', 'changelogs'
  const [employees, setEmployees] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddEmployeeForm, setShowAddEmployeeForm] = useState(false);
  const [showAddProjectModal, setShowAddProjectModal] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState(null);
  const [editingProject, setEditingProject] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

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
      await addEmployee(formData);
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
      await updateEmployee(editingEmployee.id, formData);
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

  const filteredEmployees = employees.filter(emp => 
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

          {/* Navigation */}
          <div>
            <p className="text-xs font-semibold text-gray-400 uppercase mb-3">HR Management</p>
            <nav className="space-y-1">
              <button 
                onClick={() => setCurrentView('projects')}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg font-medium ${
                  currentView === 'projects' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Briefcase className="w-5 h-5" />
                Projects
              </button>

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
          <ArchivedPage />
        ) : currentView === 'changelogs' ? (
          <ChangeLogsPage />
        ) : currentView === 'projects' ? (
          // Projects List View
          <div className="flex-1 flex flex-col bg-white">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Project Management</h2>
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
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Projects Table */}
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
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input type="checkbox" className="rounded" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Project Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Location
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Start Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredProjects.map((project) => (
                      <tr key={project.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" className="rounded" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {project.projectName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.location}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {project.startDate}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(project.status)}`}>
                            {project.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditProjectClick(project)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <Edit2 className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={() => handleDeleteProject(project.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        ) : (
          // Employees List View
          <div className="flex-1 flex flex-col bg-white">
            {/* Header */}
            <div className="px-6 py-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Company Employees</h2>
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
              
              {/* Search Bar */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search employees..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Employee Table */}
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
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        <input type="checkbox" className="rounded" />
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Employee ID
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Name
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Email
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Position
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredEmployees.map((employee) => (
                      <tr key={employee.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input type="checkbox" className="rounded" />
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {employee.employmentId}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {employee.fullName}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {employee.position}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs font-semibold rounded-full ${
                            employee.status === 'Regular' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {employee.status}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => handleEditEmployeeClick(employee)}
                            className="text-blue-600 hover:text-blue-900 mr-4"
                          >
                            <Edit2 className="w-4 h-4 inline" />
                          </button>
                          <button
                            onClick={() => handleDeleteEmployee(employee.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <Trash2 className="w-4 h-4 inline" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}
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
