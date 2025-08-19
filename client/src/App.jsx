import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Login from "./components/auth/Login";
import Register from "./components/auth/Register";
import AdminDashboard from "./components/admin/AdminDashboard";
import UserDashboard from "./components/user/UserDashboard";
import OwnerDashboard from "./components/store-owner/OwnerDashboard";
import Header from "./components/common/Header";
import Home from "./Home";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route
              path="/admin/*"
              element={
                <>
                  <Header />
                  <AdminDashboard />
                </>
              }
            />
            <Route
              path="/user/*"
              element={
                <>
                  <Header />
                  <UserDashboard />
                </>
              }
            />
            <Route
              path="/store-owner/*"
              element={
                <>
                  <Header />
                  <OwnerDashboard />
                </>
              }
            />
            <Route path="/" element={<Home />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
