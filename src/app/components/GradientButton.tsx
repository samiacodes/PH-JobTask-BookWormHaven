interface GradientButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
  disabled?: boolean;
}

export default function GradientButton({ 
  children, 
  onClick, 
  type = 'button', 
  className = '', 
  disabled = false 
}: GradientButtonProps) {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`bg-gradient-to-r from-purple-600 to-blue-500 px-6 py-3 rounded-full font-semibold hover:opacity-90 transition-all disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}