import React, { useState } from "react";
import { Routes, Route } from "react-router-dom";
import Sidebar from "../common/Sidebar";
import RatingsView from "./RatingsView";
import Profile from "../user/Profile";

const OwnerDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const menuItems = [
    { name: "Dashboard", path: "/store-owner" },
    { name: "Profile", path: "/store-owner/profile" },
  ];

  return (
    <div className="flex bg-gray-50">
      <Sidebar
        menuItems={menuItems}
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      <div className="flex-1 overflow-hidden">
        <div className="md:hidden p-4 bg-white border-b border-gray-200">
          <button
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
          <a className="font-bold text-2xl p-3 mb-6" href="/">
            checker.
          </a>
        </div>
        <Routes>
          <Route path="/" element={<RatingsView />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </div>
    </div>
  );
};

export default OwnerDashboard;
