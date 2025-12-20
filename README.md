# CleanOps

**Efficient Operations for Clean Communities**

---

## About the Project

**CleanOps** is a Waste Management & Desludging Request System built with the **MERN stack**.
It enables **citizens** to raise service requests, track desludging progress, and participate in community waste projects, while **admins** and **operators** manage assignments, monitor operations, and ensure efficient waste management.

**Live Demo:** [https://cleanops-efficient-operations-for-clean.onrender.com/](https://cleanops-efficient-operations-for-clean.onrender.com/)

---

## Features

### Citizen Portal

* Raise desludging requests with details (name, ward, location, waste type, photos).
* Track request status in real time (Scheduled → In Progress → Completed).
* View request history and service summaries.
* Submit feedback and ratings after service completion.
* Participate in community waste projects.

### Admin Panel

* View and filter incoming requests.
* Assign requests to operators.
* Manage and monitor service status updates in real time.
* Add notes, photos, and resolution details.
* Access complete request history and analytics.
* Role-based access control (Super Admins, Ward Admins).

### System Features

* Secure authentication using JWT.
* Auto-generated ticket IDs for request tracking.
* Full timestamp logs for all actions.
* Analytics dashboard (requests per ward, SLA breaches, active operators).
* Centralized MongoDB storage with proper indexing.

---

## Tech Stack

* **Frontend:** React.js, Vite, Context API, CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB (Mongoose)
* **Authentication:** JWT
* **API Testing:** Thunder Client / Postman

---

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/CleanOps.git
cd CleanOps
```

### 2. Setup Backend

```bash
cd backend
npm install
npm start
```

Backend runs at: [http://localhost:5000](http://localhost:5000)

### 3. Setup Frontend

```bash
cd frontend
npm install
npm run dev
```

---

## User Roles

* **Citizen:** Raise and track requests, join community projects.
* **Operator:** Handle assigned requests and update progress.
* **Admin:** Manage operators, requests, wards, and monitor analytics.
* **Super Admin:** System-level configuration and controls.

---

## Future Enhancements

* Google Maps integration for live location tracking.
* Email and SMS notifications.
* Advanced analytics dashboard for administrators.
* Multi-language support.

---

## Contributing

Contributions are welcome.
Fork the repository, create a new branch, commit your changes, and open a pull request.

