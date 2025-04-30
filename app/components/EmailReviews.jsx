'use client';

import React from 'react';
import { supabase } from '@/lib/supabaseClient';
import emailjs from '@emailjs/browser';

// ✅ Load env variables outside the component to avoid runtime issues
const SERVICE_ID = process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID;
const TEMPLATE_ID = process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID;
const PUBLIC_KEY = process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY;

export default function EmailReviews({
  fetchApplication,
  handleCheckApp,
  setLoading,
  email,
  full_name,
  id,
}) {
  async function sendEmail(templateParams, successMessage, updateValue) {
    if (!email) {
      alert('No Email provided!');
      return;
    }

    try {
      setLoading(true);

      const result = await emailjs.send(
        SERVICE_ID,
        TEMPLATE_ID,
        templateParams,
        PUBLIC_KEY
      );
      console.log('EmailJS Result:', result.text);

      const { error } = await supabase
        .from('applications')
        .update({ application_is_accepted: updateValue })
        .eq('id', id);

      if (error) throw error;

      await fetchApplication();
      alert(successMessage);
    } catch (err) {
      alert(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  const GoodReview = async (e) => {
    e.preventDefault();
    await sendEmail(
      {
        to_email: email,
        full_name: full_name,
        message: `Dear ${full_name},

We are pleased to inform you that your application has been successful! After careful consideration, we believe your skills and experience make you a great fit for our team.

We will send you further details regarding the onboarding process shortly.

We are excited to welcome you at MoonDev and look forward to working together.

Congratulations once again!

Best regards,  
MoonDev Team`,
      },
      'Welcome email sent successfully!',
      true
    );
  };

  const BadReview = async (e) => {
    e.preventDefault();
    await sendEmail(
      {
        to_email: email,
        full_name: full_name,
        message: `Dear ${full_name},

Thank you for taking the time to apply at MoonDev. We truly appreciate your interest and the effort you put into your application.

After careful review, we regret to inform you that we have decided to move forward with other candidates whose qualifications more closely align with our current needs.

This was a difficult decision, as we were impressed by your background. We encourage you to apply for future opportunities with us.

We wish you the best in your job search and professional endeavors.

MoonDev Team`,
      },
      'Rejection email sent successfully!',
      false
    );
  };

  return (
    <div className="mt-6 flex justify-center gap-4">
      <button
        className="px-5 py-2 bg-blue-500/20 backdrop-blur-md border border-white/10 text-slate-100 rounded-lg hover:bg-white/20 transition"
        onClick={handleCheckApp}
      >
        Check Application
      </button>

      <button
        className="px-5 py-2 bg-blue-500/20 backdrop-blur-md border border-white/10 text-slate-100 rounded-lg hover:bg-white/20 transition"
        onClick={GoodReview}
      >
        Welcome email review
      </button>

      <button
        className="px-5 py-2 bg-blue-500/20 backdrop-blur-md border border-white/10 text-slate-100 rounded-lg hover:bg-white/20 transition"
        onClick={BadReview}
      >
        Sorry email review
      </button>
    </div>
  );
}
