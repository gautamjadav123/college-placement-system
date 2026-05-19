import { useEffect, useState } from "react";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend } from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, ArcElement, Title, Tooltip, Legend);

export default function Dashboard() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    API.get("dashboard/").then((res) => setStats(res.data)).catch(() => {});
  }, []);

  if (!stats) return <div className="text-center py-10">Loading dashboard...</div>;

  const StatCard = ({ title, value, color = "blue" }) => (
    <div className={`bg-white p-6 rounded-lg shadow border-l-4 border-${color}-500`}>
      <p className="text-gray-500 text-sm">{title}</p>
      <p className="text-3xl font-bold mt-1">{value}</p>
    </div>
  );

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">
        Welcome, {user.username}! <span className="text-sm bg-blue-100 text-blue-700 px-2 py-1 rounded">{user.role}</span>
      </h1>

      {/* Student Dashboard */}
      {user.role === "student" && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <StatCard title="Available Jobs" value={stats.total_jobs} />
          <StatCard title="My Applications" value={stats.my_applications} color="green" />
          <StatCard title="Shortlisted" value={stats.shortlisted} color="yellow" />
          <StatCard title="Selected" value={stats.selected} color="emerald" />
          <StatCard title="Interviews" value={stats.interviews} color="purple" />
          <StatCard title="Unread Notifications" value={stats.unread_notifications} color="red" />
        </div>
      )}

      {/* Company Dashboard */}
      {user.role === "company" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard title="Jobs Posted" value={stats.total_jobs_posted} />
            <StatCard title="Approved" value={stats.approved_jobs} color="green" />
            <StatCard title="Pending Approval" value={stats.pending_jobs} color="yellow" />
            <StatCard title="Total Applicants" value={stats.total_applicants} color="purple" />
            <StatCard title="Shortlisted" value={stats.shortlisted} color="orange" />
            <StatCard title="Selected" value={stats.selected} color="emerald" />
          </div>
          {stats.total_jobs_posted > 0 && (
            <div className="mt-6 bg-white p-6 rounded-lg shadow max-w-md">
              <h3 className="font-semibold mb-4">Job Status</h3>
              <Doughnut data={{
                labels: ["Approved", "Pending"],
                datasets: [{ data: [stats.approved_jobs, stats.pending_jobs], backgroundColor: ["#22c55e", "#eab308"] }],
              }} />
            </div>
          )}
        </>
      )}

      {/* Admin Dashboard */}
      {user.role === "admin" && (
        <>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <StatCard title="Total Students" value={stats.total_students} />
            <StatCard title="Total Companies" value={stats.total_companies} color="purple" />
            <StatCard title="Total Jobs" value={stats.total_jobs} color="green" />
            <StatCard title="Pending Approval" value={stats.pending_jobs} color="yellow" />
            <StatCard title="Total Applications" value={stats.total_applications} color="orange" />
            <StatCard title="Selected Students" value={stats.total_selected} color="emerald" />
            <StatCard title="Total Interviews" value={stats.total_interviews} color="indigo" />
            <StatCard title="Notifications" value={stats.unread_notifications} color="red" />
          </div>

          {stats.company_wise_hiring && stats.company_wise_hiring.length > 0 && (
            <div className="mt-6 bg-white p-6 rounded-lg shadow">
              <h3 className="font-semibold mb-4">Company-wise Hiring</h3>
              <Bar data={{
                labels: stats.company_wise_hiring.map((c) => c.job__company__profile__company_name || "Unknown"),
                datasets: [{
                  label: "Students Selected",
                  data: stats.company_wise_hiring.map((c) => c.count),
                  backgroundColor: "#3b82f6",
                }],
              }} options={{ responsive: true }} />
            </div>
          )}
        </>
      )}
    </div>
  );
}
