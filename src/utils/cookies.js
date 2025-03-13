// utils/cookies.js
import Cookies from 'js-cookie';

/**
 * Set user authentication cookie with a unique name to avoid conflicts with Razorpay
 * @param {Object} userData - User data to store in cookie
 */
export const setAuthCookie = (userData) => {
  Cookies.set('carlinx_user_auth', JSON.stringify(userData), { 
    expires: 7,  // 7 days
    path: '/',   // Available across the site
    sameSite: 'Lax' // Prevents cookie from being sent in cross-site requests
  });
};

/**
 * Get user data from authentication cookie
 * @returns {Object|null} User data or null if not found
 */
export const getAuthCookie = () => {
  const cookie = Cookies.get('carlinx_user_auth');
  if (!cookie) return null;
  
  try {
    return JSON.parse(cookie);
  } catch (error) {
    console.error('Failed to parse auth cookie:', error);
    return null;
  }
};

/**
 * Remove authentication cookie
 */
export const removeAuthCookie = () => {
  Cookies.remove('carlinx_user_auth', { path: '/' });
};

/**
 * Check if user is authenticated and is admin
 * @returns {Boolean} True if user is admin
 */
export const isAdmin = () => {
  const userData = getAuthCookie();
  return userData && userData.isAdmin;
};