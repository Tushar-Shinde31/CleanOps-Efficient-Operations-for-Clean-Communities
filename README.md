# CleanOps 🚛♻️  
**Efficient Operations for Clean Communities**

---

## 📖 About the Project
**CleanOps** is a Waste Management & Desludging Request System built with the **MERN stack**.  
It enables **citizens** to raise service requests, track desludging progress, and join community waste projects, while **admins** and **operators** manage assignments, monitor operations, and ensure efficient waste management.  

<img width="1536" height="1024" alt="c7ac67c8-873a-4e95-b43d-e0e5a9939672" src="https://github.com/user-attachments/assets/71374076-2ce4-483a-a8ef-dc34e90ec742" />

## ✨ Features

### 👥 Citizen Portal
- 📋 Raise desludging requests with details (name, ward, location, waste type, photos).  
- 📱 Track request status in real-time (Scheduled → In Progress → Completed).  
- 🗂️ View request history and service summaries.  
- 📨 Provide feedback & ratings after service.  
- 📢 Participate in community waste projects.  

### 🧑‍💼 Admin Panel
- 📃 View and filter incoming requests.  
- 📤 Assign requests to operators.  
- 🛠️ Manage service status updates in real-time.  
- 📝 Add notes, photos, and resolution details.  
- 📦 Access full request history & analytics.  
- 🔒 Role-based access (Super Admins, Ward Admins).  

### ⚙️ System Features
- 🔐 JWT-based secure authentication.  
- 🆔 Auto-generated ticket IDs for tracking.  
- 🕐 Full timestamp logs for all actions.  
- 📉 Analytics dashboard (requests per ward, SLA breaches, active operators).  
- 📦 Central MongoDB storage with indexing.  

---

## 🏗️ Tech Stack
- **Frontend:** React.js + Vite + Context API + CSS  
- **Backend:** Node.js + Express.js  
- **Database:** MongoDB (Mongoose)  
- **Auth:** JWT Authentication  
- **Tools:** Thunder Client / Postman for API testing  

---

## 🚀 Getting Started

### 1️⃣ Clone the Repository
```bash
git clone https://github.com/your-username/CleanOps.git
cd CleanOps

```

### 2️⃣ Setup Backend
```bash
cd backend
npm install
npm start
```
Backend will run at http://localhost:5000

3️⃣ Setup Frontend
```bash
cd frontend
npm install
npm run dev
```

---

🔑 User Roles

👤 Citizen → Raise & track requests, join community projects.

🛠️ Operator → Handle assigned requests, update progress.

🏛️ Admin → Manage operators, requests, wards, and oversee analytics.

⭐ Super Admin → System-level controls.

---

🎯 Future Enhancements

📍 Google Maps integration for live location.

🔔 Email / SMS notifications.

📊 Advanced analytics dashboard for admins.

🌐 Multi-language support.

---

🤝 Contributing

Contributions are welcome!
Fork the repo, create a new branch, commit your changes, and open a pull request.

