const Counter = require('../models/Counter');

async function generateTicketId() {
  const year = new Date().getFullYear();
  const key = `ticket_${year}`;

  const updated = await Counter.findOneAndUpdate(
    { id: key },
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );

  const seq = String(updated.seq).padStart(6, '0');
  return `REQ-${year}-${seq}`;
}

module.exports = generateTicketId;
