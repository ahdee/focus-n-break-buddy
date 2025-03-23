
import React from 'react';
import { cn } from '@/lib/utils';

interface RectButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
}

const RectButton: React.FC<RectButtonProps> = ({ 
  label, 
  onClick, 
  className 
}) => {
  return (
    <button
      onClick={onClick}
      className={cn(
        'rect-button rounded-3xl px-8 py-4 w-48',
        'bg-white border border-gray-200',
        'shadow-subtle hover:shadow-button',
        'font-medium text-pomodoro-text',
        'transition-all duration-300 ease-in-out',
        className
      )}
    >
      {label}
    </button>
  );
};

export default RectButton;
