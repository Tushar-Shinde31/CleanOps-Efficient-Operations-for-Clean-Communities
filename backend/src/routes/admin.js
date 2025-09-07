const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { allowRoles } = require('../middlewares/role');
const adminCtrl = require('../controllers/adminController');

// Dashboard summary
router.get('/dashboard', protect, allowRoles('wardAdmin', 'superAdmin'), adminCtrl.getDashboardSummary);

// Analytics
router.get('/analytics', protect, allowRoles('wardAdmin', 'superAdmin'), adminCtrl.getAnalytics);

// Ward management
router.get('/wards', protect, allowRoles('wardAdmin', 'superAdmin'), adminCtrl.getWards);

// Operator management
router.get('/operators', protect, allowRoles('wardAdmin', 'superAdmin'), adminCtrl.getOperators);
router.post('/operators', protect, allowRoles('superAdmin'), adminCtrl.createOperator);

module.exports = router;
