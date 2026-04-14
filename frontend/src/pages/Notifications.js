import { useEffect, useState } from "react";
import api from "../api";

export default function Notifications() {
  const [notes, setNotes] = useState([]);
  useEffect(() => {
    const fetchNotes = async () => {
      const res = await api.get("notifications/", {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      });
      setNotes(res.data);
    };
    fetchNotes();
  }, []);
  return (
    <div className="p-10">
      <h2 className="text-xl mb-4">Notifications</h2>
      {notes.map((n) => (
        <div key={n.id} className="border-b py-2">
          {n.message}
        </div>
      ))}
    </div>
  );
}
