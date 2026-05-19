import { useEffect, useState } from "react";
import API from "../api";
import { toast } from "react-toastify";

export default function Notifications() {
  const [notes, setNotes] = useState([]);

  useEffect(() => {
    API.get("notifications/").then((res) => setNotes(res.data)).catch(() => {});
  }, []);

  const markAllRead = async () => {
    await API.post("notifications/read/");
    setNotes(notes.map((n) => ({ ...n, is_read: true })));
    toast.success("All marked as read");
  };

  const typeIcon = { info: "ℹ️", job: "💼", application: "📝", interview: "📅" };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button onClick={markAllRead} className="text-blue-600 hover:underline text-sm">
          Mark all as read
        </button>
      </div>
      {notes.length === 0 ? (
        <p className="text-gray-500">No notifications.</p>
      ) : (
        <div className="space-y-3">
          {notes.map((n) => (
            <div key={n.id} className={`p-4 rounded-lg shadow ${n.is_read ? "bg-white" : "bg-blue-50 border-l-4 border-blue-500"}`}>
              <p>
                <span className="mr-2">{typeIcon[n.notification_type] || "📢"}</span>
                {n.message}
              </p>
              <p className="text-xs text-gray-400 mt-1">{new Date(n.created_at).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
