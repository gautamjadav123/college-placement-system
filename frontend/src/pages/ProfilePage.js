import { useEffect, useState } from "react";
import API from "../api";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [resumeFile, setResumeFile] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    API.get("profile/").then((res) => {
      setProfile(res.data);
      setForm(res.data);
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    setSaving(true);
    try {
      // Build payload based on role — only send editable fields
      let payload = {};
      if (user.role === "student") {
        payload = {
          phone: form.phone || "",
          branch: form.branch || "",
          cgpa: form.cgpa || 0,
          skills: form.skills || "",
        };
      } else if (user.role === "company") {
        payload = {
          company_name: form.company_name || "",
          company_website: form.company_website || "",
          company_description: form.company_description || "",
        };
      }

      const res = await API.put("profile/", payload);
      setProfile(res.data);
      setForm(res.data);
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      const detail = err.response?.data;
      const msg = typeof detail === "object" ? JSON.stringify(detail) : "Failed to update profile";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleResume = async () => {
    if (!resumeFile) return;
    const fd = new FormData();
    fd.append("resume", resumeFile);
    try {
      const res = await API.post("profile/resume/", fd);
      toast.success("Resume uploaded!");
      setProfile({ ...profile, resume: res.data.resume_url });
    } catch {
      toast.error("Upload failed");
    }
  };

  if (!profile) return <div className="text-center py-10 text-gray-500">Loading profile...</div>;

  const set = (field) => (e) => setForm({ ...form, [field]: e.target.value });

  return (
    <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-lg mt-6">
      <h1 className="text-2xl font-bold mb-6 text-indigo-800">My Profile</h1>

      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">Username</label>
            <p className="font-semibold text-gray-800">{profile.username}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">Email</label>
            <p className="font-semibold text-gray-800">{profile.email}</p>
          </div>
          <div>
            <label className="text-xs text-gray-500 uppercase tracking-wide">Role</label>
            <p className="font-semibold text-gray-800 capitalize">{user.role}</p>
          </div>
        </div>

        {/* ===== STUDENT PROFILE ===== */}
        {user.role === "student" && (
          <>
            {editing ? (
              <div className="space-y-3">
                <input placeholder="Phone" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" value={form.phone || ""} onChange={set("phone")} />
                <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" value={form.branch || ""} onChange={set("branch")}>
                  <option value="">Select Branch</option>
                  <option value="CS">Computer Science</option>
                  <option value="IT">Information Technology</option>
                  <option value="EC">Electronics & Communication</option>
                  <option value="EE">Electrical Engineering</option>
                  <option value="ME">Mechanical Engineering</option>
                  <option value="CE">Civil Engineering</option>
                </select>
                <input type="number" step="0.1" placeholder="CGPA" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" value={form.cgpa || ""} onChange={set("cgpa")} />
                <textarea placeholder="Skills (comma separated)" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" value={form.skills || ""} onChange={set("skills")} />
                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button onClick={() => { setEditing(false); setForm(profile); }} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <p><strong>Branch:</strong> {profile.branch || "Not set"}</p>
                <p><strong>CGPA:</strong> {profile.cgpa}</p>
                <p><strong>Skills:</strong> {profile.skills || "Not set"}</p>
                <p><strong>Phone:</strong> {profile.phone || "Not set"}</p>
                <button onClick={() => setEditing(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium mt-2 transition-colors">
                  Edit Profile
                </button>
              </div>
            )}

            <div className="mt-6 p-4 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-2 text-gray-700">Resume</h3>
              {profile.resume && (
                <a href={profile.resume.startsWith("http") ? profile.resume : `http://localhost:8000${profile.resume}`} target="_blank" rel="noreferrer"
                  className="text-indigo-600 hover:text-indigo-800 underline block mb-2">View Current Resume</a>
              )}
              <div className="flex gap-2 items-center">
                <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setResumeFile(e.target.files[0])} className="text-sm" />
                <button onClick={handleResume} className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors">Upload</button>
              </div>
            </div>
          </>
        )}

        {/* ===== COMPANY / RECRUITER PROFILE ===== */}
        {user.role === "company" && (
          <>
            {editing ? (
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Company Name</label>
                  <input placeholder="Company Name" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" value={form.company_name || ""} onChange={set("company_name")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Website</label>
                  <input placeholder="https://example.com" className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" value={form.company_website || ""} onChange={set("company_website")} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">Company Description</label>
                  <textarea placeholder="Tell us about your company..." rows={4} className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none" value={form.company_description || ""} onChange={set("company_description")} />
                </div>
                <div className="flex gap-2">
                  <button onClick={handleSave} disabled={saving} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium transition-colors disabled:opacity-50">
                    {saving ? "Saving..." : "Save"}
                  </button>
                  <button onClick={() => { setEditing(false); setForm(profile); }} className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-6 py-2 rounded-lg font-medium transition-colors">Cancel</button>
                </div>
              </div>
            ) : (
              <div className="space-y-3 bg-gray-50 p-4 rounded-lg">
                <p><strong className="text-gray-600">Company:</strong> <span className="text-gray-800">{profile.company_name || "Not set"}</span></p>
                <p><strong className="text-gray-600">Website:</strong> <span className="text-gray-800">{profile.company_website || "Not set"}</span></p>
                <p><strong className="text-gray-600">About:</strong> <span className="text-gray-800">{profile.company_description || "Not set"}</span></p>
                <button onClick={() => setEditing(true)} className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-2 rounded-lg font-medium mt-2 transition-colors">
                  Edit Profile
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
