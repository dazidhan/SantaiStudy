const express = require('express');
const router = express.Router();
const UserController = require('../controllers/UserController');

/**
 * @swagger
 * /api/users/register:
 *   post:
 *     summary: Mendaftarkan user baru
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User berhasil didaftarkan
 *       409:
 *         description: Email sudah digunakan
 */
router.post('/register', UserController.register);

/**
 * @swagger
 * /api/users/login:
 *   post:
 *     summary: Login user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login berhasil, mengembalikan data user
 *       401:
 *         description: Email atau password salah
 */
router.post('/login', UserController.login);

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Mengambil profil user berdasarkan ID
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Profil user berhasil diambil
 *   patch:
 *     summary: Update profil user
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profil berhasil diperbarui
 */
router.get('/:id', UserController.getProfile);
router.patch('/:id', UserController.updateProfile);

module.exports = router;
