'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setLoading(true);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/signup`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || 'Signup successful!');
        setFormData({ name: '', email: '', password: '' });
        window.location.href = "/dashboard";
      } else {
        setMessage(data.message || 'Signup failed');
      }
    } catch (err) {
      setMessage('Something went wrong. Please try again.');
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-gray-100">
      <div className="bg-gray-800 p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-700">
        <h1 className="text-2xl font-bold text-center mb-6 text-gray-100">Sign Up</h1>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-gray-300 text-sm font-bold mb-2">
              Username
            </label>
            <input
              type="text"
              id="name"
              value={formData.name}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-gray-100 leading-tight focus:outline-none focus:shadow-outline border-gray-600"
              placeholder="Choose a username"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-300 text-sm font-bold mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-gray-100 leading-tight focus:outline-none focus:shadow-outline border-gray-600"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="mb-6">
            <label htmlFor="password" className="block text-gray-300 text-sm font-bold mb-2">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              className="shadow appearance-none border rounded w-full py-2 px-3 bg-gray-700 text-gray-100 mb-3 leading-tight focus:outline-none focus:shadow-outline border-gray-600"
              placeholder="Create a password"
              required
            />
          </div>

          <div className="flex items-center justify-between">
            <button
              type="submit"
              disabled={loading}
              className="bg-gray-700 hover:bg-gray-600 text-gray-100 font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline disabled:opacity-50 border border-gray-600"
            >
              {loading ? 'Signing up...' : 'Sign Up'}
            </button>
            <Link
              href="/login"
              className="inline-block align-baseline font-bold text-sm text-gray-400 hover:text-gray-300"
            >
              Already have an account? Login
            </Link>
          </div>
        </form>

        {message && (
          <p
            className={`mt-4 text-center font-semibold ${
              message.includes('Successfully') ? 'text-green-500' : 'text-red-400'
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
