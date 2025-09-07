const CommunityProject = require('../models/CommunityProject');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');

// Create community project
exports.createProject = async (req, res) => {
  try {
    const {
      title, description, ward, address, lat, lng,
      wasteType, targetDate
    } = req.body;

    // upload photos (if any) to Cloudinary
    const photos = [];
    if (req.files && req.files.length > 0) {
      for (const f of req.files) {
        const result = await cloudinary.uploader.upload(f.path, { folder: 'community-projects' });
        photos.push({ url: result.secure_url, public_id: result.public_id });
        fs.unlinkSync(f.path);
      }
    }

    const project = await CommunityProject.create({
      title,
      description,
      ward,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng || 0), parseFloat(lat || 0)],
        address
      },
      wasteType,
      organizer: req.user._id,
      participants: [req.user._id], // organizer is first participant
      targetDate: targetDate ? new Date(targetDate) : undefined,
      photos
    });

    res.status(201).json({ message: 'Community project created', project });
  } catch (err) {
    console.error('createProject err', err);
    res.status(500).json({ message: err.message });
  }
};

// Get all community projects
exports.getProjects = async (req, res) => {
  try {
    const { page = 1, limit = 20, ward, status, wasteType } = req.query;
    const skip = (page - 1) * limit;
    const filter = {};

    if (ward) filter.ward = ward;
    if (status) filter.status = status;
    if (wasteType) filter.wasteType = wasteType;

    const total = await CommunityProject.countDocuments(filter);
    const data = await CommunityProject.find(filter)
      .populate('organizer', 'name email phone')
      .populate('participants', 'name email')
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    res.json({ total, page: parseInt(page), limit: parseInt(limit), data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get project by ID
exports.getProjectById = async (req, res) => {
  try {
    const project = await CommunityProject.findById(req.params.id)
      .populate('organizer', 'name email phone')
      .populate('participants', 'name email')
      .populate('notes.by', 'name role');

    if (!project) return res.status(404).json({ message: 'Project not found' });
    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Join community project
exports.joinProject = async (req, res) => {
  try {
    const project = await CommunityProject.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Check if user is already a participant
    if (project.participants.includes(req.user._id)) {
      return res.status(400).json({ message: 'Already joined this project' });
    }

    project.participants.push(req.user._id);
    await project.save();

    res.json({ message: 'Successfully joined project', project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Leave community project
exports.leaveProject = async (req, res) => {
  try {
    const project = await CommunityProject.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Can't leave if you're the organizer
    if (project.organizer.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: 'Organizer cannot leave the project' });
    }

    project.participants = project.participants.filter(
      participant => participant.toString() !== req.user._id.toString()
    );
    await project.save();

    res.json({ message: 'Successfully left project', project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update project status (organizer only)
exports.updateProjectStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const project = await CommunityProject.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Only organizer can update status
    if (project.organizer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Only organizer can update project status' });
    }

    project.status = status;
    if (status === 'Completed') {
      project.completedDate = new Date();
    }

    project.notes.push({
      by: req.user._id,
      role: req.user.role,
      text: `Project status updated to ${status}`
    });

    await project.save();
    res.json({ message: 'Project status updated', project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add note to project
exports.addProjectNote = async (req, res) => {
  try {
    const project = await CommunityProject.findById(req.params.id);
    if (!project) return res.status(404).json({ message: 'Project not found' });

    // Only participants can add notes
    if (!project.participants.includes(req.user._id)) {
      return res.status(403).json({ message: 'Only participants can add notes' });
    }

    const photos = [];
    if (req.files && req.files.length > 0) {
      for (const f of req.files) {
        const result = await cloudinary.uploader.upload(f.path, { folder: 'community-notes' });
        photos.push({ url: result.secure_url, public_id: result.public_id });
        fs.unlinkSync(f.path);
      }
    }

    project.notes.push({
      by: req.user._id,
      role: req.user.role,
      text: req.body.text,
      photos
    });

    await project.save();
    res.json({ message: 'Note added to project', project });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
