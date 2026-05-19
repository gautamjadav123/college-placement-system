import { useEffect, useState } from "react";
import API from "../api";

export default function Interviews() {
  const [interviews, setInterviews] = useState([]);

  useEffect(() => {
    API.get("interviews/").then((res) => setInterviews(res.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Interviews</h1>
      {interviews.length === 0 ? (
        <p className="text-gray-500">No interviews scheduled.</p>
      ) : (
        <div className="space-y-4">
          {interviews.map((i) => (
            <div key={i.id} className="bg-white p-5 rounded-lg shadow">
              <h2 className="font-semibold">{i.application?.job?.title}</h2>
              <p className="text-sm text-gray-500">Student: {i.application?.student?.username}</p>
              <div className="mt-2 text-sm">
                <p>📅 Date: {new Date(i.date).toLocaleString()}</p>
                <p>📍 Venue: {i.venue}</p>
                {i.notes && <p>📝 Notes: {i.notes}</p>}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
