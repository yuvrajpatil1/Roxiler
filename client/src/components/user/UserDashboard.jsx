import React from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import StoreList from "./StoreList";
import Profile from "./Profile";

const UserDashboard = () => {
  const menuItems = [
    { name: "Stores", path: "/user" },
    { name: "Profile", path: "/user/profile" },
  ];

  return (
    <div className="flex">
      <Sidebar menuItems={menuItems} />
      <div className="flex-1">
        <Routes>
          <Route path="/" element={<StoreList />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
};

export default UserDashboard;
