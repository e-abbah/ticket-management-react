// src/pages/TicketManagement.tsx
import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import toast, { Toaster } from "react-hot-toast";
import type { Ticket, TicketStatus } from "../types/user";
import { useSessionGuard } from "../hooks/useSessionGuard";

// Allowed statuses (validation)
const ALLOWED_STATUSES: TicketStatus[] = ["open", "in_progress", "closed"];

// localStorage key
const STORAGE_KEY = "ticketapp_tickets";

function nowISO() {
  return new Date().toISOString();
}

function statusColor(status: TicketStatus) {
  switch (status) {
    case "open":
      return "bg-green-50 text-green-700";
    case "in_progress":
      return "bg-amber-50 text-amber-700";
    case "closed":
      return "bg-gray-100 text-gray-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
}

export default function TicketManagement() {
  useSessionGuard();
  const navigate = useNavigate();

  // Tickets
  const [tickets, setTickets] = useState<Ticket[]>([]);

  // UI: modal states
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingTicket, setEditingTicket] = useState<Ticket | null>(null);
  const [deleteCandidate, setDeleteCandidate] = useState<Ticket | null>(null);

  // Form state (used for both create & edit)
  const initialForm = { title: "", description: "", status: "open" as TicketStatus, priority: "medium" as "low" | "medium" | "high" };
  const [form, setForm] = useState({
    title: "",
    description: "",
    status: "open" as TicketStatus,
    priority: "medium" as "low" | "medium" | "high",
  });

  // Real-time inline errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Load tickets from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY) || "[]";
      const parsed: Ticket[] = JSON.parse(raw);
      setTickets(parsed);
    } catch (error) {
        console.error("Load tickets error:", error);
      toast.error("Failed to load tickets. Please retry.");
      setTickets([]);
    }
  }, []);

  // Derived stats
  const stats = useMemo(() => {
    const total = tickets.length;
    const open = tickets.filter((t) => t.status === "open").length;
    const resolved = tickets.filter((t) => t.status === "closed").length;
    return { total, open, resolved };
  }, [tickets]);

  // ---------- Validation ----------
  const validate = (values: Partial<typeof form>) => {
    const e: Record<string, string> = {};
    if (values.title !== undefined) {
      if (!values.title.trim()) e.title = "Title is required.";
      else if (values.title.trim().length < 3) e.title = "Title must be at least 3 characters.";
      else if (values.title.trim().length > 120) e.title = "Title must be at most 120 characters.";
    }

    if (values.status !== undefined) {
      if (!ALLOWED_STATUSES.includes(values.status as TicketStatus)) {
        e.status = `Status must be one of: ${ALLOWED_STATUSES.join(", ")}`;
      }
    }

    if (values.description !== undefined) {
      if (values.description && values.description.length > 2000) {
        e.description = "Description is too long (max 2000 chars).";
      }
    }

    if (values.priority !== undefined) {
      const allowed = ["low", "medium", "high"];
      if (!allowed.includes(values.priority)) e.priority = "Invalid priority value.";
    }

    return e;
  };

  // Live validation helper on change
  const handleFormChange = (
    field: keyof typeof form,
    value: string
  ) => {
    const next = { ...form, [field]: value };
    setForm(next);
    // validate the changed field(s)
    setErrors((prev) => ({ ...prev, ...validate({ [field]: value }) }));
  };

  // ---------- CRUD ops ----------
  // Save tickets to localStorage
  const persist = (next: Ticket[]) => {
    try {
      localStorage.setItem("ticketapp_session", JSON.stringify(next));
      setTickets(next);
    } catch (error) {
        console.error("Persist error:", error);
      toast.error("Failed to save tickets. Please try again.");
    }
  };

  // Create
  const handleCreate = () => {
    const validation = validate(form);
    if (Object.keys(validation).length) {
      setErrors(validation);
      toast.error("Please fix the highlighted errors.");
      return;
    }

    const newTicket: Ticket = {
      id: uuidv4(),
      title: form.title.trim(),
      description: form.description?.trim() || "",
      status: form.status,
      priority: form.priority,
      createdAt: nowISO(),
      createdBy: JSON.parse(localStorage.getItem("ticketapp_session") || "null")?.email ?? "unknown",
    };

    const next = [newTicket, ...tickets];
    persist(next);
    toast.success("Ticket created.");
    setShowCreateModal(false);
    setForm(initialForm);
    setErrors({});
  };

  // Edit (open modal)
  const openEdit = (t: Ticket) => {
    setEditingTicket(t);
    setForm({ title: t.title, description: t.description || "", status: t.status, priority: t.priority ?? "medium" });
    setErrors({});
  };

  // Submit edit
  const handleUpdate = () => {
    if (!editingTicket) return;
    const validation = validate(form);
    if (Object.keys(validation).length) {
      setErrors(validation);
      toast.error("Please fix the highlighted errors.");
      return;
    }

    const updated: Ticket = {
      ...editingTicket,
      title: form.title.trim(),
      description: form.description?.trim() || "",
      status: form.status,
      priority: form.priority,
      updatedAt: nowISO(),
    };

    const next = tickets.map((t) => (t.id === updated.id ? updated : t));
    persist(next);
    toast.success("Ticket updated.");
    setEditingTicket(null);
    setForm(initialForm);
    setErrors({});
  };

  // Delete (with confirmation)
  const confirmDelete = (t: Ticket) => setDeleteCandidate(t);

  const handleDelete = () => {
    if (!deleteCandidate) return;
    const next = tickets.filter((t) => t.id !== deleteCandidate.id);
    persist(next);
    toast.success("Ticket deleted.");
    setDeleteCandidate(null);
  };

  // Cancel / logout behavior
  const handleLogout = () => {
    localStorage.removeItem("ticketapp_session");
    navigate("/");
    toast.success("Logged out.");
  };

  // ---------- Render ----------
  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />

      {/* Centered max-width container */}
      <div className="mx-auto w-full max-w-[1440px] px-6 py-8">
        {/* Hero */}
        <header className="relative overflow-hidden rounded-2xl bg-gradient-to from-white to-gray-50 p-8 mb-8">
          {/* Decorative circles */}
          <div aria-hidden className="pointer-events-none absolute -left-10 -top-10 h-40 w-40 rounded-full bg-red-100 opacity-40 blur-xl"></div>
          <div aria-hidden className="pointer-events-none absolute -right-16 top-8 h-28 w-28 rounded-full bg-blue-100 opacity-40 blur-xl"></div>

          <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Ticket Management
              </h1>
              <p className="mt-2 text-gray-600 max-w-xl">
                Create, track and manage tickets. Use this screen to add tickets, edit status, and remove resolved issues.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                className="inline-flex items-center px-4 py-2 rounded-md bg-blue-600 hover:bg-blue-700 text-white font-semibold transition"
                onClick={() => setShowCreateModal(true)}
              >
                + New Ticket
              </button>

              <button
                className="inline-flex items-center px-4 py-2 rounded-md border border-gray-200 bg-white hover:bg-gray-50 text-gray-800"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>

          {/* Wave SVG at bottom */}
          <div className="mt-6">
            <svg viewBox="0 0 1440 120" className="w-full h-20" preserveAspectRatio="none" aria-hidden>
              <path d="M0,40 C360,120 1080,0 1440,60 L1440 120 L0 120 Z" fill="#ffffff"></path>
            </svg>
          </div>
        </header>

        {/* Stats */}
        <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="p-6 bg-white rounded-2xl shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Total Tickets</h3>
            <p className="mt-2 text-2xl font-bold text-gray-900">{stats.total}</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Open Tickets</h3>
            <p className="mt-2 text-2xl font-bold text-yellow-600">{stats.open}</p>
          </div>
          <div className="p-6 bg-white rounded-2xl shadow-sm">
            <h3 className="text-sm font-medium text-gray-500">Resolved Tickets</h3>
            <p className="mt-2 text-2xl font-bold text-green-600">{stats.resolved}</p>
          </div>
        </section>

        {/* Ticket list */}
        <section>
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Tickets</h2>

          {tickets.length === 0 ? (
            <div className="p-8 bg-white rounded-lg shadow-sm text-center text-gray-600">
              No tickets yet — click “New Ticket” to create one.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {tickets.map((t) => (
                <article key={t.id} className="p-4 bg-white rounded-xl shadow-sm flex flex-col">
                  <div className="flex justify-between items-start gap-2">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">{t.title}</h3>
                      <p className="text-sm text-gray-500 mt-1">
                        Created: {new Date(t.createdAt).toLocaleString()}
                      </p>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <span className={`inline-flex items-center gap-2 px-3 py-1 text-sm rounded-full ${statusColor(t.status)}`}>
                        {t.status.replace("_", " ")}
                      </span>
                      <div className="flex gap-2">
                        <button
                          aria-label={`Edit ticket ${t.title}`}
                          onClick={() => openEdit(t)}
                          className="px-3 py-1 rounded-md border border-gray-200 bg-white text-sm hover:bg-gray-50"
                        >
                          Edit
                        </button>
                        <button
                          aria-label={`Delete ticket ${t.title}`}
                          onClick={() => confirmDelete(t)}
                          className="px-3 py-1 rounded-md border border-red-200 text-red-600 bg-white hover:bg-red-50 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>

                  {t.description && <p className="mt-3 text-gray-700">{t.description}</p>}

                  <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                    <div>Priority: {t.priority ?? "medium"}</div>
                    <div>Updated: {t.updatedAt ? new Date(t.updatedAt).toLocaleString() : "-"}</div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </div>

      {/* ---------- Create Modal ---------- */}
      {showCreateModal && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/40" role="dialog" aria-modal="true">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold">Create Ticket</h3>

            <div className="mt-4 grid grid-cols-1 gap-4">
              <label className="text-sm">
                <span className="font-medium">Title</span>
                <input
                  aria-label="Title"
                  className="mt-1 block w-full p-3 border rounded"
                  value={form.title}
                  onChange={(e) => handleFormChange("title", e.target.value)}
                />
                {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
              </label>

              <label className="text-sm">
                <span className="font-medium">Status</span>
                <select
                  aria-label="Status"
                  className="mt-1 block w-full p-3 border rounded"
                  value={form.status}
                  onChange={(e) => handleFormChange("status", e.target.value)}
                >
                  <option value="open">open</option>
                  <option value="in_progress">in_progress</option>
                  <option value="closed">closed</option>
                </select>
                {errors.status && <p className="text-red-600 text-sm mt-1">{errors.status}</p>}
              </label>

              <label className="text-sm">
                <span className="font-medium">Priority</span>
                <select
                  aria-label="Priority"
                  className="mt-1 block w-full p-3 border rounded"
                  value={form.priority}
                  onChange={(e) => handleFormChange("priority", e.target.value)}
                >
                  <option value="low">low</option>
                  <option value="medium">medium</option>
                  <option value="high">high</option>
                </select>
                {errors.priority && <p className="text-red-600 text-sm mt-1">{errors.priority}</p>}
              </label>

              <label className="text-sm">
                <span className="font-medium">Description (optional)</span>
                <textarea
                  aria-label="Description"
                  rows={4}
                  className="mt-1 block w-full p-3 border rounded"
                  value={form.description}
                  onChange={(e) => handleFormChange("description", e.target.value)}
                />
                {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
              </label>

              <div className="flex justify-end gap-3 mt-2">
                <button
                  className="px-4 py-2 rounded-md border bg-white"
                  onClick={() => {
                    setShowCreateModal(false);
                    setForm(initialForm);
                    setErrors({});
                  }}
                >
                  Cancel
                </button>
                <button className="px-4 py-2 rounded-md bg-blue-600 text-white" onClick={handleCreate}>
                  Create
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Edit Modal ---------- */}
      {editingTicket && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/40" role="dialog" aria-modal="true">
          <div className="w-full max-w-lg bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-xl font-semibold">Edit Ticket</h3>

            <div className="mt-4 grid grid-cols-1 gap-4">
              <label className="text-sm">
                <span className="font-medium">Title</span>
                <input
                  aria-label="Title"
                  className="mt-1 block w-full p-3 border rounded"
                  value={form.title}
                  onChange={(e) => handleFormChange("title", e.target.value)}
                />
                {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
              </label>

              <label className="text-sm">
                <span className="font-medium">Status</span>
                <select
                  aria-label="Status"
                  className="mt-1 block w-full p-3 border rounded"
                  value={form.status}
                  onChange={(e) => handleFormChange("status", e.target.value)}
                >
                  <option value="open">open</option>
                  <option value="in_progress">in_progress</option>
                  <option value="closed">closed</option>
                </select>
                {errors.status && <p className="text-red-600 text-sm mt-1">{errors.status}</p>}
              </label>

              <label className="text-sm">
                <span className="font-medium">Priority</span>
                <select
                  aria-label="Priority"
                  className="mt-1 block w-full p-3 border rounded"
                  value={form.priority}
                  onChange={(e) => handleFormChange("priority", e.target.value)}
                >
                  <option value="low">low</option>
                  <option value="medium">medium</option>
                  <option value="high">high</option>
                </select>
                {errors.priority && <p className="text-red-600 text-sm mt-1">{errors.priority}</p>}
              </label>

              <label className="text-sm">
                <span className="font-medium">Description (optional)</span>
                <textarea
                  aria-label="Description"
                  rows={4}
                  className="mt-1 block w-full p-3 border rounded"
                  value={form.description}
                  onChange={(e) => handleFormChange("description", e.target.value)}
                />
                {errors.description && <p className="text-red-600 text-sm mt-1">{errors.description}</p>}
              </label>

              <div className="flex justify-end gap-3 mt-2">
                <button
                  className="px-4 py-2 rounded-md border bg-white"
                  onClick={() => {
                    setEditingTicket(null);
                    setForm(initialForm);
                    setErrors({});
                  }}
                >
                  Cancel
                </button>
                <button className="px-4 py-2 rounded-md bg-blue-600 text-white" onClick={handleUpdate}>
                  Save changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ---------- Delete confirmation ---------- */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/50" role="dialog" aria-modal="true">
          <div className="w-full max-w-md bg-white rounded-2xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold">Delete ticket</h3>
            <p className="mt-2 text-gray-600">Are you sure you want to delete “{deleteCandidate.title}”? This action cannot be undone.</p>

            <div className="mt-4 flex justify-end gap-3">
              <button className="px-4 py-2 rounded-md border bg-white" onClick={() => setDeleteCandidate(null)}>
                Cancel
              </button>
              <button className="px-4 py-2 rounded-md bg-red-600 text-white" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
