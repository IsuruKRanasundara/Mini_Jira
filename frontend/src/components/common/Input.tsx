import React from 'react';
import { motion } from 'framer-motion';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  helpText?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, helpText, className, ...props }, ref) => {
    return (
      <motion.div className="w-full" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        {label && (
          <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={`w-full px-4 py-2.5 rounded-lg border-2 border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 dark:focus:ring-blue-900 transition-all duration-200 ${
              icon ? 'pl-10' : ''
            } ${error ? 'border-red-500 focus:border-red-500 focus:ring-red-200 dark:focus:ring-red-900' : ''} ${
              className || ''
            }`}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-600 dark:text-red-400 mt-2">{error}</p>}
        {helpText && !error && (
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{helpText}</p>
        )}
      </motion.div>
    );
  },
);

Input.displayName = 'Input';
export default Input;