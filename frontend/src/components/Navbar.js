import { Link } from "react-router-dom";

export default function Navbar() {
  return (
    <nav className="bg-blue-600 text-white p-4 flex justify-between">
      <div className="font-bold">College Placement System</div>
      <div className="flex gap-4">
        <Link to="/jobs">Jobs</Link>
        <Link to="/notifications">Notifications</Link>
        <Link to="/dashboard">Dashboard</Link>
      </div>
    </nav>
  );
}
