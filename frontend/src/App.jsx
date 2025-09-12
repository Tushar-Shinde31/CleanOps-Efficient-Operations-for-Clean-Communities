import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";

// Citizen
import RaiseRequest from "./pages/citizen/RaiseRequest.jsx";
import MyRequests from "./pages/citizen/MyRequests.jsx";
import RequestDetails from "./pages/citizen/RequestDetails.jsx";

// Community
import CommunityList from "./pages/community/CommunityList.jsx";
import CommunityCreate from "./pages/community/CommunityCreate.jsx";
import CommunityDetails from "./pages/community/CommunityDetails.jsx";

// Operator
import OperatorAssigned from "./pages/operator/OperatorAssigned.jsx";

// Admin
import AdminRequests from "./pages/admin/AdminRequests.jsx";
import AdminDashboard from "./pages/admin/AdminDashboard.jsx";
import AdminAnalytics from "./pages/admin/AdminAnalytics.jsx";
import AdminOperators from "./pages/admin/AdminOperators.jsx";

import "./App.css";

export default function App() {
  return (
    <div className="app">
      <Navbar />
      <main className="container">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Community */}
          <Route path="/community" element={<CommunityList />} />
          <Route
            path="/community/create"
            element={
              <ProtectedRoute roles={["citizen", "wardAdmin", "superAdmin"]}>
                <CommunityCreate />
              </ProtectedRoute>
            }
          />
          <Route path="/community/:id" element={<CommunityDetails />} />

          {/* Citizen */}
          <Route
            path="/raise-request"
            element={
              <ProtectedRoute roles={["citizen"]}>
                <RaiseRequest />
              </ProtectedRoute>
            }
          />
          <Route
            path="/my-requests"
            element={
              <ProtectedRoute roles={["citizen"]}>
                <MyRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/requests/:id"
            element={
              <ProtectedRoute
                roles={["citizen", "operator", "wardAdmin", "superAdmin"]}
              >
                <RequestDetails />
              </ProtectedRoute>
            }
          />

          {/* Operator */}
          <Route
            path="/operator/assigned"
            element={
              <ProtectedRoute roles={["operator"]}>
                <OperatorAssigned />
              </ProtectedRoute>
            }
          />

          {/* Admin */}
          <Route
            path="/admin/requests"
            element={
              <ProtectedRoute roles={["wardAdmin", "superAdmin"]}>
                <AdminRequests />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute roles={["wardAdmin", "superAdmin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/analytics"
            element={
              <ProtectedRoute roles={["wardAdmin", "superAdmin"]}>
                <AdminAnalytics />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/operators"
            element={
              <ProtectedRoute roles={["superAdmin", "wardAdmin"]}>
                <AdminOperators />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}
