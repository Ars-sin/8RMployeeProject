import { X, Copy, Download, Printer, Scan, Settings } from 'lucide-react';

const ViewEmployeeDetails = ({ employee, onClose }) => {
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            Employee Details
          </h2>
          <div className="flex items-center gap-2">
            {/* Action Icons */}
            <button 
              onClick={() => alert('Download employee details')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Download"
            >
              <Download className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={() => window.print()}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Print"
            >
              <Printer className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={() => alert('Scan document')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Scan"
            >
              <Scan className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={() => alert('Settings')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Settings"
            >
              <Settings className="w-5 h-5 text-gray-600" />
            </button>
            <div className="w-px h-6 bg-gray-300 mx-1"></div>
            <button 
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Close"
            >
              <X className="w-5 h-5 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
          {/* Personal Information Section */}
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-4">Personal Information</h3>
            <div className="grid grid-cols-2 gap-4">
              
              {/* Full Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <div className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                    {employee.fullName || 'N/A'}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleCopy(employee.fullName)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
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
                  <div className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                    {employee.email || 'N/A'}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleCopy(employee.email)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
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
                  <div className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                    {employee.address || 'N/A'}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleCopy(employee.address)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                  {employee.dateOfBirth || 'N/A'}
                </div>
              </div>

              {/* Contact */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contact
                </label>
                <div className="relative">
                  <div className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                    {employee.contact || 'N/A'}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleCopy(employee.contact)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
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
                  <div className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                    {employee.emergencyContact || 'N/A'}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleCopy(employee.emergencyContact)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
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
                  <div className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                    {employee.emergencyContactName || 'N/A'}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleCopy(employee.emergencyContactName)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
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
                  <div className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                    {employee.salary || 'N/A'}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleCopy(employee.salary)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
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
                  <div className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                    {employee.bankNumber || 'N/A'}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleCopy(employee.bankNumber)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Sick Leave */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Sick Leave
                </label>
                <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                  {employee.sickLeave || 'N/A'}
                </div>
              </div>

              {/* SSS Number */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SSS Number
                </label>
                <div className="relative">
                  <div className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                    {employee.sssNumber || 'N/A'}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleCopy(employee.sssNumber)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Vacation Hours */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Vacation Hours
                </label>
                <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                  {employee.vacationHours || 'N/A'}
                </div>
              </div>

              {/* Philhealth SIN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Philhealth SIN
                </label>
                <div className="relative">
                  <div className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                    {employee.philhealthSin || 'N/A'}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleCopy(employee.philhealthSin)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
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
                  <div className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                    {employee.pagIbigMidNumber || 'N/A'}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleCopy(employee.pagIbigMidNumber)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
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
                  <div className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                    {employee.employmentId || 'N/A'}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleCopy(employee.employmentId)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
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
                  <div className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                    {employee.assignArea || 'N/A'}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleCopy(employee.assignArea)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
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
                  <div className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                    {employee.position || 'N/A'}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleCopy(employee.position)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
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
                  <div className="w-full px-3 py-2 pr-10 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                    {employee.status || 'N/A'}
                  </div>
                  <button 
                    type="button" 
                    onClick={() => handleCopy(employee.status)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
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
                <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                  {employee.contractStartDate || 'N/A'}
                </div>
              </div>

              {/* Contract End Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Contract End Date
                </label>
                <div className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-900">
                  {employee.contractEndDate || 'N/A'}
                </div>
              </div>

              {/* Contract File */}
              {employee.contractUrl && (
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contract Document
                  </label>
                  <a 
                    href={employee.contractUrl} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 hover:underline text-sm"
                  >
                    View Contract Document
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
          <button
            onClick={onClose}
            className="px-6 py-2.5 bg-gray-600 text-white rounded-lg font-semibold hover:bg-gray-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewEmployeeDetails;
