import axios from 'axios';

// Klien Axios untuk menembak Backend Node.js
export const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Sesuaikan dengan port server.js Anda
  headers: {
    'Content-Type': 'application/json'
  }
});

// Karena sistem otentikasi belum ada di prototipe ini,
// kita gunakan User ID dummy (harus valid ObjectId 24-karakter jika pakai MongoDB)
export const DUMMY_USER_ID = "6639c0f91a2b3c4d5e6f7a8b"; 
