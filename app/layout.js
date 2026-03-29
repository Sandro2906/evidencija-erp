import './globals.css';
import Sidebar from '@/components/Sidebar';

export const metadata = {
  title: 'Mini ERP',
  description: 'Aplikacija za vođenje proizvodnje',
};

export default function RootLayout({ children }) {
  return (
    <html lang="sr">
      <body className="flex h-screen bg-gray-50 text-gray-900">
        <Sidebar />
        <main className="flex-1 overflow-y-auto bg-gray-50 p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
