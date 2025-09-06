const Request = require('../models/Request');
const generateTicketId = require('../utils/generateTicketId');
const cloudinary = require('../config/cloudinary');
const fs = require('fs');
const path = require('path');

exports.createRequest = async (req, res) => {
  try {
    const {
      fullName, mobileNumber, ward, address, lat, lng,
      wasteType, preferredTimeSlot, description
    } = req.body;

    // upload photos (if any) to Cloudinary
    const photos = [];
    if (req.files && req.files.length > 0) {
      for (const f of req.files) {
        const result = await cloudinary.uploader.upload(f.path, { folder: 'desludging-requests' });
        photos.push({ url: result.secure_url, public_id: result.public_id });
        // remove temp file
        fs.unlinkSync(f.path);
      }
    }

    const ticketId = await generateTicketId();

    const reqDoc = await Request.create({
      ticketId,
      citizen: req.user ? req.user._id : undefined,
      fullName,
      mobileNumber,
      ward,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng || 0), parseFloat(lat || 0)],
        address
      },
      wasteType,
      preferredTimeSlot,
      description,
      photos
    });

    res.status(201).json({ message: 'Request created', request: reqDoc });
  } catch (err) {
    console.error('createRequest err', err);
    res.status(500).json({ message: err.message });
  }
};

exports.getRequests = async (req, res) => {
  try {
    const { page = 1, limit = 20, ward, status, wasteType, startDate, endDate, assigned } = req.query;
    const skip = (page - 1) * limit;
    const filter = {};

    // citizen -> only their requests
    if (req.user && req.user.role === 'citizen') {
      filter.citizen = req.user._id;
    } else {
      // admin: optional ward-level restriction: wardAdmin sees only their ward
      if (req.user && req.user.role === 'wardAdmin' && req.user.ward) {
        filter.ward = req.user.ward;
      }
    }

    if (ward) filter.ward = ward;
    if (status) filter.status = status;
    if (wasteType) filter.wasteType = wasteType;
    if (assigned === 'true') filter.assignedOperator = { $exists: true };

    if (startDate || endDate) {
      filter.createdAt = {};
      if (startDate) filter.createdAt.$gte = new Date(startDate);
      if (endDate) filter.createdAt.$lte = new Date(endDate);
    }

    const total = await Request.countDocuments(filter);
    const data = await Request.find(filter)
      .populate('citizen', 'name email phone')
      .populate('assignedOperator', 'name phone email')
      .sort({ createdAt: -1 })
      .skip(parseInt(skip))
      .limit(parseInt(limit));

    res.json({ total, page: parseInt(page), limit: parseInt(limit), data });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getRequestById = async (req, res) => {
  try {
    const r = await Request.findById(req.params.id)
      .populate('citizen', 'name email phone')
      .populate('assignedOperator', 'name phone');

    if (!r) return res.status(404).json({ message: 'Request not found' });
    res.json(r);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.assignOperator = async (req, res) => {
  try {
    const { operatorId } = req.body;
    const r = await Request.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Request not found' });

    r.assignedOperator = operatorId;
    r.status = 'Assigned';
    r.notes.push({ by: req.user._id, role: req.user.role, text: `Assigned to operator ${operatorId}` });
    await r.save();

    // TODO: emit socket event e.g. io.to(operator).emit('assigned', r);
    res.json({ message: 'Operator assigned', request: r });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const r = await Request.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Request not found' });

    r.status = status;
    r.notes.push({ by: req.user._id, role: req.user.role, text: `Status updated to ${status}` });
    await r.save();

    // TODO: emit socket event on status change
    res.json({ message: 'Status updated', request: r });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addNote = async (req, res) => {
  try {
    const r = await Request.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Request not found' });

    const photos = [];
    if (req.files && req.files.length > 0) {
      for (const f of req.files) {
        const result = await cloudinary.uploader.upload(f.path, { folder: 'desludging-notes' });
        photos.push({ url: result.secure_url, public_id: result.public_id });
        fs.unlinkSync(f.path);
      }
    }

    r.notes.push({ by: req.user._id, role: req.user.role, text: req.body.text, photos });
    await r.save();
    res.json({ message: 'Note added', request: r });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.addFeedback = async (req, res) => {
  try {
    const { rating, comment } = req.body;
    const r = await Request.findById(req.params.id);
    if (!r) return res.status(404).json({ message: 'Request not found' });
    if (r.status !== 'Completed') return res.status(400).json({ message: 'Can give feedback only after completion' });

    r.feedback = { rating, comment };
    await r.save();
    res.json({ message: 'Feedback saved', request: r });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
