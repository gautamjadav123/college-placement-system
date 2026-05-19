import { useState } from "react";
import API from "../api";
import { toast } from "react-toastify";
import { FaUserShield } from "react-icons/fa";

export default function AdminRegister() {
  const [form, setForm] = useState({ username: "", email: "", password: "", confirm_password: "" });
  const [loading, setLoading] = useState(false);

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (form.password !== form.confirm_password) {
      toast.error("Passwords do not match");
      return;
    }
    if (form.password.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await API.post("admin/register/", {
        username: form.username,
        email: form.email,
        password: form.password,
      });
      toast.success("Admin account created successfully!");
      setForm({ username: "", email: "", password: "", confirm_password: "" });
    } catch (err) {
      const detail = err.response?.data;
      const msg = typeof detail === "object" ? Object.values(detail).flat().join(", ") : "Registration failed";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 bg-white p-8 rounded-xl shadow-lg">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
          <FaUserShield className="text-indigo-600 text-xl" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-gray-800">Register New Admin</h1>
          <p className="text-sm text-gray-500">Create a new admin account for the placement system</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Username</label>
          <input required placeholder="admin_username" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" value={form.username} onChange={set("username")} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Email</label>
          <input required type="email" placeholder="admin@college.edu" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" value={form.email} onChange={set("email")} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Password</label>
          <input required type="password" placeholder="••••••••" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" value={form.password} onChange={set("password")} />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">Confirm Password</label>
          <input required type="password" placeholder="••••••••" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" value={form.confirm_password} onChange={set("confirm_password")} />
        </div>
        <button type="submit" disabled={loading} className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-lg font-semibold transition-colors disabled:opacity-50">
          {loading ? "Creating..." : "Create Admin Account"}
        </button>
      </form>
    </div>
  );
}
