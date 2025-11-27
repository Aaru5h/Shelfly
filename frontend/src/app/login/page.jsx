"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { buildUrl } from "@/lib/http";

const initialState = { email: "", password: "" };

export default function LoginPage() {
  const router = useRouter();
  const [formState, setFormState] = useState(initialState);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormState((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
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
    <div className="flex min-h-screen items-center justify-center bg-[#0d0d0d] px-4">
      <Card className="w-full max-w-md bg-[#111111]">
        <CardHeader>
          <CardTitle className="space-y-2 text-center">
            <p className="text-xs uppercase tracking-[0.4em] text-[#6f6f6f]">
              Shelfly
            </p>
            <p className="text-2xl font-semibold text-[#f5f5f5]">
              Welcome back
            </p>
            <span className="text-sm text-[#b0b0b0]">
              Access your inventory in seconds.
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="mb-4 rounded-md border border-[#3d1c1c] bg-[#1c0f0f] px-4 py-3 text-sm text-[#fdaaaa]">
              {error}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="you@shelfly.com"
                value={formState.email}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="••••••••"
                value={formState.password}
                onChange={handleChange}
                minLength={6}
                required
              />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Signing in..." : "Sign in"}
            </Button>
          </form>

          <p className="mt-6 text-center text-sm text-[#b0b0b0]">
            Need an account?{" "}
            <Link
              href="/signup"
              className="text-[#f5f5f5] underline decoration-[#3b82f6]/50"
            >
              Create one
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
