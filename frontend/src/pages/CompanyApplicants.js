import { useEffect, useState } from "react";
import API from "../api";
import { toast } from "react-toastify";

export default function CompanyApplicants() {
  const [apps, setApps] = useState([]);
  const [interviewForm, setInterviewForm] = useState({ id: null, date: "", venue: "", notes: "" });

  useEffect(() => {
    API.get("applicants/").then((res) => setApps(res.data)).catch(() => {});
  }, []);

  const updateStatus = async (id, status) => {
    try {
      await API.post(`shortlist/${id}/`, { status });
      toast.success(`Application ${status}`);
      setApps(apps.map((a) => (a.id === id ? { ...a, status } : a)));
    } catch (err) {
      toast.error("Failed to update");
    }
  };

  const scheduleInterview = async () => {
    try {
      await API.post(`interview/schedule/${interviewForm.id}/`, {
        date: interviewForm.date, venue: interviewForm.venue, notes: interviewForm.notes,
      });
      toast.success("Interview scheduled!");
      setInterviewForm({ id: null, date: "", venue: "", notes: "" });
      setApps(apps.map((a) => (a.id === interviewForm.id ? { ...a, status: "Interview" } : a)));
    } catch {
      toast.error("Failed to schedule");
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Applicants</h1>
      {apps.length === 0 ? (
        <p className="text-gray-500">No applicants yet.</p>
      ) : (
        <div className="space-y-4">
          {apps.map((app) => (
            <div key={app.id} className="bg-white p-5 rounded-lg shadow">
              <div className="flex justify-between items-start">
                <div>
                  <h2 className="font-semibold">{app.student?.username} — {app.job?.title}</h2>
                  <p className="text-sm text-gray-500">
                    CGPA: {app.student_profile?.cgpa} | Branch: {app.student_profile?.branch} | Skills: {app.student_profile?.skills}
                  </p>
                </div>
                <span className="text-sm font-medium">{app.status}</span>
              </div>
              <div className="mt-3 flex gap-2 flex-wrap">
                <button onClick={() => updateStatus(app.id, "Shortlisted")}
                  className="bg-yellow-500 text-white px-3 py-1 rounded text-sm">Shortlist</button>
                <button onClick={() => updateStatus(app.id, "Rejected")}
                  className="bg-red-500 text-white px-3 py-1 rounded text-sm">Reject</button>
                <button onClick={() => updateStatus(app.id, "Selected")}
                  className="bg-green-600 text-white px-3 py-1 rounded text-sm">Select</button>
                <button onClick={() => setInterviewForm({ ...interviewForm, id: app.id })}
                  className="bg-purple-600 text-white px-3 py-1 rounded text-sm">Schedule Interview</button>
              </div>

              {interviewForm.id === app.id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg space-y-2">
                  <input type="datetime-local" className="w-full p-2 border rounded" value={interviewForm.date}
                    onChange={(e) => setInterviewForm({ ...interviewForm, date: e.target.value })} />
                  <input placeholder="Venue" className="w-full p-2 border rounded" value={interviewForm.venue}
                    onChange={(e) => setInterviewForm({ ...interviewForm, venue: e.target.value })} />
                  <input placeholder="Notes" className="w-full p-2 border rounded" value={interviewForm.notes}
                    onChange={(e) => setInterviewForm({ ...interviewForm, notes: e.target.value })} />
                  <button onClick={scheduleInterview} className="bg-purple-700 text-white px-4 py-2 rounded">
                    Confirm Interview
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
