const express = require('express');
const router = express.Router();
const { getDashboard, addUser, addStore, getUsers, getStores } = require('../controllers/adminController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.use(verifyToken, requireRole('ADMIN'));

router.get('/dashboard', getDashboard);
router.post('/users', addUser);
router.post('/stores', addStore);
router.get('/users', getUsers);
router.get('/stores', getStores);

module.exports = router;
