import React, { useState } from 'react';
import CircleButton from './CircleButton';
import RectButton from './RectButton';
import { Play, Pause, RefreshCcw, SkipForward } from 'lucide-react';

const PomodoroTimer: React.FC = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [isBreak, setIsBreak] = useState(false);
  const [echoDelay, setEchoDelay] = useState('');
  const [echoCount, setEchoCount] = useState('');
  
  const handleStart = () => {
    setIsRunning(true);
    console.log('Start timer');
  };
  
  const handlePause = () => {
    setIsRunning(false);
    console.log('Pause timer');
  };
  
  const handleReset = () => {
    setIsRunning(false);
    console.log('Reset timer');
  };
  
  const handleSkipBreak = () => {
    console.log('Skip break');
  };
  
  const handleEchoDelay = () => {
    console.log('Echo delay:', echoDelay);
  };
  
  const handleEchoCount = () => {
    console.log('Echo count:', echoCount);
  };

  return (
    <div className="animate-fade-in w-full max-w-xl mx-auto px-8 py-12">
      <div className="glass-panel p-8 rounded-4xl shadow-neomorphic">
        <div className="flex justify-between mb-16 animate-slide-down">
          <div className="flex flex-col items-start">
            <span className="text-pomodoro-light-text text-sm uppercase tracking-wider mb-1">Set Focus Time</span>
            <span className="text-4xl font-light text-pomodoro-text">25:00</span>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-pomodoro-light-text text-sm uppercase tracking-wider mb-1">Set Break Time</span>
            <span className="text-4xl font-light text-pomodoro-text">05:00</span>
          </div>
        </div>
        
        <div className="flex justify-center space-x-6 mb-16 animate-slide-up">
          <CircleButton 
            label="Start" 
            color="blue" 
            onClick={handleStart} 
            className="group"
          />
          <CircleButton 
            label="Pause" 
            color="green" 
            onClick={handlePause} 
            className="group"
          />
          <CircleButton 
            label="Reset" 
            color="yellow" 
            onClick={handleReset} 
            className="group"
          />
          <CircleButton 
            label="Skip Break" 
            color="outline" 
            onClick={handleSkipBreak} 
            className="group text-sm"
          />
        </div>
        
        <div className="flex justify-center space-x-8 animate-slide-up delay-150">
          <RectButton 
            label="Set Echo Delay" 
            onClick={handleEchoDelay}
            withInput={true}
            inputValue={echoDelay}
            onInputChange={setEchoDelay}
            inputPlaceholder="Delay (ms)"
          />
          <RectButton 
            label="Set Echo Count" 
            onClick={handleEchoCount}
            withInput={true}
            inputValue={echoCount}
            onInputChange={setEchoCount}
            inputPlaceholder="Count"
          />
        </div>
      </div>
    </div>
  );
};

export default PomodoroTimer;
