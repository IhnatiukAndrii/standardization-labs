import { useEffect, useRef } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
}

export const Modal = ({ children, isOpen }: ModalProps) => {
  const elRef = useRef<HTMLDivElement | null>(null);

  if (!elRef.current) {
    elRef.current = document.createElement('div');
  }

  useEffect(() => {
    const modalRoot = document.getElementById('root');
    if (!modalRoot || !elRef.current) return;

    if (isOpen) {
      modalRoot.appendChild(elRef.current);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.body.style.overflow = '';
      if (elRef.current && modalRoot.contains(elRef.current)) {
        modalRoot.removeChild(elRef.current);
      }
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"></div>
      
      <div className="relative bg-white/90 backdrop-blur-xl p-8 sm:p-10 border border-white/50 rounded-[2.5rem] shadow-2xl min-w-[320px] max-w-md w-full animate-in zoom-in-95 duration-200">
        {children}
      </div>
    </div>,
    elRef.current
  );
};
