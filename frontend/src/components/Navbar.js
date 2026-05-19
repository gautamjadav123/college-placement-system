import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { FaBell, FaSignOutAlt, FaUser, FaBars, FaTimes, FaBriefcase, FaChartBar, FaUsers, FaBuilding, FaClipboardList, FaPlusCircle, FaUserShield } from "react-icons/fa";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  if (!user) return null;

  const isActive = (path) => location.pathname === path;

  const linkClass = (path) =>
    `flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive(path)
        ? "bg-white/20 text-white shadow-sm"
        : "text-indigo-100 hover:bg-white/10 hover:text-white"
    }`;

  const navLinks = (
    <>
      <Link to="/dashboard" className={linkClass("/dashboard")} onClick={() => setMobileOpen(false)}>
        <FaChartBar className="text-xs" /> Dashboard
      </Link>
      <Link to="/jobs" className={linkClass("/jobs")} onClick={() => setMobileOpen(false)}>
        <FaBriefcase className="text-xs" /> Jobs
      </Link>

      {user.role === "student" && (
        <Link to="/my-applications" className={linkClass("/my-applications")} onClick={() => setMobileOpen(false)}>
          <FaClipboardList className="text-xs" /> My Applications
        </Link>
      )}

      {user.role === "company" && (
        <>
          <Link to="/post-job" className={linkClass("/post-job")} onClick={() => setMobileOpen(false)}>
            <FaPlusCircle className="text-xs" /> Post Job
          </Link>
          <Link to="/my-applicants" className={linkClass("/my-applicants")} onClick={() => setMobileOpen(false)}>
            <FaUsers className="text-xs" /> Applicants
          </Link>
        </>
      )}

      {user.role === "admin" && (
        <>
          <Link to="/admin/students" className={linkClass("/admin/students")} onClick={() => setMobileOpen(false)}>
            <FaUsers className="text-xs" /> Students
          </Link>
          <Link to="/admin/companies" className={linkClass("/admin/companies")} onClick={() => setMobileOpen(false)}>
            <FaBuilding className="text-xs" /> Companies
          </Link>
          <Link to="/admin/jobs" className={linkClass("/admin/jobs")} onClick={() => setMobileOpen(false)}>
            <FaBriefcase className="text-xs" /> All Jobs
          </Link>
          <Link to="/admin/register" className={linkClass("/admin/register")} onClick={() => setMobileOpen(false)}>
            <FaUserShield className="text-xs" /> Register Admin
          </Link>
        </>
      )}
    </>
  );

  return (
    <nav className="bg-gradient-to-r from-indigo-700 via-indigo-800 to-purple-900 text-white shadow-xl sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Brand */}
          <Link to="/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-white/20 backdrop-blur rounded-lg flex items-center justify-center text-lg shadow-inner group-hover:bg-white/30 transition-all">
              🎓
            </div>
            <div className="hidden sm:block">
              <p className="text-base font-bold leading-tight tracking-wide">SR Govt. Polytechnic</p>
              <p className="text-[10px] text-indigo-200 font-medium tracking-widest uppercase">Placement Cell</p>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks}
          </div>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            <Link to="/notifications" className="relative p-2 rounded-lg text-indigo-200 hover:bg-white/10 hover:text-white transition-all">
              <FaBell className="text-lg" />
            </Link>
            <Link to="/profile" className="p-2 rounded-lg text-indigo-200 hover:bg-white/10 hover:text-white transition-all">
              <FaUser className="text-lg" />
            </Link>
            <span className="hidden sm:inline-block text-xs font-semibold bg-white/20 backdrop-blur px-3 py-1.5 rounded-full capitalize tracking-wide">
              {user.role}
            </span>
            <button onClick={handleLogout} className="p-2 rounded-lg text-indigo-200 hover:bg-red-500/80 hover:text-white transition-all" title="Logout">
              <FaSignOutAlt className="text-lg" />
            </button>

            {/* Mobile Toggle */}
            <button className="lg:hidden p-2 rounded-lg hover:bg-white/10 transition-all" onClick={() => setMobileOpen(!mobileOpen)}>
              {mobileOpen ? <FaTimes className="text-xl" /> : <FaBars className="text-xl" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-indigo-900/95 backdrop-blur-sm">
          <div className="px-4 py-3 space-y-1">
            {navLinks}
          </div>
        </div>
      )}
    </nav>
  );
}
