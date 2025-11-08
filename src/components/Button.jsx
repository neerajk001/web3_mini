const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  fullWidth = false,
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props 
}) => {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2';
  
  const variants = {
    primary: 'bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white shadow-cyan-500/30 hover:shadow-cyan-500/50',
    secondary: 'bg-linear-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white shadow-purple-500/30 hover:shadow-purple-500/50',
    outline: 'border-2 border-purple-400 text-purple-300 hover:bg-purple-500 hover:text-white bg-transparent',
    danger: 'bg-red-600 hover:bg-red-700 text-white',
    success: 'bg-lime-400 hover:bg-lime-500 text-black shadow-lime-400/30 hover:shadow-lime-400/50',
    ghost: 'bg-transparent hover:bg-white/10 text-gray-300 shadow-none',
  };

  const sizes = {
    sm: 'py-1.5 px-4 text-sm',
    md: 'py-2 px-6 text-base',
    lg: 'py-3 px-8 text-lg',
  };

  const widthClass = fullWidth ? 'w-full' : '';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${widthClass} ${className}`}
      {...props}
    >
      {loading && (
        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
      )}
      <span>{children}</span>
    </button>
  );
};

export default Button;
