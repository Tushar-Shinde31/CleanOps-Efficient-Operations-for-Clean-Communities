const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const { allowRoles } = require('../middlewares/role');
const upload = require('../middlewares/upload');
const requestCtrl = require('../controllers/requestController');

// citizen create (auth optional if you want allow anonymous)
router.post('/', protect, upload.array('photos', 5), requestCtrl.createRequest);

// get list (citizen sees own, admins see filtered)
router.get('/', protect, requestCtrl.getRequests);

router.get('/:id', protect, requestCtrl.getRequestById);

// assign (admin roles)
router.put('/:id/assign', protect, allowRoles('wardAdmin','superAdmin'), requestCtrl.assignOperator);

// status update (operator or admin)
router.put('/:id/status', protect, allowRoles('operator','wardAdmin','superAdmin'), requestCtrl.updateStatus);

// add note (operator/admin)
router.post('/:id/notes', protect, allowRoles('operator','wardAdmin','superAdmin'), upload.array('photos', 4), requestCtrl.addNote);

// feedback (citizen)
router.post('/:id/feedback', protect, allowRoles('citizen'), requestCtrl.addFeedback);

module.exports = router;
