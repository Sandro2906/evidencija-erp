import Link from 'next/link';
import { LayoutDashboard, Box, Users, Factory, ArrowRightLeft, Settings, LogOut } from 'lucide-react';
import { logout } from '@/lib/actions/authActions';

const navItems = [
  { name: 'Dashboard', href: '/', icon: LayoutDashboard },
  { name: 'Materijali', href: '/materials', icon: Box },
  { name: 'Dobavljači', href: '/suppliers', icon: Users },
  { name: 'Nabavka', href: '/purchases', icon: ArrowRightLeft },
  { name: 'Proizvodi', href: '/products', icon: Box },
  { name: 'Normativi', href: '/norms', icon: Settings },
  { name: 'Radni nalozi', href: '/work_orders', icon: Factory },
  { name: 'Izlaz robe', href: '/outputs', icon: ArrowRightLeft },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-800 border-r border-slate-700 h-full relative">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-white">Mini ERP</h1>
      </div>
      <nav className="mt-6 flex flex-col gap-1 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white transition-colors"
            >
              <Icon size={20} className="text-slate-400" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
      
      <div className="absolute bottom-0 w-64 p-4 border-t border-slate-700">
        <form action={logout}>
          <button type="submit" className="flex w-full items-center gap-3 px-3 py-2 text-slate-300 rounded-lg hover:bg-slate-700 hover:text-white transition-colors">
            <LogOut size={20} className="text-slate-400" />
            <span className="font-medium">Odjavi se</span>
          </button>
        </form>
      </div>
    </aside>
  );
}
