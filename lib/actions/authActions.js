'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData) {
  const username = formData.get('username')?.toString().trim();
  const password = formData.get('password')?.toString().trim();

  if (username === 'admin' && password === 'admin123') {
    // Set cookie for 1 day
    cookies().set({
      name: 'auth_session',
      value: 'authenticated',
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, 
    });
    
    redirect('/');
  }

  redirect('/login?error=true');
}

export async function logout() {
  cookies().delete('auth_session');
  redirect('/login');
}
