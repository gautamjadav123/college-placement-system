import { useEffect, useState } from "react";
import api from "../api";

export default function JobList() {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    const fetchJobs = async () => {
      const res = await api.get("jobs/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setJobs(res.data);
    };
    fetchJobs();
  }, []);

  const apply = async (id) => {
    await api.post(
      `apply/${id}/`,
      {},
      { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } },
    );
    alert("Applied Successfully!");
  };

  return (
    <div className="p-10">
      <h1 className="text-2xl mb-6">Available Jobs</h1>
      {jobs.map((job) => (
        <div key={job.id} className="border p-4 mb-4 rounded">
          <h3 className="text-lg font-bold">{job.title}</h3>
          <p>{job.description}</p>
          <button
            onClick={() => apply(job.id)}
            className="bg-blue-500 text-white px-3 py-1 mt-2 rounded"
          >
            Apply
          </button>
        </div>
      ))}
    </div>
  );
}
