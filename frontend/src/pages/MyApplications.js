import { useEffect, useState } from "react";
import API from "../api";

export default function MyApplications() {
  const [apps, setApps] = useState([]);

  useEffect(() => {
    API.get("my-applications/").then((res) => setApps(res.data)).catch(() => {});
  }, []);

  const statusColor = {
    Applied: "bg-blue-100 text-blue-700",
    Shortlisted: "bg-yellow-100 text-yellow-700",
    Interview: "bg-purple-100 text-purple-700",
    Selected: "bg-green-100 text-green-700",
    Rejected: "bg-red-100 text-red-700",
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">My Applications</h1>
      {apps.length === 0 ? (
        <p className="text-gray-500">No applications yet.</p>
      ) : (
        <div className="space-y-4">
          {apps.map((app) => (
            <div key={app.id} className="bg-white p-5 rounded-lg shadow flex justify-between items-center">
              <div>
                <h2 className="font-semibold text-lg">{app.job?.title}</h2>
                <p className="text-gray-500 text-sm">Applied: {new Date(app.applied_at).toLocaleDateString()}</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColor[app.status] || ""}`}>
                {app.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
