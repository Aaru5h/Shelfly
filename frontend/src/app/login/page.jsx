"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { buildUrl } from "@/lib/http";

const initialState = { email: "", password: "" };

export default function LoginPage() {
  const router = useRouter();
  const [formState, setFormState] = useState(initialState);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (loading) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch(buildUrl("/auth/login"), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formState),
      });

      const payload = await response.json();

      if (!response.ok) {
        throw new Error(payload?.message || payload?.error || "Login failed");
      }

      localStorage.setItem("token", payload.token);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Unable to log in");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">
          <span className="brand-em">Shelf</span>
          <span className="brand-rest">ly</span>
        </div>
        <h1 className="auth-heading">Welcome back</h1>
        <p className="auth-subheading">Sign in to continue monitoring your inventory.</p>

        {error && <p className="error-banner">{error}</p>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="field-label" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            placeholder="you@work.com"
            autoComplete="email"
            required
            className="field-input"
            value={formState.email}
            onChange={handleChange}
          />

          <label className="field-label" htmlFor="password">
            Password
          </label>
          <div className="password-wrapper">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              autoComplete="current-password"
              required
              className="field-input"
              value={formState.password}
              onChange={handleChange}
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="password-toggle"
            >
              {showPassword ? (
                <svg viewBox="0 0 24 24" className="password-icon">
                  <path
                    d="M12 5c5 0 9.1 2.8 11 7-1.9 4.2-6 7-11 7S2.9 16.2 1 12c1.9-4.2 6-7 11-7zm0 11a4 4 0 100-8 4 4 0 000 8z"
                    fill="currentColor"
                  />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" className="password-icon">
                  <path
                    d="M3.3 2.3l18.4 18.4-1.4 1.4-3.2-3.2c-1.4.7-3 .9-5.1.9-5 0-9.1-2.8-11-7 1.1-2.4 3-4.4 5.3-5.6L1.9 3.7 3.3 2.3zm6.8 6.8A4 4 0 0114.9 14 4 4 0 0110.1 9.1zm2.9-4.1c1.6 0 3 .3 4.4.9l-1.5 1.5A6 6 0 009.5 14.6l-2.1 2.1C4.4 15.3 3.1 13.8 2 12c1.9-4.2 6-7 11-7z"
                    fill="currentColor"
                  />
                </svg>
              )}
            </button>
          </div>

          <button type="submit" className="primary-button" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </button>

          <p className="signin-text">
            Need an account?{" "}
            <Link href="/signup" className="terms-link">
              Create one
            </Link>
          </p>
        </form>
      </div>

      <style jsx>{`
        .auth-page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          padding: 4rem 1.25rem;
          background: radial-gradient(circle at top, #151b2d 0%, #0b0f1f 45%, #060912 100%);
          color: #f4f6ff;
          font-family: "Inter", "SF Pro Display", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
        }

        .auth-card {
          width: 100%;
          max-width: 420px;
          border-radius: 24px;
          background: rgba(15, 17, 27, 0.92);
          padding: 2.6rem 2.4rem;
          box-shadow: 0 24px 48px rgba(4, 6, 14, 0.55);
          border: 1px solid rgba(120, 124, 161, 0.12);
        }

        .auth-brand {
          display: flex;
          justify-content: center;
          font-size: 32px;
          font-weight: 600;
          color: #ffffff;
          margin-bottom: 0.75rem;
          letter-spacing: 0.01em;
        }

        .brand-em {
          font-weight: 700;
          background: linear-gradient(135deg, #ffffff 0%, #e2e6ff 70%);
          -webkit-background-clip: text;
          color: transparent;
        }

        .brand-rest {
          color: #cbd0ff;
          margin-left: 0.2rem;
        }

        .auth-heading {
          text-align: center;
          font-size: 28px;
          font-weight: 600;
          color: #ffffff;
        }

        .auth-subheading {
          text-align: center;
          font-size: 0.95rem;
          margin-top: 0.5rem;
          color: #a0a7c2;
        }

        .error-banner {
          margin-top: 1.5rem;
          border-radius: 12px;
          border: 1px solid rgba(249, 128, 128, 0.25);
          background: rgba(249, 128, 128, 0.12);
          padding: 0.75rem 1rem;
          font-size: 0.86rem;
          color: #ffd9d9;
          text-align: center;
        }

        .auth-form {
          margin-top: 2.5rem;
          display: flex;
          flex-direction: column;
          gap: 1.2rem;
        }

        .field-label {
          font-size: 0.78rem;
          font-weight: 600;
          color: #aeb4d1;
          margin-bottom: 0.35rem;
          letter-spacing: 0.04em;
          text-transform: uppercase;
        }

        .field-input {
          width: 100%;
          height: 52px;
          border-radius: 12px;
          border: 1px solid #2a3144;
          background: #191f2e;
          color: #e8ebff;
          font-size: 0.95rem;
          padding: 0 1rem;
          transition: border 0.2s ease, box-shadow 0.2s ease;
        }

        .field-input::placeholder {
          color: #616a80;
        }

        .field-input:focus {
          outline: none;
          border-color: #7c74ff;
          box-shadow: 0 0 0 2px rgba(124, 116, 255, 0.24);
        }

        .password-wrapper {
          position: relative;
        }

        .password-toggle {
          position: absolute;
          top: 50%;
          right: 0.8rem;
          transform: translateY(-50%);
          height: 32px;
          width: 32px;
          border-radius: 50%;
          border: 1px solid #2a3144;
          background: #151a24;
          color: #8c94ad;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.2s ease;
        }

        .password-toggle:hover {
          border-color: #7c74ff;
          color: #c2c7ff;
        }

        .password-icon {
          width: 18px;
          height: 18px;
        }

        .primary-button {
          height: 52px;
          border-radius: 12px;
          border: none;
          background: #7767ff;
          color: #ffffff;
          font-size: 1rem;
          font-weight: 600;
          letter-spacing: 0.015em;
          cursor: pointer;
          box-shadow: 0 18px 35px rgba(119, 103, 255, 0.3);
          transition: background 0.2s ease, transform 0.2s ease;
        }

        .primary-button:hover {
          background: #6a5cf7;
          transform: translateY(-1px);
        }

        .primary-button:disabled {
          opacity: 0.75;
          cursor: not-allowed;
          transform: none;
        }

        .signin-text {
          font-size: 0.85rem;
          color: #a0a7c2;
          text-align: center;
          margin-top: 0.5rem;
        }

        .terms-link {
          color: #8f7dff;
          font-weight: 600;
          text-decoration: underline;
        }
      `}</style>
    </div>
  );
}
