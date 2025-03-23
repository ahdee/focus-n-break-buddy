
import React from 'react';
import { cn } from '@/lib/utils';

interface CircleButtonProps {
  label: string;
  color: 'blue' | 'green' | 'yellow' | 'outline';
  onClick: () => void;
  className?: string;
}

const CircleButton: React.FC<CircleButtonProps> = ({ 
  label, 
  color, 
  onClick, 
  className 
}) => {
  const colorStyles = {
    blue: 'bg-pomodoro-blue hover:bg-pomodoro-blue-hover text-pomodoro-text',
    green: 'bg-pomodoro-green hover:bg-pomodoro-green-hover text-pomodoro-text',
    yellow: 'bg-pomodoro-yellow hover:bg-pomodoro-yellow-hover text-pomodoro-text',
    outline: 'bg-transparent border-2 border-pomodoro-outline hover:border-pomodoro-outline-hover text-pomodoro-outline hover:text-pomodoro-outline-hover'
  };

  return (
    <button
      onClick={onClick}
      className={cn(
        'circle-button h-24 w-24 rounded-full flex items-center justify-center',
        'shadow-button hover:shadow-button-hover',
        'font-medium tracking-wide',
        'transition-all duration-300 ease-in-out',
        colorStyles[color],
        className
      )}
    >
      {label}
    </button>
  );
};

export default CircleButton;
