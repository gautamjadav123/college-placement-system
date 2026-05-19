import { useEffect, useState } from "react";
import API from "../api";

export default function AdminCompanies() {
  const [companies, setCompanies] = useState([]);

  useEffect(() => {
    API.get("admin/companies/").then((res) => setCompanies(res.data)).catch(() => {});
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">All Companies</h1>
      <div className="bg-white rounded-lg shadow overflow-x-auto">
        <table className="w-full text-left">
          <thead className="bg-gray-50">
            <tr>
              <th className="p-3">Username</th>
              <th className="p-3">Company Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Website</th>
              <th className="p-3">Description</th>
            </tr>
          </thead>
          <tbody>
            {companies.map((c) => (
              <tr key={c.id} className="border-t">
                <td className="p-3">{c.user?.username}</td>
                <td className="p-3">{c.company_name}</td>
                <td className="p-3">{c.user?.email}</td>
                <td className="p-3">
                  {c.company_website ? (
                    <a href={c.company_website} target="_blank" rel="noreferrer" className="text-blue-600">{c.company_website}</a>
                  ) : "N/A"}
                </td>
                <td className="p-3">{c.company_description || "N/A"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
