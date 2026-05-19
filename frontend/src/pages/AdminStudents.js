import { useEffect, useState } from "react";
import API from "../api";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    API.get("admin/students/").then((res) => setStudents(res.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Students</h1>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Branch</th>
              <th className="p-3">CGPA</th>
              <th className="p-3">Skills</th>
              <th className="p-3">Resume</th>
            </tr>
          </thead>
          <tbody>
            {students.map((s) => (
              <tr key={s.id} className="border-t">
                <td className="p-3">{s.user?.username}</td>
                <td className="p-3">{s.user?.email}</td>
                <td className="p-3">{s.branch}</td>
                <td className="p-3">{s.cgpa}</td>
                <td className="p-3">{s.skills}</td>
                <td className="p-3">
                  {s.resume ? (
                    <a href={`http://localhost:8000${s.resume}`} target="_blank" rel="noreferrer" className="text-blue-600">View</a>
                  ) : "N/A"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
