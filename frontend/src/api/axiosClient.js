import axios from 'axios';

// Klien Axios untuk menembak Backend Node.js
export const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Mengambil userId dari localStorage (diisi saat login/register)
export const getUserId = () => {
  return localStorage.getItem('santaistudy_userId') || null;
};

// Mengambil data user lengkap dari localStorage
export const getCurrentUser = () => {
  const userStr = localStorage.getItem('santaistudy_user');
  try {
    return userStr ? JSON.parse(userStr) : null;
  } catch {
    return null;
  }
};

// Simpan user ke localStorage setelah login/register
export const saveUser = (userData) => {
  localStorage.setItem('santaistudy_userId', userData._id);
  localStorage.setItem('santaistudy_user', JSON.stringify(userData));
};

// Hapus data user dari localStorage (logout)
export const clearUser = () => {
  localStorage.removeItem('santaistudy_userId');
  localStorage.removeItem('santaistudy_user');
};

// Kept for backward compatibility — DUMMY_USER_ID dipakai sebagai fallback
export const DUMMY_USER_ID = "6639c0f91a2b3c4d5e6f7a8b";
