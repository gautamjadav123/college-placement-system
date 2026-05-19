import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import API from "../api";
import { toast } from "react-toastify";

export default function Register() {
  const [form, setForm] = useState({
    username: "", email: "", password: "", role: "student",
    first_name: "", last_name: "",
  });
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await API.post("register/", form);
      login(res.data);
      toast.success("Registration successful!");
      navigate("/profile");
    } catch (err) {
      const errors = err.response?.data;
      if (errors) {
        Object.values(errors).flat().forEach((msg) => toast.error(String(msg)));
      } else {
        toast.error("Registration failed");
      }
    }
    setLoading(false);
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <input placeholder="First Name" className="p-3 border rounded-lg" value={form.first_name} onChange={set("first_name")} />
            <input placeholder="Last Name" className="p-3 border rounded-lg" value={form.last_name} onChange={set("last_name")} />
          </div>
          <input placeholder="Username" required className="w-full p-3 border rounded-lg" value={form.username} onChange={set("username")} />
          <input type="email" placeholder="Email" required className="w-full p-3 border rounded-lg" value={form.email} onChange={set("email")} />
          <input type="password" placeholder="Password" required className="w-full p-3 border rounded-lg" value={form.password} onChange={set("password")} />
          <select className="w-full p-3 border rounded-lg" value={form.role} onChange={set("role")}>
            <option value="student">Student</option>
            <option value="company">Company / Recruiter</option>
          </select>
          <button type="submit" disabled={loading}
            className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold">
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
        <p className="text-center mt-4 text-gray-600">
          Already have an account? <Link to="/login" className="text-blue-600 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
