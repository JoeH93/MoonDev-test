import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password, fullName, phoneNumber, isEvaluator } = req.body;

  try {
    // 1. Sign up user with Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: fullName,
          phone_number: phoneNumber,
          is_evaluator: isEvaluator,
        },
        emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify`,
      },
    });

    if (authError) throw authError;

    // 2. Insert additional user data into your users table
    const { error: dbError } = await supabase
      .from('users')
      .insert({
        email,
        full_name: fullName,
        phoneNumber,
        IsEvaluator: isEvaluator,
        auth_user_id: authData.user?.id
      });

    if (dbError) throw dbError;

    return res.status(200).json({ 
      message: 'Signup successful! Please check your email for verification.' 
    });

  } catch (error) {
    return res.status(400).json({ 
      message: error.message || 'Signup failed' 
    });
  }
}