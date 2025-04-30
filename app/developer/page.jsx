

import React from 'react';
import DeveloperForm from './developerForm';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { redirect } from "next/navigation";
import LogoutBtn from '../components/LogoutBtn';



export default async function EvaluatorPage() {
  const supabase = createServerComponentClient({ cookies });
  const { data: { session } } = await supabase.auth.getSession();
  const { data: { user } } = await supabase.auth.getUser();
  
    if (!session) {
      redirect("/");
    }

    if(!user){
      redirect('/')
    }
  
    if(user?.user_metadata?.is_evaluator){
      redirect('/unauthorized');
    }

  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('email', user.email)
    .single();


  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex flex-col items-center justify-center px-4 py-8">
      <nav className="bg-white/5 backdrop-blur-md rounded-xl shadow-lg px-8 py-6 w-full max-w-xl text-white mb-8 border border-white/10">
        <div className="mb-2">
          <h2 className="text-2xl font-semibold text-slate-100 tracking-tight">Welcome {userData.full_name}</h2>
          <p className="text-sm text-slate-400">This is the developer's dashboard</p>
        </div>
        <LogoutBtn />
      </nav>

      <DeveloperForm user = {user} />
      
    </main>
  );
}
