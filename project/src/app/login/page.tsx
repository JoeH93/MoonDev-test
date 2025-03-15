"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    signIn("credentials", { email, password })
      .then(() => {
        console.log("Logged in successfully");
      })
      .catch((err) => {
        setError(err.message || "Invalid email or password");
      });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-0">
      <form
        onSubmit={onSubmit}
        className="space-y-6 w-full sm:w-[400px] bg-white p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
          Log In
        </h2>

        <div className="grid w-full items-center gap-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </Label>
          <Input
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id="email"
            type="email"
          />
        </div>

        <div className="grid w-full items-center gap-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Password
          </Label>
          <Input
            className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:outline-none"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            id="password"
            type="password"
          />
        </div>

        {error && (
          <div className="text-red-500 bg-red-100 border border-red-400 p-2 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="w-full">
          <Button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Log In
          </Button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            Don't have an account?{" "}
            <a href="/signup" className="text-blue-600 hover:underline">
              Sign Up
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
