import React, { useState, useEffect, useCallback, useRef } from 'react';
import useUserProfile from '../../hooks/useUserProfile';
import useLogout from '../../hooks/useLogout';
import { FaEdit, FaCheck, FaTimes, FaSignOutAlt } from 'react-icons/fa';

const UserProfile = ({ userId, isOpen, onClose }) => {
  const {
    profile,
    loading,
    error,
    updateProfile,
    formatLastSeen,
    isCurrentUser
  } = useUserProfile(userId);
  
  const { logout, isLoading: isLoggingOut } = useLogout();
  
  const [editing, setEditing] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    bio: '',
    pic: ''
  });
  
  const modalContentRef = useRef(null);
  
  useEffect(() => {
    if (profile && !editing) {
      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        pic: profile.pic || ''
      });
    }
  }, [profile, editing]);
  
  useEffect(() => {
    if (!isOpen) {
      setEditing(false);
    }
  }, [isOpen]);
  
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalContentRef.current && !modalContentRef.current.contains(event.target)) {
        console.log("Clicked outside modal, closing...");
        onClose();
      }
    };

    if (isOpen) {
      const timeoutId = setTimeout(() => {
          document.addEventListener('mousedown', handleClickOutside);
      }, 0);
      
      return () => {
        clearTimeout(timeoutId);
        document.removeEventListener('mousedown', handleClickOutside);
      };
    }
  }, [isOpen, onClose]);
  
  const handleChange = useCallback((e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  }, []);
  
  const handleSubmit = useCallback(async () => {
    const success = await updateProfile(formData);
    if (success) {
      setEditing(false);
    }
  }, [formData, updateProfile]);
  
  const handleImageUpload = useCallback((e) => {
    if (!e.target.files || !e.target.files[0]) return;
    
    const file = e.target.files[0];
    const reader = new FileReader();
    
    reader.onloadend = () => {
      setFormData(prev => ({ ...prev, pic: reader.result }));
    };
    
    reader.readAsDataURL(file);
  }, []);
  
  const handleCancel = useCallback(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        bio: profile.bio || '',
        pic: profile.pic || ''
      });
    }
    setEditing(false);
  }, [profile]);
  
  const handleLogout = useCallback(async () => {
    await logout();
    onClose(); // Close the modal after logout
  }, [logout, onClose]);
  
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div 
        ref={modalContentRef} 
        className="bg-white dark:bg-slate-800 rounded-lg shadow-lg w-full max-w-md p-6 max-h-[90vh] overflow-y-auto"
      >
        {loading ? (
          <div className="text-center py-8">
            <div className="w-10 h-10 border-4 border-gray-400 border-t-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-500 dark:text-gray-400">Loading profile...</p>
          </div>
        ) : error ? (
          <div className="text-center py-8 text-red-500">{error}</div>
        ) : profile ? (
          <>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">
                {editing ? 'Edit Profile' : 'User Profile'}
              </h2>
              <button 
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-white"
              >
                <FaTimes />
              </button>
            </div>
            
            <div className="flex flex-col items-center mb-6">
              {editing ? (
                <div className="relative">
                  <img 
                    src={formData.pic || "https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                  />
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                  <div className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full p-1">
                    <FaEdit size={14} />
                  </div>
                </div>
              ) : (
                <img 
                  src={profile.pic || "https://as1.ftcdn.net/v2/jpg/03/46/83/96/1000_F_346839683_6nAPzbhpSkIpb8pmAwufkC7c5eD7wYws.jpg"} 
                  alt="Profile" 
                  className="w-24 h-24 rounded-full object-cover border-4 border-blue-500"
                />
              )}
              
              <div className="mt-4 text-center">
                {editing ? (
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="text-xl font-semibold bg-gray-100 dark:bg-slate-700 rounded px-2 py-1 text-center"
                  />
                ) : (
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white">{profile.name}</h3>
                )}
                
                <div className="mt-1 flex items-center justify-center">
                  <span className={`h-2 w-2 rounded-full mr-2 ${profile.isOnline ? 'bg-green-500' : 'bg-gray-400'}`}></span>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {profile.isOnline ? 'Online' : `Last seen ${formatLastSeen(profile.lastSeen)}`}
                  </span>
                </div>
                
                <p className="text-gray-600 dark:text-gray-300 mt-1">{profile.email}</p>
              </div>
            </div>
            
            <div className="mb-6">
              <h4 className="text-gray-800 dark:text-white font-medium mb-2">Bio</h4>
              {editing ? (
                <textarea
                  name="bio"
                  value={formData.bio}
                  onChange={handleChange}
                  className="w-full bg-gray-100 dark:bg-slate-700 rounded p-2 min-h-[100px]"
                  placeholder="Write something about yourself..."
                ></textarea>
              ) : (
                <p className="text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-slate-700 p-3 rounded">
                  {profile.bio || "No bio available."}
                </p>
              )}
            </div>
            
            {isCurrentUser && (
              <div className="flex justify-between">
                <div className="flex gap-2">
                  {editing ? (
                    <>
                      <button
                        onClick={handleCancel}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmit}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
                      >
                        <FaCheck className="mr-2" /> Save
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setEditing(true)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded flex items-center"
                    >
                      <FaEdit className="mr-2" /> Edit Profile
                    </button>
                  )}
                </div>
                {!editing && (
                  showLogoutConfirm ? (
                    <div className="flex gap-2">
                      <button
                        onClick={() => setShowLogoutConfirm(false)}
                        className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-3 py-2 rounded text-sm"
                        disabled={isLoggingOut}
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleLogout}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-2 rounded text-sm flex items-center"
                        disabled={isLoggingOut}
                      >
                        {isLoggingOut ? (
                          <span>Logging out...</span>
                        ) : (
                          <>Confirm Logout</>
                        )}
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => setShowLogoutConfirm(true)}
                      className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded flex items-center"
                    >
                      <FaSignOutAlt className="mr-2" /> Logout
                    </button>
                  )
                )}
              </div>
            )}
          </>
        ) : (
          <div className="text-center py-8 text-gray-500">User not found or profile unavailable.</div>
        )}
      </div>
    </div>
  );
};

export default React.memo(UserProfile); 