const User = require('../models/User');
const Request = require('../models/Request');

// Get all operators
exports.getOperators = async (req, res) => {
  try {
    const operators = await User.find({ role: 'operator' })
      .select('name email phone ward createdAt')
      .sort({ name: 1 });
    
    res.json(operators);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Create new operator
exports.createOperator = async (req, res) => {
  try {
    const { name, email, password, phone, ward } = req.body;
    
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: 'Email already in use' });

    const operator = await User.create({
      name,
      email,
      password,
      phone,
      role: 'operator',
      ward
    });

    res.status(201).json({
      message: 'Operator created successfully',
      operator: {
        id: operator._id,
        name: operator.name,
        email: operator.email,
        phone: operator.phone,
        ward: operator.ward
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get analytics data
exports.getAnalytics = async (req, res) => {
  try {
    const { ward, startDate, endDate } = req.query;
    
    // Build date filter
    const dateFilter = {};
    if (startDate || endDate) {
      dateFilter.createdAt = {};
      if (startDate) dateFilter.createdAt.$gte = new Date(startDate);
      if (endDate) dateFilter.createdAt.$lte = new Date(endDate);
    }

    // Ward filter for wardAdmin
    if (req.user.role === 'wardAdmin' && req.user.ward) {
      dateFilter.ward = req.user.ward;
    } else if (ward) {
      dateFilter.ward = ward;
    }

    // Requests per ward
    const requestsPerWard = await Request.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$ward', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Requests per status
    const requestsPerStatus = await Request.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$status', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Requests per waste type
    const requestsPerWasteType = await Request.aggregate([
      { $match: dateFilter },
      { $group: { _id: '$wasteType', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Most active operators
    const activeOperators = await Request.aggregate([
      { $match: { ...dateFilter, assignedOperator: { $exists: true } } },
      { $group: { _id: '$assignedOperator', count: { $sum: 1 } } },
      { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'operator' } },
      { $unwind: '$operator' },
      { $project: { name: '$operator.name', email: '$operator.email', count: 1 } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Average completion time (in hours)
    const avgCompletionTime = await Request.aggregate([
      { 
        $match: { 
          ...dateFilter, 
          status: 'Completed',
          updatedAt: { $exists: true }
        } 
      },
      {
        $project: {
          completionTime: {
            $divide: [
              { $subtract: ['$updatedAt', '$createdAt'] },
              1000 * 60 * 60 // Convert to hours
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          avgTime: { $avg: '$completionTime' }
        }
      }
    ]);

    // SLA breach count (requests older than 24 hours and not completed)
    const slaBreachCount = await Request.countDocuments({
      ...dateFilter,
      status: { $nin: ['Completed', 'Rejected'] },
      createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    // Total requests
    const totalRequests = await Request.countDocuments(dateFilter);

    res.json({
      requestsPerWard,
      requestsPerStatus,
      requestsPerWasteType,
      activeOperators,
      avgCompletionTime: avgCompletionTime[0]?.avgTime || 0,
      slaBreachCount,
      totalRequests
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all wards
exports.getWards = async (req, res) => {
  try {
    const wards = await Request.distinct('ward');
    res.json(wards.filter(ward => ward)); // Remove null/undefined values
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get dashboard summary
exports.getDashboardSummary = async (req, res) => {
  try {
    const dateFilter = {};
    
    // Ward filter for wardAdmin
    if (req.user.role === 'wardAdmin' && req.user.ward) {
      dateFilter.ward = req.user.ward;
    }

    // Today's requests
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayRequests = await Request.countDocuments({
      ...dateFilter,
      createdAt: { $gte: today }
    });

    // Pending requests
    const pendingRequests = await Request.countDocuments({
      ...dateFilter,
      status: { $in: ['Open', 'Assigned', 'On the Way', 'In Progress'] }
    });

    // Completed today
    const completedToday = await Request.countDocuments({
      ...dateFilter,
      status: 'Completed',
      updatedAt: { $gte: today }
    });

    // SLA breaches
    const slaBreaches = await Request.countDocuments({
      ...dateFilter,
      status: { $nin: ['Completed', 'Rejected'] },
      createdAt: { $lt: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });

    res.json({
      todayRequests,
      pendingRequests,
      completedToday,
      slaBreaches
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
