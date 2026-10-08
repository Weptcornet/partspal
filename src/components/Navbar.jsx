import { Link, useLocation } from 'react-router-dom';
import { Wrench } from 'lucide-react';

function Navbar() {
  const location = useLocation();
  
  const navLinks = [
    { name: 'Inventory', path: '/' },
    { name: 'Issue Item/Kit', path: '/issue' },
    { name: 'Who Has What', path: '/who-has-what' },
  ];

  return (
    <header className="bg-white shadow-sm sticky top-0 z-10">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 text-emerald-600 font-bold text-xl">
            <Wrench className="w-6 h-6" />
            <span>PartsPal</span>
          </Link>
          <nav className="flex gap-1 md:gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  location.pathname === link.path
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Navbar;
