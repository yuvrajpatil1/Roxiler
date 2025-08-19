import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import RatingsView from "./RatingsView";
import Profile from "../user/Profile";

const OwnerDashboard = () => {
  const menuItems = [
    { name: "Dashboard", path: "/store-owner" },
    { name: "Profile", path: "/store-owner/profile" },
  ];

  return (
    <div className="flex">
      <Sidebar menuItems={menuItems} />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<RatingsView />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
};

export default OwnerDashboard;
