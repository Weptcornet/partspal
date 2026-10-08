import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, Package, Boxes, SendHorizontal,
  Users, FileText, Wrench
} from 'lucide-react';

const navItems = [
  { name: 'Dashboard',     path: '/',             icon: LayoutDashboard },
  { name: 'Inventory',     path: '/inventory',    icon: Package },
  { name: 'Kit Builder',   path: '/kits',         icon: Boxes },
  { name: 'Issue Items',   path: '/issue',        icon: SendHorizontal },
  { name: 'Who Has What',  path: '/who-has-what', icon: Users },
  { name: 'Audit Log',     path: '/audit-log',    icon: FileText },
];

function Sidebar() {
  const location = useLocation();

  return (
    <aside className="fixed top-0 left-0 h-screen w-[260px] bg-zinc-900 border-r border-zinc-700/50 flex flex-col z-20">
      {/* Logo */}
      <div className="p-6 border-b border-zinc-700/50">
        <Link to="/" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-400 flex items-center justify-center shadow-lg shadow-emerald-500/20">
            <Wrench className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">PartsPal</h1>
            <p className="text-[11px] text-zinc-400 -mt-0.5">Inventory Management</p>
          </div>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = location.pathname === item.path;
          const Icon = item.icon;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? 'bg-emerald-600/20 text-emerald-400 shadow-sm'
                  : 'text-zinc-400 hover:bg-zinc-800 hover:text-zinc-200'
              }`}
            >
              <Icon className={`w-[18px] h-[18px] transition-colors ${
                isActive ? 'text-emerald-400' : 'text-zinc-500 group-hover:text-zinc-300'
              }`} />
              {item.name}
              {isActive && (
                <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-400" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-zinc-700/50">
        <div className="glass-card rounded-lg p-3">
          <p className="text-xs text-zinc-400">Robotics Club</p>
          <p className="text-sm font-medium text-zinc-200 mt-0.5">Lab Inventory v1.0</p>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
