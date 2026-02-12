import React from 'react';
import { Camera, LogOut } from 'lucide-react';
// Changed to type-only import
import type { User } from '../../types/memory';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
  actionButton?: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout, actionButton }) => {
  // ... (rest of the component remains the same)
  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-4 flex flex-wrap sm:flex-nowrap gap-3 justify-between items-center">
        <div className="flex items-center space-x-2 min-w-0">
          <Camera className="w-6 h-6 text-purple-600" />
          <span className="text-xl font-bold text-gray-800 truncate">Memory Journal</span>
        </div>
        <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
          {user && <span className="text-sm text-gray-600 hidden sm:inline">{user.email}</span>}
          {actionButton}
          <button
            onClick={onLogout}
            className="p-2 text-gray-600 hover:text-gray-800 transition-colors"
            title="Sign Out"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
