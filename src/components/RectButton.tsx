
import React, { ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Input } from './ui/input';

interface RectButtonProps {
  label: string;
  onClick: () => void;
  className?: string;
  withInput?: boolean;
  inputValue?: string | number;
  onInputChange?: (value: string) => void;
  inputPlaceholder?: string;
}

const RectButton: React.FC<RectButtonProps> = ({ 
  label, 
  onClick, 
  className,
  withInput = false,
  inputValue = '',
  onInputChange,
  inputPlaceholder = ''
}) => {
  return (
    <div className="flex flex-col items-center space-y-2">
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
      {withInput && (
        <Input
          type="text"
          value={inputValue}
          onChange={(e) => onInputChange && onInputChange(e.target.value)}
          placeholder={inputPlaceholder}
          className="w-32 text-center rounded-xl"
        />
      )}
    </div>
  );
};

export default RectButton;
