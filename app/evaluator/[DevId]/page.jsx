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
    console.log('Params:', params);
    if (!id) {
      setError('No application ID provided');
      setLoading(false);
      return;
    }

    fetchApplication();
  }, [id]);


  async function handleCheckApp(e){
    e.preventDefault()
    
    try{
      setLoading(true)
      const { error } = await supabase
        .from('applications')
        .update({ application_status: 'Checked' })
        .eq('id', id)
        if (error) throw error;

        await fetchApplication();
    }catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }


  
  if (loading) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 p-8 text-white">
        <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 p-8 max-w-4xl mx-auto">
          <div className="animate-pulse space-y-6">
            <div className="h-10 bg-white/10 rounded w-3/4"></div>
            <div className="h-4 bg-white/10 rounded w-1/2"></div>
            <div className="grid md:grid-cols-2 gap-8">
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
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 p-8 text-white">
        <div className="bg-red-900/50 p-6 rounded-xl max-w-4xl mx-auto text-center">
          <h3 className="text-xl font-semibold mb-2">Error Loading Application</h3>
          <p className="text-red-200 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-cyan-600 rounded-md hover:bg-cyan-700 transition"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  if (!application) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 p-8 text-white">
        <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 p-8 max-w-4xl mx-auto text-center">
          <h3 className="text-xl font-semibold mb-2">Application Not Found</h3>
          <p className="text-slate-400 mb-4">The requested application could not be found.</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-800 to-gray-900 p-8 text-white">
      <div className="bg-white/5 backdrop-blur-md rounded-xl shadow-lg border border-white/10 p-8 max-w-4xl mx-auto">
        <div className="flex justify-between items-start mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-100">{application.full_name || 'No name provided'}</h1>
            <p className="text-slate-400 mt-2">{application.location || 'Location not specified'}</p>
          </div>
          <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
            {application.application_status || 'Undefined'}
          </span>
          <span className="bg-blue-500/20 text-blue-400 px-3 py-1 rounded-full text-sm">
            {(application.application_is_accepted != null)?application.application_is_accepted? 
              (
                <span>Accepted</span>
              )
              :
              (
                <span>Rejected</span>
              )
              :
              (
                <span>Not reviewed</span>
              )
            }
          </span>
        </div>

        {/* Two-column layout */}
        <div className="grid md:grid-cols-2 gap-8">
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
                  className="text-cyan-400 hover:underline inline-flex items-center gap-1"
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
                  className="w-50 h-50 object-cover rounded border-1 border-black shadow"
                />
              </Section>
              )}
          </div>
        </div>
      </div>    
      <EmailReviews 
        fetchApplication = {fetchApplication}
        handleCheckApp = {handleCheckApp}
        setLoading = {setLoading}
        email = {application?.email}
        full_name = {application?.full_name}
        id = {application?.id}
      />
    </main>
  );
}

// Reusable components with your exact styling
function Section({ title, children }) {
  return (
    <div>
      <h2 className="text-xl font-semibold text-slate-200 mb-4 border-b border-white/10 pb-2">
        {title}
      </h2>
      <div className="space-y-4">
        {children}
      </div>
    </div>
  );
}

function DetailItem({ label, value }) {
  return (
    <div className="flex">
      <span className="w-28 text-slate-400">{label}:</span>
      <span className="text-slate-100">{value || 'Not provided'}</span>
    </div>
  );
}