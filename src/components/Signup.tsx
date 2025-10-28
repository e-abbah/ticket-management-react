// import { useNavigate } from "react-router-dom";
// // import { useState } from "react";
// export default function Signup() {
//     const navigate = useNavigate();
// //   const [fullName, setFullName] = useState("");
// //   const [email, setEmail] = useState("");
// //   const [password, setPassword] = useState("");
// //   const [errors, setErrors] = useState("");

//   return (
//     <div className="flex justify-center items-center min-h-screen bg-gray-100">
//       <div className="flex flex-col box-border justify-center px-4 items-center w-2/3 max-w-md h-auto rounded-lg bg-white bg-opacity-20 p-10 shadow-lg">
//         <h1 className="text-2xl font-bold mb-6">Create Account</h1>
//         <form className="flex flex-col w-full space-y-4">
//           <label htmlFor="fullName" className="text-sm font-medium text-gray-700">
//             Full Name
//           </label>
//           <input
//             type="text"
//             id="fullName"
//             required
//             placeholder="John Doe"
//             className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
//           />
//           <label htmlFor="email" className="text-sm font-medium text-gray-700">Email</label>
//           <input
//             type="email"
//             id="email"
//             required
//             placeholder="example@gmail.com"
//             className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
//           />
//           <label htmlFor="password" className="text-sm font-medium text-gray-700">Password</label>
//           <input
//             type="password"
//             id="password"
//             required
//             placeholder="Password"
//             className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400"
//           />
//           <button
//             type="button"
//             className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-800 transition"
//           >
//             Signup
//           </button>
//         </form>
//         <p className="mt-4 text-sm">
//           Already have an account?{" "}
//          <button onClick= {() => {
//             navigate("/login")
//          }}> <a href="#" className="text-red-600 hover:underline">
//             Login
//           </a></button>
//         </p>
//       </div>
//     </div>
//   );
// }

import { useState } from "react"; // 
import { useNavigate } from "react-router-dom";
import type { Errors } from "../types/signup"; 
import type { User } from "../types/user";  
export default function Signup() {
  const navigate = useNavigate();
  // form state for controlled inputs
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  //error state to show inline validation messages
  const [errors, setErrors] = useState<Errors>({});

  //form validation function
  const validateForm = () => {
    const newErrors: Errors = {};

    if (!fullName.trim()) newErrors.fullName = "Full Name is required"; //
    if (!email.trim()) newErrors.email = "Email is required"; 
    else if (!/^\S+@\S+\.\S+$/.test(email))
      newErrors.email = "Email is invalid";

    if (!password.trim())
      newErrors.password = "Password is required";
    else if (password.length < 6)
      newErrors.password = "Password must be at least 6 characters"; // ✅ ADDED

    setErrors(newErrors); // ✅ ADDED
    return Object.keys(newErrors).length === 0; // ✅ ADDED
  };

  // ✅ ADDED: handler for signup button
  const handleSignup = () => {
    if (!validateForm()) return;

    // 1. Get existing users from localStorage (or empty array)
    const existingUsers = JSON.parse(localStorage.getItem("users") || "[]");

    // 2. Check if the email is already registered
    if (existingUsers.find((user: User) => user.email === email)) {
      alert("Email already registered"); // or toast later
      return;
    }

    // 3. Add new user
    const newUser = { fullName, email, password };
    existingUsers.push(newUser);

    // 4. Save back to localStorage
    localStorage.setItem("users", JSON.stringify(existingUsers));

    // 5. Notify success & redirect
    alert("Signup successful!"); // later replace with toast
    navigate("/login");
  };

  


  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="flex flex-col justify-center items-center w-2/3 max-w-md h-auto rounded-lg bg-white bg-opacity-20 p-10 shadow-lg">
        <h1 className="text-2xl font-bold mb-6">Create Account</h1>
        <form
          className="flex flex-col w-full space-y-4"
          onSubmit={(e) => e.preventDefault()}
        >
          {" "}
          {/* ✅ ADDED: prevent page refresh */}
          <div>
            <label
              htmlFor="fullName"
              className="text-sm font-medium text-gray-700"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName} // ✅ ADDED
              onChange={(e) => setFullName(e.target.value)} // ✅ ADDED
              placeholder="John Doe"
              className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 w-full"
            />
            {errors.fullName && (
              <p className="text-red-600 text-sm mt-1">{errors.fullName}</p>
            )}{" "}
            {/* ✅ ADDED inline error */}
          </div>
          <div>
            <label
              htmlFor="email"
              className="text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email} // ✅ ADDED
              onChange={(e) => setEmail(e.target.value)} // ✅ ADDED
              placeholder="example@gmail.com"
              className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 w-full"
            />
            {errors.email && (
              <p className="text-red-600 text-sm mt-1">{errors.email}</p>
            )}{" "}
            {/* ✅ ADDED inline error */}
          </div>
          <div>
            <label
              htmlFor="password"
              className="text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password} // ✅ ADDED
              onChange={(e) => setPassword(e.target.value)} // ✅ ADDED
              placeholder="Password"
              className="p-3 rounded border border-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400 w-full"
            />
            {errors.password && (
              <p className="text-red-600 text-sm mt-1">{errors.password}</p>
            )}{" "}
            {/* ✅ ADDED inline error */}
          </div>
          <button
            type="button"
            onClick={handleSignup} // ✅ ADDED: hook up the handler
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded hover:bg-blue-800 transition"
          >
            Signup
          </button>
        </form>

        <p className="mt-4 text-sm">
          Already have an account?{" "}
          <button
            onClick={() => navigate("/login")}
            className="text-red-600 hover:underline"
          >
            Login
          </button>
        </p>
      </div>
    </div>
  );
}
