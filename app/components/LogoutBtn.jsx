'use client';

import { supabase } from "@/lib/supabaseClient";

export default function LogoutButton() {
  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  return (
    <button
      onClick={handleLogout}
      className="w-full sm:w-auto flex justify-center items-center py-2 sm:py-3 px-4 sm:px-6 border border-transparent rounded-md shadow-sm text-sm sm:text-base font-medium text-white bg-cyan-600 hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500 transition-all duration-200"
    >
      Logout
    </button>
  );
}
