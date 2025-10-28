export type User = {
  fullName: string;
  email: string;
  password: string;
};

export type TicketStatus = "open" | "in_progress" | "closed";

export type Ticket = {
  id: string; // uuid-ish string
  title: string;
  description?: string;
  status: TicketStatus;
  priority?: "low" | "medium" | "high";
  createdAt: string;
  updatedAt?: string;
  createdBy?: string; // email or name
};