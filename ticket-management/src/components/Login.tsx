// export function Login() {
//   return (
// <div className="w-full h-screen flex items-center justify-center">
//   <div className="flex flex-col bg-amber-950   p-14 w-[1440px] rounded-lg shadow-lg">
//     <div><h1>Welcome Back</h1></div>
//     <div>
//       <form>
//         <input type="email" placeholder="example@gmail.com" />
//         <input type="password" placeholder="Password" />
//       </form>

//       <button>Login</button>
//     </div>
//     <div>
//       <p>
//         Don't have an account? <a href="#">Sign Up</a>
//       </p>
//     </div>
//   </div>

// </div>
//   );
// }
import { useNavigate } from "react-router-dom";
import type { User } from "../types/user";
import type { Errors } from "../types/signup";
import { useState } from "react";

export default function Login() {
  const navigate = useNavigate();

  // ✅ Step 1: Add form states
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<Errors>({});

  // ✅ Step 2: Validate form
  const validateForm = () => {
    const newErrors: Errors = {};

    if (!email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(email))
      newErrors.email = "Email is invalid";

    if (!password.trim())
      newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // ✅ Step 3: Handle login
  const handleLogin = () => {
    if (!validateForm()) return;

    const users: User[] = JSON.parse(localStorage.getItem("users") || "[]");

    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      alert("Invalid email or password");
      return;
    }

    localStorage.setItem("ticketapp_session", JSON.stringify(user));
    alert("Login successful!");

    
    setEmail("");
    setPassword("");
    setErrors({});
    navigate("/dashboard");

  };

  // ✅ Step 4: Connect inputs to state
  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex flex-col box-border justify-center px-4 items-center w-2/3 max-w-md h-auto rounded-lg bg-white bg-opacity-20 p-10 shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Welcome Back</h1>

        <form className="flex flex-col w-full space-y-4">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            required
            placeholder="example@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}

          <label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            type="password"
            id="password"
            required
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
          />
          {errors.password && (
            <p className="text-red-500 text-sm">{errors.password}</p>
          )}

          <button
            type="button"
            onClick={handleLogin}
            className="w-full bg-red-600 text-white font-semibold py-2 rounded hover:bg-blue-700 transition"
          >
            Login
          </button>
        </form>

        <p className="mt-4 text-sm">
          Don’t have an account?{" "}
          <button
            onClick={() => navigate("/signup")}
            className="text-red-600 hover:underline"
          >
            Sign Up
          </button>
        </p>
      </div>
    </div>
  );
}
