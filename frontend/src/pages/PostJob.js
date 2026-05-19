import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api";
import { toast } from "react-toastify";

export default function PostJob() {
  const [form, setForm] = useState({
    title: "", description: "", ctc: "", eligibility_cgpa: "0",
    eligible_branches: "", skills_required: "", max_positions: "1", last_date: "",
  });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await API.post("jobs/", form);
      toast.success("Job posted! Waiting for admin approval.");
      navigate("/jobs");
    } catch (err) {
      toast.error("Failed to post job");
    }
  };

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-6">Post New Job</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input placeholder="Job Title" required className="w-full p-3 border rounded-lg" value={form.title} onChange={set("title")} />
        <textarea placeholder="Job Description" required rows={4} className="w-full p-3 border rounded-lg" value={form.description} onChange={set("description")} />
        <div className="grid grid-cols-2 gap-4">
          <input type="number" step="0.01" placeholder="CTC (LPA)" required className="p-3 border rounded-lg" value={form.ctc} onChange={set("ctc")} />
          <input type="number" step="0.1" placeholder="Min CGPA" className="p-3 border rounded-lg" value={form.eligibility_cgpa} onChange={set("eligibility_cgpa")} />
        </div>
        <input placeholder="Eligible Branches (CS,IT,EC)" className="w-full p-3 border rounded-lg" value={form.eligible_branches} onChange={set("eligible_branches")} />
        <input placeholder="Skills Required" className="w-full p-3 border rounded-lg" value={form.skills_required} onChange={set("skills_required")} />
        <div className="grid grid-cols-2 gap-4">
          <input type="number" placeholder="Max Positions" className="p-3 border rounded-lg" value={form.max_positions} onChange={set("max_positions")} />
          <input type="date" placeholder="Last Date" className="p-3 border rounded-lg" value={form.last_date} onChange={set("last_date")} />
        </div>
        <button type="submit" className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 font-semibold">
          Post Job
        </button>
      </form>
    </div>
  );
}
