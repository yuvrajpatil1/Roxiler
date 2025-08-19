import React from "react";
import {
  CheckCircle,
  Users,
  Star,
  Phone,
  Mail,
  Twitter,
  Linkedin,
  Github,
  Store,
  Search,
  Settings,
  Shield,
  BarChart3,
  User,
} from "lucide-react";
import Mockup from "./components/Mockup";
import { useNavigate } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import SlideInOnScroll from "./components/framer/SlideInOnScroll";
import SlideInOnScrollMockUp from "./components/framer/SlideInOnScrollMockUp";
import AnimatedCounter from "./components/framer/AnimatedCounter";
import { useState } from "react";
import { useEffect } from "react";

function Home() {
  const navigate = useNavigate();
  const ref = useRef(null);
  const [isMounted, setIsMounted] = useState(false);

  // Wait for component to mount before initializing scroll
  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Only initialize useScroll after mounting and ref is available
  const { scrollYProgress } = useScroll(
    isMounted && ref.current
      ? {
          target: ref,
          offset: ["start 80%", "end 20%"],
        }
      : {}
  );

  const y = useTransform(scrollYProgress, [0, 1], [50, 0]);
  const opacity = useTransform(scrollYProgress, [0, 1], [0, 1]);

  return (
    <div className="min-h-dvh max-w-dvw bg-gradient-to-b from-white to-gray-100 text-black">
      <nav className="fixed max-w-full lg:static top-0 left-0 w-full z-50 backdrop-blur-xl lg:border-none lg:backdrop-blur-none lg:bg-transparent bg-gray-100/50 border-b border-gray-100 px-6 py-3 lg:px-12 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl lg:text-4xl font-bold text-black">
            checker.
          </span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 text-sm lg:text-lg rounded-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all duration-300"
            onClick={() => navigate("/register")}
          >
            Get Started
          </button>
        </div>
      </nav>

      <div className="px-6 lg:px-12 py-30 lg:py-20 lg:pb-24">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-18">
            <h1 className="text-4xl lg:text-6xl font-bold pb-8 pt-4 md:pt-16 md:pb-6 bg-gradient-to-r from-purple-800 via-blue-800 to-pink-500 bg-clip-text text-transparent">
              Rate and Discover
              <br />
              Amazing Stores
            </h1>

            <p className="md:text-xl text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
              The ultimate platform for discovering, rating, and managing
              stores. Built with role-based access for users, store owners, and
              administrators.
            </p>

            <div className="flex flex-row gap-4 items-center justify-center mt-6 md:mt-0 mb-10 md:mb-8">
              <button
                className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-2 rounded-lg font-medium text-md lg:text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 flex items-center space-x-2 cursor-pointer"
                onClick={() => navigate("/register")}
              >
                <span className="text-white">Sign Up</span>
              </button>
              <button
                className="border border-gray-600 px-8 py-2 rounded-lg font-medium text-md lg:text-lg hover:border-gray-500 hover:bg-gray-800/50 transition-all duration-300 flex items-center space-x-2 cursor-pointer"
                onClick={() => navigate("/login")}
              >
                <span>Log in</span>
              </button>
            </div>
          </div>

          <SlideInOnScrollMockUp>
            <div className="hidden lg:block relative mx-auto max-w-4xl mb-24">
              <Mockup />
            </div>
          </SlideInOnScrollMockUp>
          <div className="lg:hidden relative mx-auto max-w-4xl mb-24">
            <Mockup />
          </div>
        </div>
      </div>
      <div className="text-center mb-16">
        <h2 className="text-xl lg:text-3xl font-bold mb-4">
          Built with <span className="text-blue-800">Modern Technologies</span>
        </h2>
        <div className="text-center mt-8">
          <div className="overflow-hidden pt-4 md:pt-0 opacity-80">
            <div className="flex animate-marquee space-x-20 whitespace-nowrap">
              <div className="text-6xl text-red-700 font-semibold">ReactJS</div>
              <div className="text-6xl text-amber-600 font-semibold">MySQL</div>
              <div className="text-6xl text-pink-600 font-semibold">
                ExpressJS
              </div>
              <div className="text-6xl text-red-700 font-semibold">ReactJS</div>
              <div className="text-6xl text-amber-600 font-semibold">MySQL</div>
              <div className="text-6xl text-pink-600 font-semibold">
                ExpressJS
              </div>
              <div className="text-6xl text-red-700 font-semibold">ReactJS</div>
              <div className="text-6xl text-amber-600 font-semibold">MySQL</div>
              <div className="text-6xl text-pink-600 font-semibold">
                ExpressJS
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes marquee {
              0% {
                transform: translateX(50%);
              }
              100% {
                transform: translateX(0%);
              }
            }

            .animate-marquee {
              animation: marquee 15s linear infinite;
            }
          `}</style>
        </div>
      </div>

      <div id="features" className="px-6 lg:px-12 pb-16 bg-gray-100">
        <div className="max-w-6xl mx-auto py-12">
          <div className="text-center mb-12">
            <p className="text-sm text-blue-700 font-medium mb-4">
              POWERFUL FEATURES
            </p>
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything you need for{" "}
              <span className="text-blue-700">store management</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-700 max-w-2xl mx-auto">
              From store ratings to user management, experience complete control
              over your platform with role-based access
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <SlideInOnScroll>
              <div className="bg-slate-900  rounded-2xl p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6">
                  <Star className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl text-white font-bold mb-4">
                  Store Ratings
                </h3>
                <p className="text-gray-200 mb-6">
                  Submit and manage ratings from 1 to 5 stars for registered
                  stores. View average ratings and modify your submissions
                  anytime.
                </p>
                <div className="flex items-center space-x-2 text-sm text-sky-500">
                  <CheckCircle className="w-4 h-4" />
                  <span>1-5 star system</span>
                </div>
              </div>
            </SlideInOnScroll>

            <SlideInOnScroll>
              <div className="bg-slate-900  rounded-2xl p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl flex items-center justify-center mb-6">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl text-white font-bold mb-4">
                  Role-Based Access
                </h3>
                <p className="text-gray-200 mb-6">
                  Three distinct user roles - System Admin, Normal User, and
                  Store Owner. Each role has specific permissions and dashboard
                  access.
                </p>
                <div className="flex items-center space-x-2 text-sm text-green-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Secure permissions</span>
                </div>
              </div>
            </SlideInOnScroll>

            <SlideInOnScroll>
              <div className="bg-slate-900  rounded-2xl p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6">
                  <Search className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl text-white font-bold mb-4">
                  Smart Search
                </h3>
                <p className="text-gray-200 mb-6">
                  Find stores easily by name and address. Advanced filtering
                  options for admins to manage users and stores efficiently.
                </p>
                <div className="flex items-center space-x-2 text-sm text-purple-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Advanced filters</span>
                </div>
              </div>
            </SlideInOnScroll>

            <SlideInOnScroll>
              <div className="bg-slate-900  rounded-2xl p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-600 rounded-2xl flex items-center justify-center mb-6">
                  <Settings className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl text-white font-bold mb-4">
                  Admin Dashboard
                </h3>
                <p className="text-gray-200 mb-6">
                  Comprehensive admin panel to manage stores, users, and view
                  analytics. Complete control over platform.
                </p>
                <div className="flex items-center space-x-2 text-sm text-orange-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Full control</span>
                </div>
              </div>
            </SlideInOnScroll>

            <SlideInOnScroll>
              <div className="bg-slate-900  rounded-2xl p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6">
                  <Shield className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl text-white font-bold mb-4">
                  Secure Authentication
                </h3>
                <p className="text-gray-200 mb-6">
                  Robust login system with password validation, secure
                  registration, and password update functionality for all user
                  types.
                </p>
                <div className="flex items-center space-x-2 text-sm text-cyan-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Strong validation</span>
                </div>
              </div>
            </SlideInOnScroll>

            <SlideInOnScroll>
              <div className="bg-slate-900  rounded-2xl p-8">
                <div className="w-16 h-16 bg-gradient-to-r from-yellow-500 to-orange-600 rounded-2xl flex items-center justify-center mb-6">
                  <BarChart3 className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl text-white font-bold mb-4">
                  Analytics & Insights
                </h3>
                <p className="text-gray-200 mb-6">
                  Track total users, stores, and ratings. Store owners can view
                  their average ratings and see who rated their store.
                </p>
                <div className="flex items-center space-x-2 text-sm text-yellow-400">
                  <CheckCircle className="w-4 h-4" />
                  <span>Real-time stats</span>
                </div>
              </div>
            </SlideInOnScroll>
          </div>
        </div>
      </div>

      <div className="text-center mt-8 p-12">
        <h2 className="text-xl lg:text-3xl font-bold mb-4">
          Built for <span className="text-blue-800">Every User Type</span>
        </h2>
        <div className="text-center mt-8">
          <div className="overflow-hidden pt-4 md:pt-0 opacity-80">
            <div className="flex animate-marquee space-x-20 whitespace-nowrap">
              <div className="text-6xl text-red-700 font-semibold">
                Normal User
              </div>
              <div className="text-6xl text-amber-600 font-semibold">
                System Admin
              </div>
              <div className="text-6xl text-pink-600 font-semibold">
                Store Owner
              </div>
              <div className="text-6xl text-red-700 font-semibold">
                Normal User
              </div>
              <div className="text-6xl text-amber-600 font-semibold">
                System Admin
              </div>
              <div className="text-6xl text-pink-600 font-semibold">
                Store Owner
              </div>
              <div className="text-6xl text-red-700 font-semibold">
                Normal User
              </div>
              <div className="text-6xl text-amber-600 font-semibold">
                System Admin
              </div>
              <div className="text-6xl text-pink-600 font-semibold">
                Store Owner
              </div>
            </div>
          </div>

          <style jsx>{`
            @keyframes marquee {
              0% {
                transform: translateX(0%);
              }
              100% {
                transform: translateX(-50%);
              }
            }

            .animate-marquee {
              animation: marquee 15s linear infinite;
            }
          `}</style>
        </div>
      </div>

      <SlideInOnScroll>
        <div className="px-6 lg:px-12 py-16">
          <div className="max-w-4xl mx-auto text-center">
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 rounded-2xl p-12 border border-blue-500/20">
              <h2 className="text-3xl lg:text-4xl font-bold mb-6">
                Ready to build your store rating platform?
              </h2>
              <p className="text-xl text-gray-700 mb-8 max-w-2xl mx-auto">
                Join the future of store discovery and rating. Built with modern
                tech stack and best practices for scalable web applications.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-4">
                <button
                  className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-3 rounded-lg font-medium text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 text-white"
                  onClick={() => navigate("/register")}
                >
                  Get Started
                </button>
                <button
                  className="border border-gray-600 px-8 py-3 rounded-lg font-medium text-lg hover:border-gray-500 hover:bg-gray-800/50 transition-all duration-300"
                  onClick={() => navigate("/demo")}
                >
                  View Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </SlideInOnScroll>

      <footer className="px-6 lg:px-12 py-12 border-t border-gray-200 bg-gray-100">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="col-span-1 md:col-span-1">
              <div className="flex items-center space-x-2 mb-4">
                <span className="text-2xl font-bold">checker.</span>
              </div>
              <p className="text-gray-700 text-sm mb-4 pr-8">
                The ultimate platform for store ratings and management. Built
                with role-based access control for seamless user experience.
              </p>
              <div className="flex space-x-4">
                <Twitter className="w-5 h-5 text-gray-700 hover:text-black cursor-pointer transition-colors" />
                <Linkedin className="w-5 h-5 text-gray-700 hover:text-black cursor-pointer transition-colors" />
                <Github className="w-5 h-5 text-gray-700 hover:text-black cursor-pointer transition-colors" />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 text-sm text-gray-800 mb-4 md:mb-0">
                <span className="hidden md:block">
                  © 2025 checker Platform. All rights reserved.
                </span>
                <span className="md:hidden text-center">
                  © 2025 checker Platform. <br /> All rights reserved.
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-800">
                <div className="flex items-center space-x-2">
                  <span>Built for FullStack Challenge by Yuvraj Patil</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
