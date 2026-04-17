import React from 'react';
import { motion } from 'framer-motion';
import Sidebar from './Sidebar';
import Navbar from '../common/Navbar';

interface MainLayoutProps {
  children: React.ReactNode;
}

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-950">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <motion.main
        className="flex-1 flex flex-col ml-64"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Navbar */}
        <Navbar />

        {/* Page Content */}
        <motion.div
          className="flex-1 overflow-y-auto mt-16 p-8"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.1 }}
        >
          {children}
        </motion.div>
      </motion.main>
    </div>
  );
};

export default MainLayout;