"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { supabase } from '@/utils/supabase';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isEvaluator, setIsEvaluator] = useState(false);
  const [error, setError] = useState("");

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); // Reset error state

    if (!email || !password) {
      setError("Please provide both email and password.");
      return;
    }

    try {
      // Sign up the user with Supabase authentication
      const { data, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) {
        throw new Error(authError.message);
      }

      const user = data.user;

      if (!user) {
        throw new Error("User registration failed.");
      }

      // Insert user into the database
      const { error: dbError } = await supabase
        .from("users")
        .insert([
          {
            email,
            password,
            isEvaluator,
          },
        ]);

      if (dbError) {
        throw new Error(dbError.message);
      }

      // Log the user in automatically after successful sign-up
      await signIn("credentials", { email, password });

      console.log("User signed up and logged in successfully");

    } catch (err: any) {
      console.error("Signup error:", err);
      setError(err.message || "An error occurred. Please try again.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-0">
      <form
        onSubmit={onSubmit}
        className="space-y-6 w-full sm:w-[400px] bg-white p-8 rounded-lg shadow-lg"
      >
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-4">
          Sign Up
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

        {/* Evaluator selection */}
        <div className="grid w-full items-center gap-2 mt-4">
          <Label htmlFor="is_evaluator" className="text-sm font-medium text-gray-700">
            Are you an Evaluator?
          </Label>
          <input
            type="checkbox"
            id="is_evaluator"
            checked={isEvaluator}
            onChange={(e) => setIsEvaluator(e.target.checked)}
            className="p-2"
          />
          <span className="text-sm text-gray-600">Check this box if you're an evaluator.</span>
        </div>

        {error && (
          <div className="text-red-500 bg-red-100 border border-red-400 p-2 rounded-md text-sm">
            {error}
          </div>
        )}

        <div className="w-full">
          <Button className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500">
            Sign Up
          </Button>
        </div>

        <div className="mt-4 text-center text-sm text-gray-600">
          <p>
            Already have an account?{" "}
            <a href="/login" className="text-blue-600 hover:underline">
              Log In
            </a>
          </p>
        </div>
      </form>
    </div>
  );
}
