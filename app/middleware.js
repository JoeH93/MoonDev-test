import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const response = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res: response });

  // Fetch the current session
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const pathname = request.nextUrl.pathname;

  if (!session) {
    if (pathname.startsWith('/evaluator') || pathname.startsWith('/developer')) {
      const unauthorizedUrl = new URL('/unauthorized', request.url);
      return NextResponse.rewrite(unauthorizedUrl);
    }
    return response;
  }

  const userEmail = session.user.email;

  const { data: userData, error } = await supabase
    .from('users')
    .select('is_evaluator') // Use the exact column name
    .eq('email', userEmail)
    .single();

  console.log('Raw User Data from Supabase:', userData);
  console.log('Error:', error);

  if (error || !userData) {
    return response;
  }

  const is_evaluator = userData.is_evaluator === true || userData.is_evaluator === 'true' || userData.is_evaluator === 1;

  if (pathname.startsWith('/evaluator') && !is_evaluator) {
    return NextResponse.redirect(new URL('/developer', request.url));
  }

  if (pathname.startsWith('/developer') && is_evaluator) {
    return NextResponse.redirect(new URL('/evaluator', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/evaluator/:path*',
    '/developer/:path*',
    '/login',
    '/unauthorized',
  ],
};

