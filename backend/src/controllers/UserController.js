const User = require('../entities/User');
const crypto = require('crypto');

// Simple hash untuk password (prototipe - bukan production)
function hashPassword(password) {
  return crypto.createHash('sha256').update(password).digest('hex');
}

class UserController {
  /**
   * Endpoint: POST /api/users/register
   * Mendaftarkan user baru
   */
  static async register(req, res) {
    try {
      const { name, email, password } = req.body;

      if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: 'Nama, email, dan password wajib diisi' });
      }

      // Cek apakah email sudah digunakan
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(409).json({ success: false, message: 'Email sudah terdaftar. Silakan gunakan email lain.' });
      }

      const hashedPassword = hashPassword(password);

      const newUser = new User({
        name,
        email,
        password: hashedPassword
      });

      await newUser.save();

      // Kembalikan data user tanpa password
      res.status(201).json({
        success: true,
        message: 'Registrasi berhasil! Selamat bergabung.',
        data: {
          _id: newUser._id,
          name: newUser.name,
          email: newUser.email,
          createdAt: newUser.createdAt
        }
      });
    } catch (error) {
      console.error('Error register:', error);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan server internal' });
    }
  }

  /**
   * Endpoint: POST /api/users/login
   * Login user
   */
  static async login(req, res) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res.status(400).json({ success: false, message: 'Email dan password wajib diisi' });
      }

      const user = await User.findOne({ email });
      if (!user) {
        return res.status(401).json({ success: false, message: 'Email atau password salah.' });
      }

      const hashedPassword = hashPassword(password);
      if (user.password !== hashedPassword) {
        return res.status(401).json({ success: false, message: 'Email atau password salah.' });
      }

      res.status(200).json({
        success: true,
        message: 'Login berhasil!',
        data: {
          _id: user._id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt
        }
      });
    } catch (error) {
      console.error('Error login:', error);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan server internal' });
    }
  }

  /**
   * Endpoint: GET /api/users/:id
   * Mengambil profil user berdasarkan ID
   */
  static async getProfile(req, res) {
    try {
      const { id } = req.params;
      const user = await User.findById(id).select('-password');
      if (!user) {
        return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
      }
      res.status(200).json({ success: true, data: user });
    } catch (error) {
      console.error('Error getProfile:', error);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan server internal' });
    }
  }

  /**
   * Endpoint: PATCH /api/users/:id
   * Update profil user
   */
  static async updateProfile(req, res) {
    try {
      const { id } = req.params;
      const { name } = req.body;

      const updatedUser = await User.findByIdAndUpdate(
        id,
        { name, updatedAt: new Date() },
        { new: true }
      ).select('-password');

      if (!updatedUser) {
        return res.status(404).json({ success: false, message: 'User tidak ditemukan' });
      }

      res.status(200).json({ success: true, message: 'Profil berhasil diperbarui', data: updatedUser });
    } catch (error) {
      console.error('Error updateProfile:', error);
      res.status(500).json({ success: false, message: 'Terjadi kesalahan server internal' });
    }
  }
}

module.exports = UserController;
