'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { encrypt, decrypt } from './auth';

export async function login(formData: FormData) {
  const email = formData.get('email');
  const password = formData.get('password');

  // This is a mock authentication. In a real app, you'd validate against a database.
  if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
    // Create the session
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
    const session = await encrypt({ user: { email }, expires });

    // Save the session in a cookie
    cookies().set('session', session, { expires, httpOnly: true });
    return { success: true };
  }
  
  // Default credentials for easy setup if env not set
  if (email === 'admin@weekendexpress.com' && password === 'secureadmin123') {
     const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
     const session = await encrypt({ user: { email }, expires });
     cookies().set('session', session, { expires, httpOnly: true });
     return { success: true };
  }

  return { success: false, error: 'Invalid credentials' };
}

export async function logout() {
  // Destroy the session
  cookies().set('session', '', { expires: new Date(0) });
  redirect('/admin/login');
}

export async function getSession() {
  const sessionCookie = cookies().get('session');
  if (!sessionCookie) return null;

  const session = sessionCookie.value;
  if (!session) return null;
  
  return await decrypt(session);
}
