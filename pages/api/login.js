import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { user_name: email, Password: password } = req.body;

  try {
    // 1. Authenticate with Supabase
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) throw error;

    // 2. Check if email is verified
    if (!data.user.email_confirmed_at) {
      return res.status(403).json({ 
        message: 'Please verify your email before logging in',
        needsVerification: true
      });
    }

    // 3. Get additional user data from your users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('IsEvaluator')
      .eq('email', email)
      .single();

    if (userError) throw userError;

    return res.status(200).json({ 
      user: {
        IsEvaluator: userData.IsEvaluator
      }
    });

  } catch (error) {
    return res.status(400).json({ 
      message: error.message || 'Login failed' 
    });
  }
}