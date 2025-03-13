import React, { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import cookies from "js-cookie";
import logo from "../../../Assets/jpgs/logo-navbar.jpg";

const ProfilePage = () => {
  const router = useRouter();
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("profile");
  const [editMode, setEditMode] = useState(false);
  const [updatedData, setUpdatedData] = useState({});
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  // New state for profile image
  const [newProfileImage, setNewProfileImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  // New states for password change
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: ""
  });
  const [passwordFeedback, setPasswordFeedback] = useState("");
  const [changingPassword, setChangingPassword] = useState(false);
  
  // New states for preferences
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    serviceReminders: true,
    displayMode: "light"
  });
  const [savingPreferences, setSavingPreferences] = useState(false);
  const [preferencesFeedback, setPreferencesFeedback] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        // Get cookie and parse it
        const userCookie = cookies.get("user");
        if (!userCookie) {
          router.push("/login");
          return;
        }

        const cookieData = JSON.parse(decodeURIComponent(userCookie));
        const email = cookieData.email;

        if (!email) {
          setError("Invalid session. Please login again.");
          setTimeout(() => router.push("/login"), 2000);
          return;
        }

        // Fetch user data from API
        const response = await fetch(`/api/user/user?email=${encodeURIComponent(email)}`);
        if (!response.ok) {
          throw new Error("Failed to fetch user data");
        }

        const data = await response.json();
        setUserData(data.user);
        setUpdatedData(data.user);
        
        // Initialize preferences if they exist in the user data
        if (data.user.preferences) {
          setPreferences(data.user.preferences);
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError(err.message || "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [router]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setNewProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUpdatedData({ ...updatedData, [name]: value });
  };

  const toggleEditMode = () => {
    if (editMode) {
      // Reset changes if canceling edit
      setUpdatedData(userData);
      setNewProfileImage(null);
      setImagePreview(null);
    }
    setEditMode(!editMode);
    setFeedback("");
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  // Handle password form input changes
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };

  // Handle preferences changes
  const handlePreferenceChange = (name, value) => {
    setPreferences({ ...preferences, [name]: value });
  };

  // Handle display mode change
  const handleDisplayModeChange = (mode) => {
    setPreferences({ ...preferences, displayMode: mode });
  };

  // Submit password change
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordFeedback("");
    setChangingPassword(true);

    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmNewPassword) {
      setPasswordFeedback("New passwords don't match");
      setChangingPassword(false);
      return;
    }

    if (passwordData.newPassword.length < 8) {
      setPasswordFeedback("Password must be at least 8 characters long");
      setChangingPassword(false);
      return;
    }

    try {
      setChangingPassword(true);
  
      const response = await fetch("/api/user/user", {
        method: "POST",  
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: userData.email,
          oldPassword: passwordData.currentPassword, 
          newPassword: passwordData.newPassword
        }),
      });
  
      const result = await response.json();
  
      if (response.ok) {
        setPasswordFeedback("Password updated successfully!");
        setPasswordData({
          currentPassword: "",
          newPassword: "",
          confirmNewPassword: ""
        });
      } else {
        setPasswordFeedback(result.message || "Failed to update password");
      }
    } catch (err) {
      console.error("Error updating password:", err);
      setPasswordFeedback("An error occurred while updating your password");
    } finally {
      setChangingPassword(false);
    }
  };

  // Submit preferences
  // const handlePreferencesSubmit = async (e) => {
  //   e.preventDefault();
  //   setPreferencesFeedback("");
  //   setSavingPreferences(true);

  //   try {
  //     const response = await fetch("/api/user/userupdate", {
  //       method: "PUT",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         email: userData.email,
  //         // preferences: preferences
  //       }),
  //     });

  //     const result = await response.json();

  //     if (response.ok) {
  //       setPreferencesFeedback("Preferences updated successfully!");
  //       // Update user data with new preferences
  //       setUserData({ ...userData, preferences: preferences });
  //     } else {
  //       setPreferencesFeedback(result.message || "Failed to update preferences");
  //     }
  //   } catch (err) {
  //     console.error("Error updating preferences:", err);
  //     setPreferencesFeedback("An error occurred while updating your preferences");
  //   } finally {
  //     setSavingPreferences(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setFeedback("");

    try {
      const formData = new FormData();

      // Add updated user data
      Object.keys(updatedData).forEach(key => {
        if (key !== "profileImage" && updatedData[key] !== userData[key]) {
          formData.append(key, updatedData[key]);
        }
      });

      // Add new profile image if exists
      if (newProfileImage) {
        formData.append('profileImage', newProfileImage);
      }

      // Only send update if there are changes
      if (formData.entries().next().done && !newProfileImage) {
        setSaving(false);
        setEditMode(false);
        return;
      }

      // Add email for identification
      formData.append('email', userData.email);

      const response = await fetch("/api/user/userupdate", {
        method: "PUT",
        body: formData,
      });

      const result = await response.json();

      if (response.ok) {
        setUserData({ ...userData, ...updatedData, profileImage: result.profileImage || userData.profileImage });
        setFeedback("Profile updated successfully!");
        setEditMode(false);
        setNewProfileImage(null);
        setImagePreview(null);
      } else {
        setFeedback(result.message || "Failed to update profile");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      setFeedback("An error occurred while updating your profile");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-accent mx-auto"></div>
          <p className="mt-4 text-xl">Loading your profile...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-screen flex items-center justify-center bg-gray-100">
        <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
          <div className="text-red-500 text-center mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-xl font-bold mt-2">Error</h2>
          </div>
          <p className="text-center">{error}</p>
          <button
            onClick={() => router.push('/login')}
            className="theme-btn w-full mt-4"
          >
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 pb-10">
      {/* Header */}
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center">
            <Image
              src={logo}
              height={40}
              width={120}
              alt="Carlinx Logo"
              className="rounded"
            />
          </div>
          <button
            onClick={() => {
              cookies.remove('user');
              router.push('/login');
            }}
            className="theme-btn-secondary"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Profile Container */}
      <div className="container mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          {/* Profile Header */}
          <div className="relative">
            {/* Background Banner */}
            <div className="h-48 bg-gradient-to-r from-black to-red-600"></div>

            {/* Profile Image and Basic Info */}
            <div className="absolute bottom-0 left-0 transform translate-y-1/2 ml-8 flex items-end">
              <div className="relative">
                {editMode && (imagePreview || newProfileImage) ? (
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-32 h-32 rounded-full border-4 border-white object-cover"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                    {userData.profileImage ? (
                      <img
                        src={userData.profileImage}
                        alt={userData.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-200">
                        <span className="text-5xl text-gray-400">👤</span>
                      </div>
                    )}
                  </div>
                )}

                {editMode && (
                  <label className="absolute bottom-0 right-0 bg-accent text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                  </label>
                )}
              </div>

              <div className="ml-4 pb-2">
                <h1 className="text-2xl font-bold text-white">{userData.name}</h1>
                <p className="text-blue-100">{userData.email}</p>
              </div>
            </div>

            {/* Edit Profile Button */}
            <div className="absolute bottom-0 right-0 transform translate-y-1/2 mr-8">
              <button
                onClick={toggleEditMode}
                className={`px-4 py-2 rounded-full font-medium ${editMode
                  ? "bg-gray-200 text-gray-700 hover:bg-gray-300"
                  : "bg-white text-accent border border-accent hover:bg-accent hover:text-white"
                  }`}
              >
                {editMode ? "Cancel" : "Edit Profile"}
              </button>
            </div>
          </div>

          {/* Profile Tabs */}
          <div className="mt-20 px-8">
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("profile")}
                className={`py-4 px-6 font-medium ${activeTab === "profile"
                  ? "text-accent border-b-2 border-accent"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Profile Information
              </button>
              <button
                onClick={() => setActiveTab("security")}
                className={`py-4 px-6 font-medium ${activeTab === "security"
                  ? "text-accent border-b-2 border-accent"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Security
              </button>
              <button
                onClick={() => setActiveTab("preferences")}
                className={`py-4 px-6 font-medium ${activeTab === "preferences"
                  ? "text-accent border-b-2 border-accent"
                  : "text-gray-500 hover:text-gray-700"
                  }`}
              >
                Preferences
              </button>
            </div>
          </div>

          {/* Profile Content */}
          <div className="p-8">
            {feedback && (
              <div className={`mb-6 p-4 rounded-lg ${feedback.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                {feedback}
              </div>
            )}

            {activeTab === "profile" && (
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Full Name
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        name="name"
                        value={updatedData.name || ''}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-3"
                      />
                    ) : (
                      <p className="p-3 bg-gray-50 rounded-lg">{userData.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Email Address
                    </label>
                    <p className="p-3 bg-gray-50 rounded-lg">{userData.email}</p>
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Date of Birth
                    </label>
                    {editMode ? (
                      <input
                        type="date"
                        name="dob"
                        value={updatedData.dob?.split('T')[0] || ''}
                        onChange={handleInputChange}
                        className="w-full border border-gray-300 rounded-lg p-3"
                      />
                    ) : (
                      <p className="p-3 bg-gray-50 rounded-lg">
                        {new Date(userData.dob).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Phone Number
                    </label>
                    {editMode ? (
                      <input
                        type="tel"
                        name="phone"
                        value={updatedData.phone || ''}
                        onChange={handleInputChange}
                        placeholder="Enter your phone number"
                        className="w-full border border-gray-300 rounded-lg p-3"
                      />
                    ) : (
                      <p className="p-3 bg-gray-50 rounded-lg">
                        {userData.phone || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Address
                    </label>
                    {editMode ? (
                      <textarea
                        name="address"
                        value={updatedData.address || ''}
                        onChange={handleInputChange}
                        placeholder="Enter your address"
                        className="w-full border border-gray-300 rounded-lg p-3"
                        rows="3"
                      />
                    ) : (
                      <p className="p-3 bg-gray-50 rounded-lg">
                        {userData.address || "Not provided"}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-gray-700 font-medium mb-2">
                      Car Model
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        name="carModel"
                        value={updatedData.carModel || ''}
                        onChange={handleInputChange}
                        placeholder="Enter your car model"
                        className="w-full border border-gray-300 rounded-lg p-3"
                      />
                    ) : (
                      <p className="p-3 bg-gray-50 rounded-lg">
                        {userData.carModel || "Not provided"}
                      </p>
                    )}
                  </div>
                </div>

                {editMode && (
                  <div className="mt-8 flex justify-end">
                    <button
                      type="submit"
                      disabled={saving}
                      className={`theme-btn ${saving ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                )}
              </form>
            )}

            {activeTab === "security" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Change Password</h3>
                  <p className="text-gray-600 mb-4">
                    To change your password, please fill out the form below. For security reasons,
                    you'll need to enter your current password.
                  </p>

                  {passwordFeedback && (
                    <div className={`mb-6 p-4 rounded-lg ${passwordFeedback.includes("success") ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                      {passwordFeedback}
                    </div>
                  )}

                  <form onSubmit={handlePasswordSubmit} className="bg-gray-50 p-6 rounded-lg">
                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2">
                        Current Password
                      </label>
                      <div className="relative">
                        <input
                          type={isPasswordVisible ? "text" : "password"}
                          name="currentPassword"
                          value={passwordData.currentPassword}
                          onChange={handlePasswordChange}
                          className="w-full border border-gray-300 rounded-lg p-3"
                          placeholder="Enter your current password"
                          required
                        />
                        <button
                          type="button"
                          onClick={togglePasswordVisibility}
                          className="absolute right-3 top-3 text-gray-500"
                        >
                          {isPasswordVisible ? (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                              <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                            </svg>
                          ) : (
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                              <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                            </svg>
                          )}
                        </button>
                      </div>
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2">
                        New Password
                      </label>
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        name="newPassword"
                        value={passwordData.newPassword}
                        onChange={handlePasswordChange}
                        className="w-full border border-gray-300 rounded-lg p-3"
                        placeholder="Enter your new password"
                        required
                        minLength={8}
                      />
                    </div>
                    <div className="mb-4">
                      <label className="block text-gray-700 font-medium mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type={isPasswordVisible ? "text" : "password"}
                        name="confirmNewPassword"
                        value={passwordData.confirmNewPassword}
                        onChange={handlePasswordChange}
                        className="w-full border border-gray-300 rounded-lg p-3"
                        placeholder="Confirm your new password"
                        required
                      />
                    </div>
                    <button
                      type="submit"
                      className={`theme-btn mt-2 ${changingPassword ? 'opacity-50 cursor-not-allowed' : ''}`}
                      disabled={changingPassword}
                    >
                      {changingPassword ? "Changing Password..." : "Change Password"}
                    </button>
                  </form>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Account Security</h3>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="font-medium">Two-Factor Authentication</h4>
                        <p className="text-gray-600 text-sm">
                          Add an extra layer of security to your account
                        </p>
                      </div>
                      <button className="px-4 py-2 border border-accent text-accent rounded-lg hover:bg-accent hover:text-white">
                        Set Up
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Login Activity</h4>
                        <p className="text-gray-600 text-sm">
                          View your recent login sessions
                        </p>
                      </div>
                      <button className="px-4 py-2 border border-accent text-accent rounded-lg hover:bg-accent hover:text-white">
                        View
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "preferences" && (
              <div className="space-y-8">
                <div>
                  <h3 className="text-lg font-semibold mb-4">Notification Settings</h3>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-gray-600 text-sm">
                            Receive updates about your account via email
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">SMS Notifications</h4>
                          <p className="text-gray-600 text-sm">
                            Get text messages for order updates and promotions
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" value="" className="sr-only peer" />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                        </label>
                      </div>

                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Service Reminders</h4>
                          <p className="text-gray-600 text-sm">
                            Get reminders about upcoming car service dates
                          </p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                          <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent"></div>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold mb-4">Theme Preferences</h3>
                  <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium mb-2">Display Mode</h4>
                        <div className="flex gap-4">
                          <button className="px-4 py-2 bg-white text-gray-800 rounded-lg border border-gray-300 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                            </svg>
                            Light
                          </button>
                          <button className="px-4 py-2 rounded-lg border border-gray-300 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                            </svg>
                            Dark
                          </button>
                          <button className="px-4 py-2 rounded-lg border border-gray-300 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                            </svg>
                            System
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;