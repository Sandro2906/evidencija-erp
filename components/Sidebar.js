import Link from 'next/link';
import { LayoutDashboard, Box, Users, Factory, ArrowRightLeft, Settings } from 'lucide-react';

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
    <aside className="w-64 bg-white border-r border-gray-200 h-full">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-gray-800">Mini ERP</h1>
      </div>
      <nav className="mt-6 flex flex-col gap-1 px-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Icon size={20} className="text-gray-500" />
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
