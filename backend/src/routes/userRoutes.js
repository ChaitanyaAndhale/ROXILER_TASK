const express = require('express');
const router = express.Router();
const { getStores, submitRating } = require('../controllers/userController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.use(verifyToken, requireRole('USER'));

router.get('/stores', getStores);
router.post('/ratings', submitRating);

module.exports = router;
