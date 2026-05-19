import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Navbar from "./components/Navbar";
import ProtectedRoute from "./components/ProtectedRoute";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import JobList from "./pages/JobList";
import PostJob from "./pages/PostJob";
import MyApplications from "./pages/MyApplications";
import CompanyApplicants from "./pages/CompanyApplicants";
import ProfilePage from "./pages/ProfilePage";
import Notifications from "./pages/Notifications";
import AdminStudents from "./pages/AdminStudents";
import AdminCompanies from "./pages/AdminCompanies";
import AdminJobs from "./pages/AdminJobs";
import Interviews from "./pages/Interviews";
import AdminRegister from "./pages/AdminRegister";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <div className="min-h-screen bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 py-6">
            <Routes>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              <Route path="/dashboard" element={
                <ProtectedRoute><Dashboard /></ProtectedRoute>
              } />
              <Route path="/jobs" element={
                <ProtectedRoute><JobList /></ProtectedRoute>
              } />
              <Route path="/post-job" element={
                <ProtectedRoute roles={["company"]}><PostJob /></ProtectedRoute>
              } />
              <Route path="/my-applications" element={
                <ProtectedRoute roles={["student"]}><MyApplications /></ProtectedRoute>
              } />
              <Route path="/my-applicants" element={
                <ProtectedRoute roles={["company"]}><CompanyApplicants /></ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute><ProfilePage /></ProtectedRoute>
              } />
              <Route path="/notifications" element={
                <ProtectedRoute><Notifications /></ProtectedRoute>
              } />
              <Route path="/interviews" element={
                <ProtectedRoute><Interviews /></ProtectedRoute>
              } />
              <Route path="/admin/students" element={
                <ProtectedRoute roles={["admin"]}><AdminStudents /></ProtectedRoute>
              } />
              <Route path="/admin/companies" element={
                <ProtectedRoute roles={["admin"]}><AdminCompanies /></ProtectedRoute>
              } />
              <Route path="/admin/jobs" element={
                <ProtectedRoute roles={["admin"]}><AdminJobs /></ProtectedRoute>
              } />
              <Route path="/admin/register" element={
                <ProtectedRoute roles={["admin"]}><AdminRegister /></ProtectedRoute>
              } />
            </Routes>
          </div>
        </div>
        <ToastContainer position="top-right" autoClose={3000} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
