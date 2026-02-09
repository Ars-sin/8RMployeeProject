import React, { useState } from 'react';
import { X, Copy, Calendar, Upload, Settings } from 'lucide-react';
import ArrangementModal from './ArrangementModal';

const EmployeeDetailsView = ({ employee, onClose, onSave }) => {
  const [showArrangementModal, setShowArrangementModal] = useState(false);
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: employee?.name || 'Seid Ambrad',
    email: employee?.contact || 'Iwansei24@gmail.com',
    address: '123 Mango Tree Avenue, Sunset Hills Subdivision...',
    dateOfBirth: '20/04/2012',
    contact: '09123456789',
    emergencyContact: '09123456789',
    emergencyContactName: 'Laurence Seda',
    
    // Payment Information
    salary: '10000',
    bankNumber: '0876 5432 1045 9154',
    sickLeave: '10',
    sssNumber: '34-9876543-2',
    vacationHours: '50',
    philhealthPin: '12-345678901-2',
    pagIbigMidNumber: '5678-5432-1098',
    
    // Employment Information
    employmentId: 'EMP-2026-04719',
    assignArea: 'Santa Lucia City – North District',
    position: 'Mechanical Engineer',
    status: 'Regular',
    
    // Contract Information
    contractStartDate: '2025/10/08',
    contractEndDate: '2025/10/08',
    softCopy: null
  });

  const [sectionOrder, setSectionOrder] = useState([
    { id: 1, name: 'Personal Informations' },
    { id: 2, name: 'Payment Informations' },
    { id: 3, name: 'Employment Informations' },
    { id: 4, name: 'Contract Informations' }
  ]);

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

  const handleSave = () => {
    onSave && onSave(formData);
    alert('Changes saved successfully!');
  };

  const handleArrangementSave = (newOrder) => {
    setSectionOrder(newOrder);
  };

  const renderSection = (sectionId) => {
    switch(sectionId) {
      case 1: // Personal Information
        return (
          <div key="personal">
            <h3 className="text-sm font-semibold text-gray-500 mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <div className="relative">
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <div className="relative">
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
                <div className="relative">
                  <input
                    type="text"
                    name="dateOfBirth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contact</label>
                <div className="relative">
                  <input
                    type="tel"
                    name="contact"
                    value={formData.contact}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact</label>
                <div className="relative">
                  <input
                    type="tel"
                    name="emergencyContact"
                    value={formData.emergencyContact}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Contact Name</label>
                <div className="relative">
                  <input
                    type="text"
                    name="emergencyContactName"
                    value={formData.emergencyContactName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 2: // Payment Information
        return (
          <div key="payment">
            <h3 className="text-sm font-semibold text-gray-500 mb-4">Payment Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salary</label>
                <div className="relative">
                  <input
                    type="text"
                    name="salary"
                    value={formData.salary}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bank Number</label>
                <div className="relative">
                  <input
                    type="text"
                    name="bankNumber"
                    value={formData.bankNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sick Leave</label>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SSS Number</label>
                <div className="relative">
                  <input
                    type="text"
                    name="sssNumber"
                    value={formData.sssNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vacation Hours</label>
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Philhealth PIN</label>
                <div className="relative">
                  <input
                    type="text"
                    name="philhealthPin"
                    value={formData.philhealthPin}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Pag-IBIG MID Number</label>
                <div className="relative">
                  <input
                    type="text"
                    name="pagIbigMidNumber"
                    value={formData.pagIbigMidNumber}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 3: // Employment Information
        return (
          <div key="employment">
            <h3 className="text-sm font-semibold text-gray-500 mb-4">Employment Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employment ID</label>
                <div className="relative">
                  <input
                    type="text"
                    name="employmentId"
                    value={formData.employmentId}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Area</label>
                <div className="relative">
                  <input
                    type="text"
                    name="assignArea"
                    value={formData.assignArea}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <div className="relative">
                  <input
                    type="text"
                    name="position"
                    value={formData.position}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <div className="relative">
                  <input
                    type="text"
                    name="status"
                    value={formData.status}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <button type="button" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        );

      case 4: // Contract Information
        return (
          <div key="contract">
            <h3 className="text-sm font-semibold text-gray-500 mb-4">Contract Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contract Start Date</label>
                <div className="relative">
                  <input
                    type="text"
                    name="contractStartDate"
                    value={formData.contractStartDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Soft Copy</label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-blue-500 transition-colors cursor-pointer">
                  <input
                    type="file"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="file-upload-detail"
                    accept=".pdf,.doc,.docx"
                  />
                  <label htmlFor="file-upload-detail" className="cursor-pointer">
                    <Upload className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                    <p className="text-xs text-gray-600">
                      {formData.softCopy ? formData.softCopy.name : 'Upload'}
                    </p>
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Contract End Date</label>
                <div className="relative">
                  <input
                    type="text"
                    name="contractEndDate"
                    value={formData.contractEndDate}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <Calendar className="absolute right-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      {/* Arrangement Modal */}
      {showArrangementModal && (
        <ArrangementModal
          onClose={() => setShowArrangementModal(false)}
          onSave={handleArrangementSave}
          initialOrder={sectionOrder}
        />
      )}

      {/* Employee Details */}
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Employee Details</h2>
              <p className="text-sm text-gray-500 mt-0.5">Employee</p>
            </div>
            <div className="flex items-center gap-2">
              <button className="p-2 hover:bg-gray-200 rounded-lg">
                <Copy className="w-4 h-4 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-lg">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
                </svg>
              </button>
              <button className="p-2 hover:bg-gray-200 rounded-lg">
                <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
              </button>
              <button 
                onClick={() => setShowArrangementModal(true)}
                className="p-2 hover:bg-gray-200 rounded-lg"
              >
                <Settings className="w-4 h-4 text-gray-600" />
              </button>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-gray-200 rounded-lg"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="px-6 py-3 border-b border-gray-200">
            <input
              type="text"
              placeholder="See Information"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            />
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {sectionOrder.map(section => renderSection(section.id))}
          </div>

          {/* Footer */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
            <button
              onClick={handleSave}
              className="px-6 py-2.5 bg-gray-800 text-white rounded-lg font-semibold hover:bg-gray-900 transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default EmployeeDetailsView;
