'use client';
import Link from "next/link";
import NoAppsFound from "./NoAppsFound";
import { useEffect, useState } from "react";
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export default function DevApplications() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applications, setApplications] = useState([]);
  const supabase = createClientComponentClient();

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        const { data, error } = await supabase.from('applications').select('*');
        if (error) throw error;
        setApplications(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();

    // Real-time subscription using the new channel API
    const channel = supabase.channel('applications')
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'applications' }, (payload) => {
        setApplications((prevApplications) => [...prevApplications, payload.new]);
      })
      .on('postgres_changes', { event: 'UPDATE', schema: 'public', table: 'applications' }, (payload) => {
        setApplications((prevApplications) => 
          prevApplications.map((app) => app.id === payload.new.id ? payload.new : app)
        );
      })
      .on('postgres_changes', { event: 'DELETE', schema: 'public', table: 'applications' }, (payload) => {
        setApplications((prevApplications) => 
          prevApplications.filter((app) => app.id !== payload.old.id)
        );
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel); // Clean up the subscription
    };
  }, []); // Empty dependency array to run only once when component mounts

  const onRefresh = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('applications').select('*');
      if (error) throw error;
      setApplications(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading && applications.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 p-4 sm:p-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 max-w-6xl mx-auto">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white/5 p-6 rounded-xl border border-white/10 animate-pulse h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 flex items-center justify-center p-4">
        <div className="bg-red-900/50 p-6 rounded-xl w-full max-w-md text-center">
          <h3 className="text-lg sm:text-xl font-semibold mb-2 text-white">Error Loading Applications</h3>
          <p className="text-sm text-red-200 mb-4">{error}</p>
          <button
            onClick={onRefresh}
            className="w-full sm:w-auto px-4 py-2 bg-cyan-600 rounded-md hover:bg-cyan-700 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (applications.length === 0) {
    return <NoAppsFound />;
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 p-4 sm:p-8">
      <div className="max-w-6xl mx-auto mb-6 bg-white/5 backdrop-blur-md rounded-xl p-4 sm:p-6 border border-white/10">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-semibold text-slate-100">Developer Applications</h1>
            <p className="text-sm text-slate-400">
              {applications.length} {applications.length === 1 ? 'application' : 'applications'} found
            </p>
          </div>
          <button
            onClick={onRefresh}
            disabled={loading}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2 bg-cyan-600 rounded-md hover:bg-cyan-700 transition text-white disabled:opacity-50"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`${loading ? 'animate-spin' : ''}`}
            >
              <path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
              <path d="M3 3v5h5" />
              <path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16" />
              <path d="M16 16h5v5" />
            </svg>
            Refresh
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-6xl mx-auto">
        {applications.map((app) => (
          <Link key={app.id} href={`/evaluator/${app.id}`} className="block">
            <div className="group bg-white/5 backdrop-blur-md p-4 sm:p-6 rounded-xl border border-white/10 hover:bg-white/10 transition cursor-pointer h-full">
              <div className="flex flex-col gap-2 mb-4">
                <div className="text-xs text-slate-400">ID: {app.id.slice(0, 8)}</div>
                <h3 className="text-lg font-semibold text-slate-100">
                  {app.full_name || 'No name provided'}
                </h3>
              </div>

              <div className="space-y-3">
                <div>
                  <p className="text-xs text-slate-400">Email</p>
                  <p className="text-sm text-slate-200 truncate">{app.email}</p>
                </div>

                <div>
                  <p className="text-xs text-slate-400">Location</p>
                  <p className="text-sm text-slate-200">{app.location || 'Not specified'}</p>
                </div>

                <div className="flex flex-wrap gap-2 mt-2">
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    app.application_status === 'Checked'
                      ? 'bg-green-500/20 text-green-400'
                      : app.application_status === 'Unchecked'
                      ? 'bg-blue-500/20 text-blue-400'
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {app.application_status}
                  </span>

                  {(app.application_is_accepted != null) ? (
                    app.application_is_accepted ? (
                      <span className="text-xs px-2 py-1 rounded-full bg-green-500/20 text-green-400">Accepted</span>
                    ) : (
                      <span className="text-xs px-2 py-1 rounded-full bg-blue-500/20 text-blue-400">Rejected</span>
                    )
                  ) : (
                    <span className="text-xs px-2 py-1 rounded-full bg-red-500/20 text-red-400">Not Reviewed</span>
                  )}
                </div>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
