import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import AdminDashboard from "./components/admin/AdminDashboard";
import UserDashboard from "./components/user/UserDashboard";
import OwnerDashboard from "./components/store-owner/OwnerDashboard";
import Header from "./components/common/Header";
import Home from "./Home";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/admin/*"
            element={
              <>
                <AdminDashboard />
              </>
            }
          />
          <Route
            path="/user/*"
            element={
              <>
                <UserDashboard />
              </>
            }
          />
          <Route
            path="/store-owner/*"
            element={
              <>
                <OwnerDashboard />
              </>
            }
          />
          <Route path="/" element={<Home />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
