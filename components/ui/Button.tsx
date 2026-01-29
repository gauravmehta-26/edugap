import { motion } from 'framer-motion';

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
}

export default function Button({
  children,
  onClick,
  variant = 'primary',
  fullWidth = false,
  disabled = false,
  type = 'button',
}: ButtonProps) {
  const baseClasses = 'px-4 sm:px-6 py-3 sm:py-3.5 rounded-xl font-bold transition-all duration-200 focus:outline-none focus:ring-4 focus:ring-offset-2 text-sm sm:text-base shadow-lg hover:shadow-xl';
  
  const variantClasses = {
    primary: 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 focus:ring-blue-500 disabled:from-gray-300 disabled:to-gray-400 disabled:shadow-md disabled:cursor-not-allowed',
    secondary: 'bg-white text-gray-800 border-2 border-gray-300 hover:bg-gray-50 hover:border-gray-400 focus:ring-gray-500 disabled:bg-gray-100 disabled:shadow-sm disabled:cursor-not-allowed',
  };
  
  const widthClass = fullWidth ? 'w-full' : '';
  
  const className = `${baseClasses} ${variantClasses[variant]} ${widthClass}`;

  return (
    <motion.button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={className}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      transition={{ duration: 0.15 }}
    >
      {children}
    </motion.button>
  );
}
