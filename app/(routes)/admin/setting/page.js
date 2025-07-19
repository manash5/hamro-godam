"use client";
import React, { useState, useEffect } from 'react';
import {
  User, Mail, Lock,
  Eye, EyeOff,
  CheckCircle, XCircle
} from 'lucide-react';

const SettingsPage = () => {
  const [adminData, setAdminData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [apiError, setApiError] = useState('');

  const passwordStrength = {
    minLength: adminData.newPassword.length >= 8,
    hasNumber: /\d/.test(adminData.newPassword),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(adminData.newPassword),
    hasUpperCase: /[A-Z]/.test(adminData.newPassword),
  };
  const isPasswordStrong = Object.values(passwordStrength).every(Boolean);

  // Fetch user info
  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      try {
        const res = await fetch('/api/user');
        const data = await res.json();
        if (res.ok && data.data) {
          setAdminData(prev => ({
            ...prev,
            firstName: data.data.firstName || '',
            lastName: data.data.lastName || '',
            email: data.data.email || '',
          }));
          setApiError('');
        } else {
          setApiError(data.error || 'Failed to fetch user data');
        }
      } catch (err) {
        setApiError('Error fetching user data');
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setAdminData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const validateForm = () => {
    const newErrors = {};
    const { firstName, lastName, email, currentPassword, newPassword, confirmPassword } = adminData;

    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      newErrors.email = 'Invalid email format';
    }

    if (isEditing) {
      if (!currentPassword && newPassword) {
        newErrors.currentPassword = 'Current password is required';
      }

      if (newPassword && !isPasswordStrong) {
        newErrors.newPassword = 'Password does not meet strength requirements';
      }

      if (newPassword && newPassword !== confirmPassword) {
        newErrors.confirmPassword = 'Passwords do not match';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setApiError('');
    try {
      const payload = {
        firstName: adminData.firstName,
        lastName: adminData.lastName,
        email: adminData.email,
      };

      if (isEditing && adminData.newPassword) {
        payload.currentPassword = adminData.currentPassword;
        payload.newPassword = adminData.newPassword;
      }

      const res = await fetch('/api/user', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();

      if (res.ok) {
        setSuccessMessage('Profile updated successfully');
        setIsEditing(false);
        setAdminData(prev => ({
          ...prev,
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        }));
        setTimeout(() => setSuccessMessage(''), 3000);
      } else {
        setApiError(result.error || 'Failed to update profile');
      }
    } catch (err) {
      setApiError('Error updating profile');
    }
    setLoading(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setSuccessMessage('');
    setApiError('');
    setErrors({});
    setAdminData(prev => ({
      ...prev,
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    }));
  };

  const renderInput = ({
    name,
    type = 'text',
    icon: Icon,
    label,
    disabled = false,
    value,
    error,
    showToggle = false,
    showValue,
    toggleValue
  }) => (
    <div className="sm:col-span-6">
      <label htmlFor={name} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="mt-1 relative rounded-md shadow-sm">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Icon className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type={showToggle ? (showValue ? "text" : "password") : type}
          name={name}
          id={name}
          value={value}
          onChange={handleChange}
          disabled={disabled}
          className={`block w-full pl-10 pr-10 py-2 border ${error ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm ${disabled ? 'bg-gray-100' : 'bg-white'}`}
        />
        {showToggle && (
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button type="button" onClick={toggleValue} className="text-gray-400 hover:text-gray-500 focus:outline-none" disabled={disabled}>
              {showValue ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
            </button>
          </div>
        )}
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white shadow rounded-lg overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-200 bg-gray-50">
            <h2 className="text-2xl font-semibold text-gray-900">Admin Settings</h2>
            <p className="mt-1 text-sm text-gray-500">Manage your account information and password</p>
          </div>

          {loading && (
            <div className="p-6 text-center text-gray-500">Loading...</div>
          )}

          {apiError && (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mx-6 mt-4">
              <div className="flex items-center">
                <XCircle className="h-5 w-5 text-red-400" />
                <p className="ml-3 text-sm text-red-700">{apiError}</p>
              </div>
            </div>
          )}

          {successMessage && (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mx-6 mt-4">
              <div className="flex items-center">
                <CheckCircle className="h-5 w-5 text-green-400" />
                <p className="ml-3 text-sm text-green-700">{successMessage}</p>
              </div>
            </div>
          )}

          {!loading && (
            <form onSubmit={handleSubmit} className="divide-y divide-gray-200">
              <div className="px-6 py-5 space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Personal Info</h3>
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6">
                  {renderInput({
                    name: "firstName",
                    label: "First Name",
                    icon: User,
                    value: adminData.firstName,
                    error: errors.firstName,
                    disabled: !isEditing
                  })}
                  {renderInput({
                    name: "lastName",
                    label: "Last Name",
                    icon: User,
                    value: adminData.lastName,
                    error: errors.lastName,
                    disabled: !isEditing
                  })}
                  {renderInput({
                    name: "email",
                    type: "email",
                    label: "Email",
                    icon: Mail,
                    value: adminData.email,
                    error: errors.email,
                    disabled: !isEditing
                  })}
                </div>
              </div>

              <div className="px-6 py-5 space-y-6">
                <h3 className="text-lg font-medium text-gray-900">Change Password</h3>
                <div className="grid grid-cols-1 gap-y-6 sm:grid-cols-6">
                  {renderInput({
                    name: "currentPassword",
                    label: "Current Password",
                    icon: Lock,
                    value: adminData.currentPassword,
                    error: errors.currentPassword,
                    showToggle: true,
                    showValue: showCurrentPassword,
                    toggleValue: () => setShowCurrentPassword(!showCurrentPassword),
                    disabled: !isEditing
                  })}
                  {renderInput({
                    name: "newPassword",
                    label: "New Password",
                    icon: Lock,
                    value: adminData.newPassword,
                    error: errors.newPassword,
                    showToggle: true,
                    showValue: showNewPassword,
                    toggleValue: () => setShowNewPassword(!showNewPassword),
                    disabled: !isEditing
                  })}
                  {adminData.newPassword && (
                    <div className="sm:col-span-6 mt-2">
                      <p className="text-sm font-medium text-gray-700">Password Requirements:</p>
                      <ul className="mt-1 text-sm text-gray-600 space-y-1">
                        {Object.entries(passwordStrength).map(([key, passed]) => (
                          <li key={key} className={`flex items-center ${passed ? 'text-green-600' : 'text-gray-500'}`}>
                            {passed ? <CheckCircle className="h-4 w-4 mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                            {{
                              minLength: "At least 8 characters",
                              hasNumber: "Includes a number",
                              hasSpecialChar: "Includes a special character",
                              hasUpperCase: "Includes an uppercase letter"
                            }[key]}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  {renderInput({
                    name: "confirmPassword",
                    label: "Confirm Password",
                    icon: Lock,
                    value: adminData.confirmPassword,
                    error: errors.confirmPassword,
                    showToggle: true,
                    showValue: showConfirmPassword,
                    toggleValue: () => setShowConfirmPassword(!showConfirmPassword),
                    disabled: !isEditing
                  })}
                </div>
              </div>

              <div className="px-6 py-4 bg-gray-50 text-right">
                {!isEditing ? (
                  <button
                    type="button"
                    onClick={() => setIsEditing(true)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
                  >
                    Edit Profile
                  </button>
                ) : (
                  <div className="space-x-3">
                    <button
                      type="button"
                      onClick={handleCancel}
                      className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-md shadow hover:bg-gray-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md shadow hover:bg-blue-700"
                    >
                      Save Changes
                    </button>
                  </div>
                )}
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
