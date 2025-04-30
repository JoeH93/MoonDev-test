import Link from "next/link";
import LoginForm from "./LoginForm";

export default function Login() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex flex-col items-center justify-center px-4 py-8">
      <nav className="bg-white/5 backdrop-blur-md rounded-xl shadow-lg px-8 py-6 w-full max-w-xl text-white mb-8 border border-white/10">
        <div className="mb-4">
          <h2 className="text-2xl font-semibold mb-1 tracking-tight text-slate-100">
            Welcome Back
          </h2>
          <p className="text-sm text-slate-400">
            Enter your credentials to access the dashboard.
          </p>
        </div>
        <p className="text-sm text-slate-400">
          Don’t have an account?{" "} 
          <Link
            href="/signup"
            className="underline text-cyan-400 hover:text-cyan-300 transition duration-200"
          >
            Sign up
          </Link>
        </p>
      </nav>

      <LoginForm />
    </main>
  );
}
