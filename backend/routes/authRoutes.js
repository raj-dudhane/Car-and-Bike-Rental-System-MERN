// Auth Routes
const express = require('express');
const { register, login ,getProfile,getAllUsers,deleteUser} = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const router = express.Router();
router.post('/register', register);
router.post('/login', login);
router.get('/profile', protect, getProfile);
router.get('/users', protect, getAllUsers);
router.delete('/users/:id', protect, deleteUser);
module.exports = router;