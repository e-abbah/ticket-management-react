// src/hooks/useSessionGuard.tsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export function useSessionGuard() {
  const navigate = useNavigate();

  useEffect(() => {
    const session = localStorage.getItem("ticketapp_session");
    if (!session) {
        toast.error("You must be logged in to access this page.");
      // Session missing -> redirect to /login
      navigate("/login");
    }
  }, [navigate]);
}
