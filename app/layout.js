import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata = {
  title: 'Mini ERP',
  description: 'Aplikacija za vođenje proizvodnje',
};

export default function RootLayout({ children }) {
  return (
    <html lang="sr">
      <body className="flex h-screen bg-slate-900 text-slate-200">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-slate-900 p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
