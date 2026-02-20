const express = require('express');
const router = express.Router();
const { getMyStore, getRaters } = require('../controllers/ownerController');
const { verifyToken, requireRole } = require('../middleware/authMiddleware');

router.use(verifyToken, requireRole('STORE_OWNER'));

router.get('/my-store', getMyStore);
router.get('/raters', getRaters);

module.exports = router;
