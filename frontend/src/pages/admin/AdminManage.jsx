import { useEffect, useMemo, useState } from 'react'
import api from '../../services/api'
import './AdminManage.css'

// ============================
// AdminManage Component
// ============================
// This is the main workspace for Admins.
// It allows admins to:
// - View request summary stats
// - Filter and browse citizen requests
// - Assign operators
// - Update request status
// - See request details, photos, notes, and feedback
export default function AdminManage() {
  const [summary, setSummary] = useState(null)   // Dashboard summary (counts)
  const [items, setItems] = useState([])        // List of requests
  const [operators, setOperators] = useState([]) // Available operators
  const [filters, setFilters] = useState({ ward:'', status:'', wasteType:'' }) // Active filters
  const [selectedId, setSelectedId] = useState('') // Currently selected request
  const [loading, setLoading] = useState(false) // Loading state for requests

  // Get the currently selected request object from items
  const selected = useMemo(
    () => items.find(r => r._id === selectedId),
    [items, selectedId]
  )

  // Fetch summary stats (today’s requests, pending, SLA, etc.)
  const loadSummary = async () => {
    const { data } = await api.get('/admin/dashboard')
    setSummary(data)
  }

  // Fetch requests with filters applied
  const loadRequests = async () => {
    setLoading(true)
    try {
      const { data } = await api.get('/requests', { params: { ...filters, limit: 100 } })
      setItems(data.data || [])
      // Auto-select first request if none selected
      if (!selectedId && data.data && data.data.length > 0) {
        setSelectedId(data.data[0]._id)
      }
    } finally {
      setLoading(false)
    }
  }

  // Fetch list of operators (for assignment dropdown)
  const loadOperators = async () => {
    const { data } = await api.get('/admin/operators')
    setOperators(data)
  }

  // Run loaders when component mounts or filters change
  useEffect(() => { loadSummary() }, [])
  useEffect(() => { loadOperators() }, [])
  useEffect(() => { loadRequests() }, [filters])

  // Assign operator to a request
  const assignOperator = async (requestId, operatorId) => {
    if (!operatorId) return
    await api.put(`/requests/${requestId}/assign`, { operatorId })
    await Promise.all([loadRequests(), loadSummary()])
  }

  // Update request status
  const updateStatus = async (requestId, status) => {
    await api.put(`/requests/${requestId}/status`, { status })
    await Promise.all([loadRequests(), loadSummary()])
  }

  return (
    <div className="admin-manage">
      <h2>Admin Workspace</h2>

      {/* ============================ */}
      {/* Summary Cards */}
      {/* ============================ */}
      <div className="stats-grid">
        <div className="card stat">
          <span className="label">Today's Requests</span>
          <span className="value">{summary?.todayRequests ?? '—'}</span>
        </div>
        <div className="card stat warning">
          <span className="label">Pending</span>
          <span className="value">{summary?.pendingRequests ?? '—'}</span>
        </div>
        <div className="card stat success">
          <span className="label">Completed Today</span>
          <span className="value">{summary?.completedToday ?? '—'}</span>
        </div>
        <div className="card stat danger">
          <span className="label">SLA Breaches</span>
          <span className="value">{summary?.slaBreaches ?? '—'}</span>
        </div>
      </div>

      {/* ============================ */}
      {/* Filters Section */}
      {/* ============================ */}
      <div className="filters">
        <div className="field">
          <label>Ward</label>
          <input
            value={filters.ward}
            onChange={(e) => setFilters({ ...filters, ward: e.target.value })}
            placeholder="e.g. 5"
          />
        </div>
        <div className="field">
          <label>Status</label>
          <select
            value={filters.status}
            onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          >
            <option value="">All</option>
            {['Open','Assigned','On the Way','In Progress','Completed','Rejected'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label>Waste Type</label>
          <select
            value={filters.wasteType}
            onChange={(e) => setFilters({ ...filters, wasteType: e.target.value })}
          >
            <option value="">All</option>
            {['sewage','household','industrial','other'].map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ============================ */}
      {/* Split Layout (List + Details) */}
      {/* ============================ */}
      <div className="split">
        {/* Left side: Requests Table */}
        <div className="left">
          <div className="table-wrapper">
            <table className="requests-table">
              <thead>
                <tr>
                  <th>Ticket</th>
                  <th>Citizen</th>
                  <th>Ward</th>
                  <th>Waste</th>
                  <th>Status</th>
                  <th>Assigned</th>
                </tr>
              </thead>
              <tbody>
                {loading && (
                  <tr><td colSpan={6} className="muted">Loading…</td></tr>
                )}
                {!loading && items.length === 0 && (
                  <tr><td colSpan={6} className="muted">No requests found</td></tr>
                )}
                {items.map(r => (
                  <tr
                    key={r._id}
                    className={selectedId === r._id ? 'active' : ''}
                    onClick={() => setSelectedId(r._id)}
                  >
                    <td>{r.ticketId}</td>
                    <td>{r.fullName || r.citizen?.name || '—'}</td>
                    <td>{r.ward}</td>
                    <td>{r.wasteType}</td>
                    <td>
                      <span className={`badge ${String(r.status).toLowerCase().replace(/\s/g,'-')}`}>
                        {r.status}
                      </span>
                    </td>
                    <td>{r.assignedOperator ? (r.assignedOperator.name || 'Yes') : 'No'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Right side: Selected Request Details */}
        <div className="right">
          {!selected && (
            <div className="card">
              <div className="muted">Select a request to view details</div>
            </div>
          )}
          {selected && (
            <div className="card details">
              {/* Header with ticket info + status update */}
              <div className="header">
                <div>
                  <div className="ticket">{selected.ticketId}</div>
                  <div className="muted">Created {new Date(selected.createdAt).toLocaleString()}</div>
                </div>
                <select
                  className="status-select"
                  value={selected.status}
                  onChange={(e) => updateStatus(selected._id, e.target.value)}
                >
                  {['Open','Assigned','On the Way','In Progress','Completed','Rejected'].map(s => (
                    <option key={s} value={s}>{s}</option>
                  ))}
                </select>
              </div>

              {/* Citizen & request details */}
              <div className="grid-2">
                <div>
                  <div className="field-row"><span className="label">Citizen</span><span>{selected.fullName || selected.citizen?.name || '—'}</span></div>
                  <div className="field-row"><span className="label">Mobile</span><span>{selected.mobileNumber || selected.citizen?.phone || '—'}</span></div>
                  <div className="field-row"><span className="label">Ward</span><span>{selected.ward || '—'}</span></div>
                  <div className="field-row"><span className="label">Waste Type</span><span>{selected.wasteType}</span></div>
                  <div className="field-row"><span className="label">Preferred Slot</span><span>{selected.preferredTimeSlot || '—'}</span></div>
                </div>
                <div>
                  <div className="field-row"><span className="label">Address</span><span>{selected.location?.address || '—'}</span></div>
                  <div className="field-row"><span className="label">Coordinates</span><span>{Array.isArray(selected.location?.coordinates) ? selected.location.coordinates.join(', ') : '—'}</span></div>
                  <div className="field-row">
                    <span className="label">Assign Operator</span>
                    <select
                      defaultValue={selected.assignedOperator?._id || ''}
                      onChange={(e) => assignOperator(selected._id, e.target.value)}
                    >
                      <option value="">Select</option>
                      {operators.map(o => (
                        <option key={o._id} value={o._id}>{o.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Description */}
              <div className="section">
                <div className="section-title">Description</div>
                <div className="description-text">{selected.description || '—'}</div>
              </div>

              {/* Photos */}
              {Array.isArray(selected.photos) && selected.photos.length > 0 && (
                <div className="section">
                  <div className="section-title">Photos</div>
                  <div className="photos">
                    {selected.photos.map((p, idx) => (
                      <a key={idx} href={p.url} target="_blank" rel="noreferrer">
                        <img src={p.url} alt={`photo-${idx}`} />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Notes */}
              {Array.isArray(selected.notes) && selected.notes.length > 0 && (
                <div className="section">
                  <div className="section-title">Notes</div>
                  <ul className="notes">
                    {selected.notes.map((n, i) => (
                      <li key={i}>
                        <span className="muted">[{new Date(n.createdAt).toLocaleString()}] {n.role}:</span> {n.text}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Feedback */}
              {selected.feedback && (
                <div className="section">
                  <div className="section-title">Feedback</div>
                  <div className="muted">Rating: {selected.feedback.rating}/5</div>
                  <div>{selected.feedback.comment}</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
