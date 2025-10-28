import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

interface TicketStats {
  total: number;
  open: number;
  resolved: number;
}

export default function Dashboard() {
  const navigate = useNavigate();
  const [userName, setUserName] = useState<string>("");
  const [stats, setStats] = useState<TicketStats>({
    total: 0,
    open: 0,
    resolved: 0,
  });

  //Fetch logged-in user and simulated ticket data
  useEffect(() => {
    const storedUser = localStorage.getItem("ticketapp_session");
    if (!storedUser) {
      navigate("/login");
      return;
    }

    const user = JSON.parse(storedUser);
    setUserName(user.fullName || "User");

    // Simulated ticket stats — replace with API later
    const fakeTickets = [
      { id: 1, status: "open" },
      { id: 2, status: "resolved" },
      { id: 3, status: "open" },
      { id: 4, status: "resolved" },
    ];

    const total = fakeTickets.length;
    const open = fakeTickets.filter((t) => t.status === "open").length;
    const resolved = fakeTickets.filter((t) => t.status === "resolved").length;

    setStats({ total, open, resolved });
  }, [navigate]);

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("ticketapp_session");
    navigate("/");
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50">
      <div className="w-full max-w-[1440px] p-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-10">
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome, <span className="text-red-600">{userName}</span>
          </h1>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white font-semibold px-5 py-2 rounded-md shadow-sm transition"
          >
            Logout
          </button>
        </div>

        {/* Ticket Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition text-center">
            <h2 className="text-lg font-semibold text-gray-700">Total Tickets</h2>
            <p className="text-3xl font-bold text-gray-900 mt-2">{stats.total}</p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition text-center">
            <h2 className="text-lg font-semibold text-gray-700">Open Tickets</h2>
            <p className="text-3xl font-bold text-yellow-500 mt-2">{stats.open}</p>
          </div>

          <div className="p-6 bg-white rounded-2xl shadow-md hover:shadow-lg transition text-center">
            <h2 className="text-lg font-semibold text-gray-700">Resolved Tickets</h2>
            <p className="text-3xl font-bold text-green-600 mt-2">{stats.resolved}</p>
          </div>
        </div>

        {/* Navigation to Ticket Management */}
        <div className="mt-12 flex justify-center">
          <button
            onClick={() => navigate("/tickets")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md shadow-md transition"
          >
            Go to Ticket Management
          </button>
        </div>
      </div>
    </div>
  );
}
