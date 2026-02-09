import React, { useState } from 'react';
import { X, Upload, Calendar, Copy } from 'lucide-react';

const AddEmployeeForm = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: '',
    email: '',
    address: '',
    dateOfBirth: '',
    contact: '',
    emergencyContact: '',
    emergencyContactName: '',
    
    // Payment Information
    salary: '',
    bankNumber: '',
    sickLeave: '10',
    sssNumber: '',
    vacationHours: '50',
    philhealthSin: '',
    pagIbigMidNumber: '',
    
    // Employment Information
    employmentId: '',
    assignArea: '',
    position: '',
    status: '',
    
    // Contract Information
    contractStartDate: '',
    contractEndDate: '',
    softCopy: null
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        softCopy: file
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave && onSave(formData);
    alert('Employee added successfully!');
    onClose && onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">Employee</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            
            {/* Personal Information Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-4">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name sssss
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      placeholder="Seid Ambrad"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Iwansei24@gmail.com"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="123 Mango Tree Avenue, Sunset Hills Subdivision..."
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Date of Birth */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date of Birth
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="contact"
                      value={formData.contact}
                      onChange={handleInputChange}
                      placeholder="09123456789"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Emergency Contact */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact
                  </label>
                  <div className="relative">
                    <input
                      type="tel"
                      name="emergencyContact"
                      value={formData.emergencyContact}
                      onChange={handleInputChange}
                      placeholder="09123456789"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Emergency Contact Name */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Emergency Contact Name
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="emergencyContactName"
                      value={formData.emergencyContactName}
                      onChange={handleInputChange}
                      placeholder="Laurence Monaris"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Information Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-4">Payment Information</h3>
              <div className="grid grid-cols-2 gap-4">
                
                {/* Salary */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Salary
                  </label>
                  <div className="relative">
                    <input
                      type="number"
                      name="salary"
                      value={formData.salary}
                      onChange={handleInputChange}
                      placeholder="10000"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Bank Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Bank Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="bankNumber"
                      value={formData.bankNumber}
                      onChange={handleInputChange}
                      placeholder="0876 5432 1045 9154"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Sick Leave */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Sick Leave
                  </label>
                  <select
                    name="sickLeave"
                    value={formData.sickLeave}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="15">15</option>
                    <option value="20">20</option>
                  </select>
                </div>

                {/* SSS Number */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    SSS Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="sssNumber"
                      value={formData.sssNumber}
                      onChange={handleInputChange}
                      placeholder="34-9876543-2"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Vacation Hours */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Vacation Hours
                  </label>
                  <select
                    name="vacationHours"
                    value={formData.vacationHours}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="25">25</option>
                    <option value="50">50</option>
                    <option value="75">75</option>
                    <option value="100">100</option>
                  </select>
                </div>

                {/* Philhealth SIN */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Philhealth SIN
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="philhealthSin"
                      value={formData.philhealthSin}
                      onChange={handleInputChange}
                      placeholder="12-345678901-2"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Pag-IBIG MID Number */}
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Pag-IBIG MID Number
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="pagIbigMidNumber"
                      value={formData.pagIbigMidNumber}
                      onChange={handleInputChange}
                      placeholder="5678-5432-0098"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Employment Information Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-4">Employment Information</h3>
              <div className="grid grid-cols-2 gap-4">
                
                {/* Employment ID */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Employment ID
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="employmentId"
                      value={formData.employmentId}
                      onChange={handleInputChange}
                      placeholder="EMP-2026-04719"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Assign Area */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Assign Area
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="assignArea"
                      value={formData.assignArea}
                      onChange={handleInputChange}
                      placeholder="Santa Lucia City – North District"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Position
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="position"
                      value={formData.position}
                      onChange={handleInputChange}
                      placeholder="Mechanical Engineer"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      placeholder="Regular"
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <Copy className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Contract Information Section */}
            <div>
              <h3 className="text-sm font-semibold text-gray-500 mb-4">Contract Information</h3>
              <div className="grid grid-cols-2 gap-4">
                
                {/* Contract Start Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contract Start Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="contractStartDate"
                      value={formData.contractStartDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>

                {/* Soft Copy Upload */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Soft Copy
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer">
                    <input
                      type="file"
                      onChange={handleFileUpload}
                      className="hidden"
                      id="file-upload"
                      accept=".pdf,.doc,.docx"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600">
                        {formData.softCopy ? formData.softCopy.name : 'Click to upload or drag and drop'}
                      </p>
                    </label>
                  </div>
                </div>

                {/* Contract End Date */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contract End Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      name="contractEndDate"
                      value={formData.contractEndDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                  </div>
                </div>
              </div>
            </div>

          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Add Employee
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddEmployeeForm;
