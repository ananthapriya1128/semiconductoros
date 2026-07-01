"use client";

import { FormEvent, useEffect, useRef, useState } from "react";

const STATUS_OPTIONS = ["Applied", "OA Sent", "OA Completed", "Interview Scheduled", "Interviewed", "Offer Received", "Rejected"] as const;

type JobApplication = {
  id: string;
  company: string;
  role: string;
  location: string;
  link: string;
  status: (typeof STATUS_OPTIONS)[number];
  appliedDate: string;
  notes: string;
  interviews: { date: string; type: string; notes: string }[];
};

const STORAGE_KEY = "semiconductoros-job-tracker";

export function JobTrackerPanel() {
  const hasHydrated = useRef(false);
  const [jobs, setJobs] = useState<JobApplication[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<Partial<JobApplication>>({
    company: "",
    role: "",
    location: "",
    link: "",
    status: "Applied",
    appliedDate: new Date().toISOString().split("T")[0],
    notes: "",
    interviews: []
  });

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setJobs(JSON.parse(raw));
    } catch {}
    hasHydrated.current = true;
  }, []);

  useEffect(() => {
    if (!hasHydrated.current) return;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
  }, [jobs]);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!formData.company || !formData.role) return;

    if (editingId) {
      setJobs(jobs.map(j => j.id === editingId ? { ...j, ...formData, id: editingId } as JobApplication : j));
      setEditingId(null);
    } else {
      const newJob: JobApplication = {
        ...formData,
        id: Date.now().toString(),
        interviews: formData.interviews || []
      } as JobApplication;
      setJobs([newJob, ...jobs]);
    }

    setShowForm(false);
    setFormData({
      company: "",
      role: "",
      location: "",
      link: "",
      status: "Applied",
      appliedDate: new Date().toISOString().split("T")[0],
      notes: "",
      interviews: []
    });
  }

  function editJob(job: JobApplication) {
    setEditingId(job.id);
    setFormData(job);
    setShowForm(true);
  }

  function deleteJob(id: string) {
    setJobs(jobs.filter(j => j.id !== id));
  }

  const stats = STATUS_OPTIONS.reduce((acc, s) => {
    acc[s] = jobs.filter(j => j.status === s).length;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="glass-card rounded-[28px] p-5">
      <div className="flex items-center justify-between gap-3">
        <div>
          <h2 className="text-lg font-semibold">Job Application Tracker</h2>
          <p className="mt-1 text-sm text-muted">
            Track all your job applications and interviews!
          </p>
        </div>
        <button
          type="button"
          onClick={() => {
            setEditingId(null);
            setFormData({
              company: "",
              role: "",
              location: "",
              link: "",
              status: "Applied",
              appliedDate: new Date().toISOString().split("T")[0],
              notes: "",
              interviews: []
            });
            setShowForm(true);
          }}
          className="rounded-full bg-[linear-gradient(135deg,#3dd598,#2cc689)] px-4 py-2 text-sm font-semibold text-slate-950"
        >
          + Add Job
        </button>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-4">
        {STATUS_OPTIONS.map(status => (
          <div key={status} className="rounded-2xl border border-white/8 bg-white/4 p-3 text-center">
            <p className="text-xs text-muted">{status}</p>
            <p className="mt-1 text-2xl font-bold text-white/90">{stats[status]}</p>
          </div>
        ))}
      </div>

      {showForm && (
        <div className="mt-4 rounded-2xl border border-white/8 bg-white/4 p-4">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold">{editingId ? "Edit Application" : "New Application"}</h3>
            <button type="button" onClick={() => setShowForm(false)} className="text-white/70 hover:text-white">✕</button>
          </div>
          <form className="mt-4 space-y-3" onSubmit={handleSubmit}>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm text-muted">Company</label>
                <input
                  value={formData.company || ""}
                  onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-[#07101d] px-4 py-2 text-sm text-white outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-muted">Role</label>
                <input
                  value={formData.role || ""}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-[#07101d] px-4 py-2 text-sm text-white outline-none"
                />
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm text-muted">Location</label>
                <input
                  value={formData.location || ""}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-[#07101d] px-4 py-2 text-sm text-white outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-muted">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-[#07101d] px-4 py-2 text-sm text-white outline-none"
                >
                  {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className="text-sm text-muted">Applied Date</label>
                <input
                  type="date"
                  value={formData.appliedDate}
                  onChange={(e) => setFormData({ ...formData, appliedDate: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-[#07101d] px-4 py-2 text-sm text-white outline-none"
                />
              </div>
              <div>
                <label className="text-sm text-muted">Job Link</label>
                <input
                  type="url"
                  value={formData.link || ""}
                  onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                  className="mt-1 w-full rounded-2xl border border-white/10 bg-[#07101d] px-4 py-2 text-sm text-white outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-sm text-muted">Notes</label>
              <textarea
                value={formData.notes || ""}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                className="mt-1 w-full min-h-[80px] rounded-2xl border border-white/10 bg-[#07101d] px-4 py-2 text-sm text-white outline-none"
              />
            </div>
            <button type="submit" className="mt-2 w-full rounded-2xl bg-[linear-gradient(135deg,#69a7ff,#8f7cff)] px-4 py-2 font-semibold text-slate-950">
              Save Application
            </button>
          </form>
        </div>
      )}

      <div className="mt-4 space-y-3">
        {jobs.length === 0 && (
          <div className="rounded-2xl border border-white/8 bg-white/4 p-4 text-center text-sm text-muted">
            No applications yet. Start tracking your job search!
          </div>
        )}
        {jobs.map(job => (
          <div key={job.id} className="rounded-2xl border border-white/8 bg-white/4 p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold">{job.company}</p>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      job.status === "Offer Received"
                        ? "bg-[#3dd598]/12 text-[#8af0c8]"
                        : job.status === "Rejected"
                          ? "bg-[#ff5c5c]/12 text-[#ff8a8a]"
                          : "bg-[#ffb65e]/12 text-[#ffd398]"
                    }`}
                  >
                    {job.status}
                  </span>
                </div>
                <p className="text-sm text-muted">{job.role} • {job.location}</p>
                <p className="mt-1 text-xs text-muted">Applied: {new Date(job.appliedDate).toLocaleDateString()}</p>
              </div>
              <div className="flex gap-2">
                {job.link && (
                  <a href={job.link} target="_blank" rel="noopener noreferrer" className="text-sm text-white/70 hover:text-white">
                    🔗
                  </a>
                )}
                <button type="button" onClick={() => editJob(job)} className="text-sm text-white/70 hover:text-white">
                  ✏️
                </button>
                <button type="button" onClick={() => deleteJob(job.id)} className="text-sm text-white/70 hover:text-white">
                  🗑️
                </button>
              </div>
            </div>
            {job.notes && (
              <div className="mt-2 text-sm text-muted">{job.notes}</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
