import { useState, useCallback, useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import axios from '../axiosInstance';
import { addUserProfile, updateUserProfile } from '../store/slice';

const useUserProfile = (userId) => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const requestInProgress = useRef(false);
  const dispatch = useDispatch();
  const { chatProfiles, user: currentUser } = useSelector((store) => store.chatStore);

  useEffect(() => {
    const performFetch = async (id) => {
      console.log(`useUserProfile: Attempting to fetch profile for userId: ${id}`);

      if (!id || typeof id !== 'string' || id.length < 5) {
        console.error(`useUserProfile: Invalid userId provided for fetch: ${id}`);
        setError("Invalid User ID provided.");
        setProfile(null);
        setLoading(false);
        return;
      }

      if (requestInProgress.current) return;

      setLoading(true);
      setError(null);
      requestInProgress.current = true;

      try {
        const apiUrl = `user/profile/${id}`; 
        console.log(`useUserProfile: Fetching from URL (relative to base): ${apiUrl}`);
        
        const response = await axios.get(apiUrl); 
        if (response.status === 200) {
          const fetchedProfile = response.data;
          console.log(`useUserProfile: Successfully fetched profile for userId: ${id}`, fetchedProfile);
          dispatch(addUserProfile({ userId: id, profile: fetchedProfile }));
          setProfile(fetchedProfile);
        } else {
           console.error(`useUserProfile: Failed API call for userId: ${id}. Status: ${response.status}`);
           setError(`Failed to fetch profile (Status: ${response.status})`);
           setProfile(null);
        }
      } catch (err) {
        console.error(`useUserProfile: Error fetching profile for userId: ${id}`, err);
        if (err.response) {
            console.error("Backend Error Response:", err.response.data);
            setError(err.response.data?.message || `Server error (${err.response.status})`);
        } else if (err.request) {
            console.error("No response received:", err.request);
            setError('Network error or no response from server.');
        } else {
            console.error("Error setting up request:", err.message);
            setError('Error setting up profile request.');
        }
        setProfile(null);
      } finally {
        setLoading(false);
        requestInProgress.current = false;
      }
    };

    console.log(`useUserProfile Effect: Received userId: ${userId}`);

    if (!userId) {
      console.log("useUserProfile Effect: No userId, using current user.");
      setProfile(currentUser); 
      setLoading(false);
      setError(null);
    } else {
      const cachedProfile = chatProfiles[userId];
      if (cachedProfile) {
        console.log(`useUserProfile Effect: Using cached profile for userId: ${userId}`);
        setProfile(cachedProfile);
        setLoading(false);
        setError(null);
      } else {
        console.log(`useUserProfile Effect: No cache hit for userId: ${userId}, calling performFetch.`);
        performFetch(userId);
      }
    }

    return () => {
    };

  }, [userId, chatProfiles, dispatch, currentUser]);

  const updateProfile = useCallback(async (profileData) => {
    if (loading) return null;
    
    setLoading(true);
    setError(null);

    try {
      const updateUrl = 'user/profile';
      console.log(`useUserProfile: Updating profile at URL (relative to base): ${updateUrl}`);
      const response = await axios.put(updateUrl, profileData);
      if (response.status === 200) {
        const updatedData = response.data;
        dispatch(updateUserProfile(updatedData));
        setProfile(updatedData);
        
        return updatedData;
      } else {
           console.warn(`useUserProfile update: Received status ${response.status}`);
           setError(`Failed to update profile (Status: ${response.status})`);
           return null;
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      if (err.response) {
        console.error("Backend Error Response (Update):", err.response.data);
        setError(err.response.data?.message || `Server error (${err.response.status}) during update`);
      } else if (err.request) {
        console.error("No response received (Update):", err.request);
        setError('Network error or no response from server during update.');
      } else {
        console.error("Error setting up request (Update):", err.message);
        setError('Error setting up profile update request.');
      }
      return null;
    } finally {
      setLoading(false);
    }
  }, [dispatch, loading]);

  const formatLastSeen = useCallback((date) => {
    if (!date) return 'Never';
    const now = new Date();
    const lastSeen = new Date(date);
    const diffInSeconds = Math.floor((now - lastSeen) / 1000);
    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} ${minutes === 1 ? 'minute' : 'minutes'} ago`;
    } 
    if (diffInSeconds < 86400) { // 24 hours
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } 
    return lastSeen.toLocaleDateString();
  }, []);

  return {
    profile,
    loading,
    error,
    updateProfile,
    formatLastSeen,
    isCurrentUser: !!userId && userId === currentUser?._id,
  };
};

export default useUserProfile; 