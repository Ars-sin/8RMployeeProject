import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { checkDuplicateAdmin } from '../../services/adminService';

const AddAdminModal = ({ admin, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    idNumber: '',
    email: '',
    position: ''
  });

  const [errors, setErrors] = useState({});

  // Populate form when editing
  useEffect(() => {
    if (admin) {
      setFormData({
        fullName: admin.fullName || '',
        idNumber: admin.idNumber || '',
        email: admin.email || '',
        position: admin.position || ''
      });
    }
  }, [admin]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = async () => {
    const newErrors = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!formData.idNumber.trim()) {
      newErrors.idNumber = 'ID number is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }

    // Check for duplicates only if basic validation passes
    if (!newErrors.email && !newErrors.position) {
      try {
        const duplicates = await checkDuplicateAdmin(
          formData.email, 
          formData.position,
          admin?.id // Exclude current admin when editing
        );
        
        if (duplicates.email) {
          newErrors.email = `This email is already used by ${duplicates.emailAdmin}`;
        }
        
        if (duplicates.position) {
          newErrors.position = `This position is already assigned to ${duplicates.positionAdmin}`;
        }
      } catch (error) {
        console.error('Error checking duplicates:', error);
        newErrors.general = 'Error validating admin data. Please try again.';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const isValid = await validateForm();
    if (isValid) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-md">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-gray-900">
            {admin ? 'Edit Admin' : 'Add Admin'}
          </h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Form Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          
          {/* General Error Message */}
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}
          
          {/* Full Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              placeholder="Ex. Horry Belia"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.fullName ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.fullName && (
              <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
            )}
          </div>

          {/* ID Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ID Number
            </label>
            <input
              type="text"
              name="idNumber"
              value={formData.idNumber}
              onChange={handleInputChange}
              placeholder="Ex. 123132412414"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.idNumber ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.idNumber && (
              <p className="mt-1 text-sm text-red-500">{errors.idNumber}</p>
            )}
          </div>

          {/* Gmail */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Gmail
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              placeholder="Ex. demonyo123@gmail.com"
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-500' : 'border-gray-300'
              }`}
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-500">{errors.email}</p>
            )}
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Position
            </label>
            <select
              name="position"
              value={formData.position}
              onChange={handleInputChange}
              className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.position ? 'border-red-500' : 'border-gray-300'
              }`}
            >
              <option value="">Ex. Assistant</option>
              <option value="HR Manager">HR Manager</option>
              <option value="HR Assistant">HR Assistant</option>
              <option value="Accounting Manager">Accounting Manager</option>
              <option value="Accounting Assistant">Accounting Assistant</option>
              <option value="Admin">Admin</option>
              <option value="Assistant">Assistant</option>
            </select>
            {errors.position && (
              <p className="mt-1 text-sm text-red-500">{errors.position}</p>
            )}
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              {admin ? 'Save Changes' : 'Add Admin'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAdminModal;
