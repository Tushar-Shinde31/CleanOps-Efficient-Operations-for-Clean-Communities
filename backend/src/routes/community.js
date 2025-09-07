const express = require('express');
const router = express.Router();
const { protect } = require('../middlewares/auth');
const upload = require('../middlewares/upload');
const communityCtrl = require('../controllers/communityController');

// Create community project
router.post('/', protect, upload.array('photos', 5), communityCtrl.createProject);

// Get all community projects
router.get('/', communityCtrl.getProjects);

// Get project by ID
router.get('/:id', communityCtrl.getProjectById);

// Join project
router.post('/:id/join', protect, communityCtrl.joinProject);

// Leave project
router.post('/:id/leave', protect, communityCtrl.leaveProject);

// Update project status (organizer only)
router.put('/:id/status', protect, communityCtrl.updateProjectStatus);

// Add note to project
router.post('/:id/notes', protect, upload.array('photos', 4), communityCtrl.addProjectNote);

module.exports = router;
