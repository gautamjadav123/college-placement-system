import { useEffect, useState } from "react";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function JobList() {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("jobs/").then((res) => { setJobs(res.data); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  const apply = async (id) => {
    try {
      await API.post(`apply/${id}/`);
      toast.success("Applied successfully!");
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to apply");
    }
  };

  if (loading) return <div className="text-center py-10">Loading jobs...</div>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        {user.role === "company" ? "My Posted Jobs" : "Available Jobs"}
      </h1>

      {jobs.length === 0 ? (
        <p className="text-gray-500">No jobs available.</p>
      ) : (
        <div className="grid gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="bg-white p-6 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="text-xl font-semibold">{job.title}</h2>
                  <p className="text-gray-500">{job.company_name || job.company_username}</p>
                </div>
                <div className="text-right">
                  <span className="text-lg font-bold text-green-600">₹{job.ctc} LPA</span>
                  {!job.approved && (
                    <span className="block text-xs bg-yellow-100 text-yellow-700 px-2 py-1 rounded mt-1">Pending</span>
                  )}
                </div>
              </div>
              <p className="mt-2 text-gray-700">{job.description}</p>
              <div className="mt-3 flex flex-wrap gap-2 text-sm text-gray-600">
                <span>📊 Min CGPA: {job.eligibility_cgpa}</span>
                {job.eligible_branches && <span>🏫 Branches: {job.eligible_branches}</span>}
                {job.skills_required && <span>🛠 Skills: {job.skills_required}</span>}
                <span>👥 Positions: {job.max_positions}</span>
                <span>📝 Applicants: {job.applicant_count}</span>
                {job.last_date && <span>📅 Last Date: {job.last_date}</span>}
              </div>
              {user.role === "student" && (
                <button onClick={() => apply(job.id)}
                  className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
                  Apply Now
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
