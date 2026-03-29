'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

export async function login(formData) {
  const username = formData.get('username');
  const password = formData.get('password');

  if (username === 'admin' && password === 'admin123') {
    // Set cookie for 1 day
    cookies().set({
      name: 'auth_session',
      value: 'authenticated',
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, 
    });
    
    redirect('/');
  }

  return { error: 'Pogrešno korisničko ime ili lozinka.' };
}

export async function logout() {
  cookies().delete('auth_session');
  redirect('/login');
}
