import { useState } from "react";
import api from "../../services/api";
import "./CommunityCreate.css";

export default function CommunityCreate() {
  const [form, setForm] = useState({
    title: "",
    description: "",
    ward: "",
    address: "",
    lat: "",
    lng: "",
    wasteType: "household",
    targetDate: "",
  });
  const [photos, setPhotos] = useState([]);
  const [msg, setMsg] = useState("");
  const [error, setError] = useState("");
  const descriptionMax = 800;

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setMsg("");
    setError("");

    try {
      const fd = new FormData();
      Object.entries(form).forEach(([key, value]) => fd.append(key, value));
      photos.forEach((file) => fd.append("photos", file));

      const { data } = await api.post("/community", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMsg(`✅ Project created: ${data.project.title}`);
      setForm({
        title: "",
        description: "",
        ward: "",
        address: "",
        lat: "",
        lng: "",
        wasteType: "household",
        targetDate: "",
      });
      setPhotos([]);
    } catch (err) {
      setError(err?.response?.data?.message || "❌ Failed to create project");
    }
  };

  return (
    <div className="community-create">
      <header className="header">
        <h2>Create Community Project</h2>
        <p className="muted">
          Organize a neighborhood clean-up or desludging drive. Share clear
          details to get more citizens involved.
        </p>
      </header>

      {msg && <div className="alert success">{msg}</div>}
      {error && <div className="alert error">{error}</div>}

      <div className="panel">
        <form className="form" onSubmit={onSubmit}>
          {/* Title */}
          <div className="field">
            <label htmlFor="title">Title</label>
            <input
              id="title"
              name="title"
              value={form.title}
              onChange={onChange}
              placeholder="e.g. Ward 5 Desludging Drive"
              required
            />
          </div>

          {/* Description */}
          <div className="field">
            <div className="label-row">
              <label htmlFor="description">Description</label>
              <span className="muted">
                {form.description.length}/{descriptionMax}
              </span>
            </div>
            <textarea
              id="description"
              name="description"
              value={form.description}
              onChange={onChange}
              placeholder="Describe the project goals, meeting point, and any coordination details"
              maxLength={descriptionMax}
              rows={5}
              required
            />
          </div>

          {/* Grid fields */}
          <div className="grid-2">
            <div className="field">
              <label htmlFor="ward">Ward</label>
              <input
                id="ward"
                name="ward"
                value={form.ward}
                onChange={onChange}
                placeholder="e.g. 5"
                required
              />
            </div>

            <div className="field">
              <label htmlFor="wasteType">Waste Type</label>
              <select
                id="wasteType"
                name="wasteType"
                value={form.wasteType}
                onChange={onChange}
              >
                <option value="sewage">Sewage</option>
                <option value="household">Household</option>
                <option value="industrial">Industrial</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div className="field">
              <label htmlFor="address">Address</label>
              <input
                id="address"
                name="address"
                value={form.address}
                onChange={onChange}
                placeholder="Meeting point or project address"
              />
            </div>

            <div className="field">
              <label htmlFor="lat">Latitude</label>
              <input
                id="lat"
                name="lat"
                value={form.lat}
                onChange={onChange}
                placeholder="e.g. 19.0760"
              />
            </div>

            <div className="field">
              <label htmlFor="lng">Longitude</label>
              <input
                id="lng"
                name="lng"
                value={form.lng}
                onChange={onChange}
                placeholder="e.g. 72.8777"
              />
            </div>

            <div className="field">
              <label htmlFor="targetDate">Target Date</label>
              <input
                id="targetDate"
                name="targetDate"
                type="date"
                value={form.targetDate}
                onChange={onChange}
              />
            </div>
          </div>

          {/* Photos */}
          <div className="field">
            <label htmlFor="photos">Photos</label>
            <input
              id="photos"
              className="file-input"
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => setPhotos([...e.target.files])}
            />
            {photos.length > 0 && (
              <div className="previews">
                {photos.map((file, i) => (
                  <div key={i} className="preview-item">
                    <img src={URL.createObjectURL(file)} alt={`preview-${i}`} />
                    <div className="preview-name" title={file.name}>
                      {file.name}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit */}
          <div className="actions">
            <button className="btn primary" type="submit">
              Create Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
