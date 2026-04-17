import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';

interface NavItem {
  id: string;
  label: string;
  icon: string;
  path: string;
  badge?: number;
}

const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: '📊', path: '/dashboard' },
  { id: 'applications', label: 'Applications', icon: '📝', path: '/applications' },
  { id: 'interviews', label: 'Interviews', icon: '🎤', path: '/interviews' },
  { id: 'offers', label: 'Offers', icon: '🎉', path: '/offers' },
  { id: 'feed', label: 'Job Feed', icon: '📰', path: '/feed' },
  { id: 'notifications', label: 'Notifications', icon: '🔔', path: '/notifications', badge: 3 },
  { id: 'analytics', label: 'Analytics', icon: '📈', path: '/analytics' },
];

const bottomItems: NavItem[] = [
  { id: 'profile', label: 'Profile', icon: '👤', path: '/profile' },
  { id: 'settings', label: 'Settings', icon: '⚙️', path: '/settings' },
];

const Sidebar: React.FC = () => {


  return (
    <motion.div
      className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-gray-900 to-gray-800 dark:from-gray-950 dark:to-gray-900 border-r border-gray-700 dark:border-gray-800 flex flex-col z-40 shadow-xl"
      initial={{ x: -256 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* Logo */}
      <motion.div className="p-6 border-b border-gray-700 dark:border-gray-800">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-lg"
            whileHover={{ scale: 1.1 }}
          >
            mj
          </motion.div>
          <div>
            <h1 className="font-bold text-white text-lg leading-none">Mini Jira</h1>
            <p className="text-xs text-gray-400 font-medium">Job Tracker</p>
          </div>
        </div>
      </motion.div>

      {/* Main Navigation */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `group relative flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-700/50'
              }`
            }
          >
            <motion.span
              className="text-xl"
              whileHover={{ scale: 1.1 }}
              transition={{ type: 'spring', stiffness: 300 }}
            >
              {item.icon}
            </motion.span>

            <span className="font-medium flex-1">{item.label}</span>

            {item.badge && (
              <motion.span
                className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full min-w-6 text-center"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 300 }}
              >
                {item.badge}
              </motion.span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Bottom Navigation */}
      <nav className="px-3 py-4 space-y-1 border-t border-gray-700 dark:border-gray-800">
        {bottomItems.map((item) => (
          <NavLink
            key={item.id}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-blue-600 text-white shadow-lg'
                  : 'text-gray-300 hover:bg-gray-700 dark:hover:bg-gray-700/50'
              }`
            }
          >
            <span className="text-xl">{item.icon}</span>
            <span className="font-medium">{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </motion.div>
  );
};

export default Sidebar;