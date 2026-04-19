import React from 'react';
import { motion } from 'framer-motion';

type ButtonVariant = 'primary' | 'secondary' | 'danger' | 'success' | 'outline';
type ButtonSize = 'sm' | 'md' | 'lg';

type NativeButtonProps = Omit<
  React.ButtonHTMLAttributes<HTMLButtonElement>,
  'onAnimationStart' | 'onAnimationEnd' | 'onDrag' | 'onDragStart' | 'onDragEnd'
>;

interface ButtonProps extends NativeButtonProps {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  icon?: React.ReactNode;
  children: React.ReactNode;
}

const variantStyles: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-600 hover:bg-blue-700 text-white shadow-md hover:shadow-lg',
  secondary:
    'bg-gray-200 hover:bg-gray-300 text-gray-900 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-100 shadow-sm',
  danger:
    'bg-red-600 hover:bg-red-700 text-white shadow-md hover:shadow-lg',
  success:
    'bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg',
  outline:
    'border-2 border-blue-600 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 dark:border-blue-400 dark:text-blue-400',
};

const sizeStyles: Record<ButtonSize, string> = {
  sm: 'px-3 py-2 text-sm rounded-md gap-2',
  md: 'px-4 py-2.5 text-base rounded-lg gap-2',
  lg: 'px-6 py-3 text-lg rounded-lg gap-3',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', isLoading, icon, children, className, disabled, ...props }, ref) => {
    return (
      <motion.button
        ref={ref}
        className={`inline-flex items-center justify-center font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed ${variantStyles[variant]} ${sizeStyles[size]} ${className || ''}`}
        whileHover={{ scale: disabled ? 1 : 1.02 }}
        whileTap={{ scale: disabled ? 1 : 0.98 }}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <motion.span
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
            className="inline-block"
          >
            ⏳
          </motion.span>
        ) : (
          <>
            {icon && <span>{icon}</span>}
            {children}
          </>
        )}
      </motion.button>
    );
  },
);

Button.displayName = 'Button';
export default Button;