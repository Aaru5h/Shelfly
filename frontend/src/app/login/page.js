"use client";
import { useState } from "react";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage("");

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage("Login successful");
        localStorage.setItem("token", data.token);
        window.location.href = "/dashboard";
      } else {
        setMessage(data.msg || "Invalid credentials");
      }
    } catch (err) {
      console.error(err);
      setMessage("Server error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-700">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-100">Login</h1>

        {message && (
          <p className="text-center mb-4 text-sm text-red-400">{message}</p>
        )}

        <form onSubmit={handleLogin}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-gray-100 leading-tight focus:outline-none focus:shadow-outline border-gray-600"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label
              htmlFor="password"
              className="block text-gray-300 text-sm font-bold mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-gray-100 mb-3 leading-tight focus:outline-none focus:shadow-outline border-gray-600"
              placeholder="Enter your password"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline border border-gray-600"
            >
              Log In
            </button>

            <Link
              href="/signup"
              className="inline-block align-baseline font-bold text-sm text-gray-400 hover:text-gray-300"
            >
              Don’t have an account? Sign Up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
