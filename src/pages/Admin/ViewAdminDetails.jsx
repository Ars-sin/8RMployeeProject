import React, { useState } from 'react';
import { X, Download, Printer, Scan, Settings, Copy, Check } from 'lucide-react';

const ViewAdminDetails = ({ admin, onClose }) => {
  const [copiedField, setCopiedField] = useState(null);

  const handleCopy = (text, fieldName) => {
    navigator.clipboard.writeText(text || '');
    setCopiedField(fieldName);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const InfoField = ({ label, value, fieldName }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label}
      </label>
      <div className="relative">
        <input
          type="text"
          value={value || 'N/A'}
          readOnly
          className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 cursor-default"
        />
        <button
          onClick={() => handleCopy(value, fieldName)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1.5 hover:bg-gray-200 rounded transition-colors"
          title="Copy to clipboard"
        >
          {copiedField === fieldName ? (
            <Check className="w-4 h-4 text-green-600" />
          ) : (
            <Copy className="w-4 h-4 text-gray-500" />
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">Admin Details</h2>
          <div className="flex items-center gap-2">
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5 text-gray-600" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Print"
            >
              <Printer className="w-5 h-5 text-gray-600" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Scan"
            >
              <Scan className="w-5 h-5 text-gray-600" />
            </button>
            <button
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors ml-2"
            >
              <X className="w-5 h-5 text-gray-600" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Personal Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField label="Full Name" value={admin.fullName} fieldName="fullName" />
                <InfoField label="ID Number" value={admin.idNumber} fieldName="idNumber" />
                <InfoField label="Email" value={admin.email} fieldName="email" />
                <InfoField label="Contact Number" value={admin.contact} fieldName="contact" />
                <InfoField label="Position" value={admin.position} fieldName="position" />
                <InfoField label="Department" value={admin.department} fieldName="department" />
              </div>
            </div>

            {/* Address Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Address Information</h3>
              <div className="grid grid-cols-1 gap-4">
                <InfoField label="Address" value={admin.address} fieldName="address" />
              </div>
            </div>

            {/* Government IDs */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Government IDs</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField label="SSS Number" value={admin.sss} fieldName="sss" />
                <InfoField label="PhilHealth Number" value={admin.philhealth} fieldName="philhealth" />
                <InfoField label="Pag-IBIG Number" value={admin.pagibig} fieldName="pagibig" />
                <InfoField label="TIN" value={admin.tin} fieldName="tin" />
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField label="Emergency Contact Name" value={admin.emergencyContactName} fieldName="emergencyContactName" />
                <InfoField label="Emergency Contact Number" value={admin.emergencyContactNumber} fieldName="emergencyContactNumber" />
                <InfoField label="Relationship" value={admin.emergencyContactRelationship} fieldName="emergencyContactRelationship" />
              </div>
            </div>

            {/* Account Information */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Account Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <InfoField label="Date Created" value={admin.dateCreated ? new Date(admin.dateCreated).toLocaleDateString() : 'N/A'} fieldName="dateCreated" />
                <InfoField label="Status" value={admin.isArchived ? 'Archived' : 'Active'} fieldName="status" />
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewAdminDetails;
