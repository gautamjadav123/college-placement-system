import { useState } from "react";
import api from "../api";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    role: "student",
  });
  const navigate = useNavigate();

  const submit = async (e) => {
    e.preventDefault();
    await api.post("register/", form);
    navigate("/");
  };

  return (
    <div className="flex justify-center mt-10">
      <form onSubmit={submit} className="bg-white p-6 shadow-md rounded w-1/3">
        <h2 className="text-xl font-bold mb-4">Register</h2>
        <input
          className="border p-2 mb-2 w-full"
          placeholder="Username"
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          className="border p-2 mb-2 w-full"
          placeholder="Email"
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <input
          className="border p-2 mb-2 w-full"
          placeholder="Password"
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <select
          className="border p-2 mb-4 w-full"
          onChange={(e) => setForm({ ...form, role: e.target.value })}
        >
          <option value="student">Student</option>
          <option value="company">Company</option>
        </select>
        <button className="bg-green-500 text-white px-4 py-2 rounded">
          Register
        </button>
      </form>
    </div>
  );
}
