import type { ButtonHTMLAttributes } from 'react';

type ButtonVariant = 'primary' | 'secondary' | 'danger';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
}

export const Button = ({ children, variant = 'primary', className = '', ...props }: ButtonProps) => {
  const base = 'px-6 py-3 rounded-2xl font-bold transition-all duration-300 transform active:scale-95 outline-none flex items-center justify-center gap-2';
  
  const variants = {
    primary: 'bg-violet-600 hover:bg-violet-700 text-white shadow-[0_10px_20px_-10px_rgba(124,58,237,0.5)] border-transparent',
    secondary: 'bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 shadow-sm',
    danger: 'bg-red-50 hover:bg-red-100 text-red-600 border border-red-100',
  };

  return (
    <button className={`${base} ${variants[variant]} ${className}`} {...props}>
      {children}
    </button>
  );
};
