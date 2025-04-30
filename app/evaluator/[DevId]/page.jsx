"use client";
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import EmailReviews from '@/app/components/EmailReviews';

export default function ApplicationDetail() {
  const router = useRouter();
  const params = useParams();
  const id = params?.DevId;

  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const supabase = createClientComponentClient();

  const fetchApplication = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('applications')
        .select(`*`)
        .eq('id', id)
        .single();

      if (error) throw error;
      setApplication(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!id) {
      setError('No application ID provided');
      setLoading(false);
      return;
    }

    fetchApplication();
  }, [id]);

  async function handleCheckApp(e) {
    e.preventDefault();
    try {
      setLoading(true);
      const { error } = await supabase
        .from('applications')
        .update({ application_status: 'Checked' })
        .eq('id', id);
      if (error) throw error;

      await fetchApplication();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 px-4 sm:px-8 py-8 text-white">
        <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 p-6 sm:p-8 w-full max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-white/10 rounded w-3/4"></div>
            <div className="h-4 bg-white/10 rounded w-1/2"></div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="space-y-6">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="space-y-2">
                    <div className="h-6 bg-white/10 rounded w-1/4"></div>
                    <div className="h-4 bg-white/10 rounded w-3/4"></div>
                  </div>
                ))}
              </div>
              <div className="space-y-6">
                <div className="space-y-2">
                  <div className="h-6 bg-white/10 rounded w-1/4"></div>
                  <div className="flex flex-wrap gap-2">
                    {[...Array(4)].map((_, i) => (
                      <div key={i} className="h-6 bg-white/10 rounded-full w-16"></div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 px-4 sm:px-8 py-8 text-white">
        <div className="bg-red-900/50 p-6 sm:p-8 rounded-xl w-full max-w-2xl mx-auto text-center space-y-4">
          <h3 className="text-xl font-semibold">Error Loading Application</h3>
          <p className="text-red-200">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cyan-600 rounded-md hover:bg-cyan-700 transition w-full sm:w-auto"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!application) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 px-4 sm:px-8 py-8 text-white">
        <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 p-6 sm:p-8 w-full max-w-2xl mx-auto text-center space-y-4">
          <h3 className="text-xl font-semibold">Application Not Found</h3>
          <p className="text-slate-400">The requested application could not be found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 px-4 sm:px-8 py-8 text-white">
      <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 p-6 sm:p-8 w-full max-w-4xl mx-auto space-y-8">
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">{application.full_name || 'No name provided'}</h1>
            <p className="text-slate-400 mt-1">{application.location || 'Location not specified'}</p>
          </div>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm text-center">
              {application.application_status || 'Undefined'}
            </span>
            <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm text-center">
              {application.application_is_accepted != null
                ? application.application_is_accepted
                  ? 'Accepted'
                  : 'Rejected'
                : 'Not reviewed'}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left column */}
          <div className="space-y-6">
            <Section title="Contact">
              <DetailItem label="Email" value={application.email} />
              <DetailItem label="Phone" value={application.phone_number || 'Not provided'} />
              <DetailItem label="Location" value={application.location || 'Not specified'} />
            </Section>

            {application.source_code_url && (
              <Section title="Source Code">
                <a
                  href={application.source_code_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-cyan-400 hover:underline inline-flex items-center gap-1 break-words"
                >
                  View Source Code
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                    <polyline points="15 3 21 3 21 9"></polyline>
                    <line x1="10" y1="14" x2="21" y2="3"></line>
                  </svg>
                </a>
              </Section>
            )}
          </div>

          {/* Right column */}
          <div className="space-y-6">
            {application.hobbies && (
              <Section title="Hobbies">
                <p className="text-slate-200">{application.hobbies}</p>
              </Section>
            )}

            {application.profile_image_url && (
              <Section title="Profile Picture">
                <img
                  src={application.profile_image_url}
                  alt={`${application.full_name}'s Profile`}
                  className="w-full max-w-xs h-auto object-cover rounded border border-black shadow"
                />
              </Section>
            )}
          </div>
        </div>
      </div>

      <EmailReviews
        fetchApplication={fetchApplication}
        handleCheckApp={handleCheckApp}
        setLoading={setLoading}
        email={application?.email}
        full_name={application?.full_name}
        id={application?.id}
      />
    </main>
  );
}

// Reusable components
function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-200 mb-4 border-b border-white/10 pb-2">
        {title}
      </h2>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-1">
      <span className="text-slate-400 font-medium">{label}:</span>
      <span className="text-slate-100 break-words">{value || 'Not provided'}</span>
    </div>
  );
}
