'use client';

import { login } from '@/lib/actions/authActions';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';

function LoginForm() {
  const searchParams = useSearchParams();
  const isError = searchParams.get('error') === 'true';

  return (
    <>
      <h1 className="text-3xl font-bold text-center text-white mb-8">Prijava u ERP</h1>
        
      {isError && (
        <div className="mb-6 bg-red-500/10 border border-red-500 text-red-500 p-3 rounded-lg text-sm text-center">
          Pogrešno korisničko ime ili lozinka.
        </div>
      )}
      
      <form action={login} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Korisničko ime
          </label>
          <input 
            type="text" 
            name="username" 
            required 
            className="w-full text-black bg-slate-50 border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Unesite: admin"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-300 mb-1">
            Lozinka
          </label>
          <input 
            type="password" 
            name="password" 
            required 
            className="w-full text-black bg-slate-50 border border-slate-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Unesite: admin123"
          />
        </div>
        
        <button 
          type="submit" 
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg shadow-sm transition-colors duration-200 mt-2"
        >
          Prijavi Se
        </button>
      </form>
    </>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="bg-slate-800 p-8 rounded-2xl shadow-xl w-full max-w-md border border-slate-700">
        <Suspense fallback={<div className="text-white text-center">Učitavanje...</div>}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
