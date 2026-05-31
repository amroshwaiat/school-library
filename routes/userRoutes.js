const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { isAdmin } = require('../middleware/authMiddleware');

router.get('/users', isAdmin, userController.getAllUsers);
router.post('/users/update-role/:id', isAdmin, userController.updateUserRole);
router.post('/users/reset-password', isAdmin, userController.resetPassword);
router.get('/users/delete/:id', isAdmin, userController.deleteUser);
router.post('/users/add', isAdmin, userController.addUser);
module.exports = router;