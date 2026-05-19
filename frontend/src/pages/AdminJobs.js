import { useEffect, useState } from "react";
import API from "../api";
import { toast } from "react-toastify";

export default function AdminJobs() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    API.get("admin/jobs/").then((res) => setJobs(res.data)).catch(() => {});
  }, []);

  const approve = async (id) => {
    try {
      await API.post(`admin/approve/${id}/`);
      toast.success("Job approved!");
      setJobs(jobs.map((j) => (j.id === id ? { ...j, approved: true } : j)));
    } catch {
      toast.error("Failed");
    }
  };

  const reject = async (id) => {
    if (!window.confirm("Delete this job?")) return;
    try {
      await API.post(`admin/reject/${id}/`);
      toast.success("Job rejected!");
      setJobs(jobs.filter((j) => j.id !== id));
    } catch {
      toast.error("Failed");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Jobs (Admin)</h1>
      <div className="space-y-4">
        {jobs.map((job) => (
          <div key={job.id} className="bg-white p-5 rounded-lg shadow">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-lg font-semibold">{job.title}</h2>
                <p className="text-gray-500 text-sm">By: {job.company_name || job.company_username} | CTC: ₹{job.ctc} LPA</p>
                <p className="text-sm mt-1">{job.description}</p>
              </div>
              <div className="flex flex-col gap-2">
                {!job.approved ? (
                  <>
                    <button onClick={() => approve(job.id)} className="bg-green-600 text-white px-4 py-1 rounded text-sm">Approve</button>
                    <button onClick={() => reject(job.id)} className="bg-red-500 text-white px-4 py-1 rounded text-sm">Reject</button>
                  </>
                ) : (
                  <span className="bg-green-100 text-green-700 px-3 py-1 rounded text-sm">Approved ✓</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
