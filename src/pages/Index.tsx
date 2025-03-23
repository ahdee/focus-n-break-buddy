
import React from 'react';
import PomodoroTimer from '@/components/PomodoroTimer';

const Index: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-light text-gray-800 tracking-tight">Focus Timer</h1>
        <p className="text-gray-500 mt-2">Boost your productivity with focus intervals</p>
      </header>
      
      <PomodoroTimer />
      
      <footer className="mt-12 text-sm text-gray-400">
        <p>Design inspired by minimalist principles</p>
      </footer>
    </div>
  );
};

export default Index;
