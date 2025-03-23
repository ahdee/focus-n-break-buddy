
import React, { useState, useEffect, useRef } from 'react';
import { toast } from 'sonner';
import CircleButton from './CircleButton';
import RectButton from './RectButton';
import { playBeep, playBeepsForDuration } from '@/utils/sounds';

type TimerMode = 'focus' | 'break' | 'alert' | 'echo' | 'idle' | 'countup';

const DEFAULT_FOCUS_TIME = 25 * 60; // 25 minutes in seconds
const DEFAULT_BREAK_TIME = 5 * 60; // 5 minutes in seconds
const ALERT_DURATION = 5; // 5 seconds
const DEFAULT_ECHO_DELAY_START = 5 * 60; // 5 minutes in seconds
const DEFAULT_ECHO_INTERVAL = 30; // 30 seconds

const PomodoroTimer: React.FC = () => {
  // Timer state
  const [mode, setMode] = useState<TimerMode>('idle');
  const [isRunning, setIsRunning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(DEFAULT_FOCUS_TIME);
  const [countUpTime, setCountUpTime] = useState(0);
  
  // Settings
  const [focusTime, setFocusTime] = useState(DEFAULT_FOCUS_TIME);
  const [breakTime, setBreakTime] = useState(DEFAULT_BREAK_TIME);
  const [echoDelayStart, setEchoDelayStart] = useState(DEFAULT_ECHO_DELAY_START.toString());
  const [echoInterval, setEchoInterval] = useState('30000'); // 30 seconds in ms
  const [echoCount, setEchoCount] = useState('3');
  
  // References
  const timerRef = useRef<number | null>(null);
  const echoTimerRef = useRef<number | null>(null);
  const currentEchoCountRef = useRef(0);
  const alertTimerRef = useRef<number | null>(null);
  const countUpTimerRef = useRef<number | null>(null);
  
  // Format time as mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  // Clean up all timers
  const cleanupTimers = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    if (echoTimerRef.current) {
      clearTimeout(echoTimerRef.current);
      echoTimerRef.current = null;
    }
    if (alertTimerRef.current) {
      clearInterval(alertTimerRef.current);
      alertTimerRef.current = null;
    }
    if (countUpTimerRef.current) {
      clearInterval(countUpTimerRef.current);
      countUpTimerRef.current = null;
    }
  };
  
  // Timer tick handler
  const handleTimerTick = () => {
    setTimeRemaining((prev) => {
      if (prev <= 1) {
        // Timer reached zero
        cleanupTimers();
        
        if (mode === 'focus') {
          // Start alert phase
          startAlertPhase();
          return 0;
        } else if (mode === 'break') {
          // Break is over
          toast("Break time is over! Ready for another focus session?");
          setIsRunning(false);
          setMode('idle');
          setTimeRemaining(focusTime);
          return focusTime;
        }
      }
      return prev - 1;
    });
  };
  
  // Start the timer
  const startTimer = () => {
    if (isRunning) return;
    
    setIsRunning(true);
    
    if (mode === 'idle') {
      setMode('focus');
    }
    
    timerRef.current = window.setInterval(handleTimerTick, 1000);
  };
  
  // Pause the timer
  const pauseTimer = () => {
    setIsRunning(false);
    cleanupTimers();
  };
  
  // Reset the timer
  const resetTimer = () => {
    cleanupTimers();
    setIsRunning(false);
    setMode('idle');
    setTimeRemaining(focusTime);
    setCountUpTime(0);
    currentEchoCountRef.current = 0;
  };
  
  // Skip break and restart focus timer
  const skipBreak = () => {
    cleanupTimers();
    setIsRunning(false);
    setMode('idle');
    setTimeRemaining(focusTime);
    toast("Break skipped. Starting new focus session!");
  };
  
  // Start the alert phase (5 second beeping)
  const startAlertPhase = () => {
    setMode('alert');
    setTimeRemaining(ALERT_DURATION);
    
    // Play beep and countdown for 5 seconds
    playBeep();
    alertTimerRef.current = window.setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(alertTimerRef.current!);
          alertTimerRef.current = null;
          startEchoDelayTimer();
          return 0;
        }
        playBeep();
        return prev - 1;
      });
    }, 1000);
  };
  
  // Start the delay before echo reminders
  const startEchoDelayTimer = () => {
    const delayInMs = parseInt(echoDelayStart) * 1000;
    
    setMode('idle');
    setTimeRemaining(breakTime);
    
    toast("Focus session complete! Break time started.");
    
    // Start break timer if user doesn't interact
    if (!isRunning) {
      setMode('break');
      setIsRunning(true);
      timerRef.current = window.setInterval(handleTimerTick, 1000);
    }
    
    // Schedule the first echo cycle after the delay
    echoTimerRef.current = window.setTimeout(() => {
      if (!isRunning) {
        startEchoCycle();
      }
    }, delayInMs);
  };
  
  // Start an echo reminder cycle
  const startEchoCycle = () => {
    if (currentEchoCountRef.current >= parseInt(echoCount)) {
      // All echo reminders complete, start count-up timer
      startCountUpTimer();
      return;
    }
    
    setMode('echo');
    toast("Reminder: Your focus session ended!", {
      duration: 5000,
    });
    
    // Play beeps for 5 seconds
    playBeepsForDuration(5000, () => {
      currentEchoCountRef.current++;
      
      // Schedule next echo after the interval
      const intervalInMs = parseInt(echoInterval);
      echoTimerRef.current = window.setTimeout(() => {
        if (!isRunning) {
          startEchoCycle();
        }
      }, intervalInMs);
    });
  };
  
  // Start count-up timer after all echo reminders
  const startCountUpTimer = () => {
    setMode('countup');
    setCountUpTime(0);
    
    countUpTimerRef.current = window.setInterval(() => {
      setCountUpTime(prev => prev + 1);
    }, 1000);
  };
  
  // Save echo delay start time
  const handleEchoDelayStart = () => {
    const delayInSeconds = Math.max(1, parseFloat(echoDelayStart));
    setEchoDelayStart(delayInSeconds.toString());
    toast(`Echo delay start set to ${delayInSeconds} seconds`);
  };
  
  // Save echo interval
  const handleEchoInterval = () => {
    const intervalInMs = Math.max(1000, parseFloat(echoInterval));
    setEchoInterval(intervalInMs.toString());
    toast(`Echo interval set to ${intervalInMs}ms`);
  };
  
  // Save echo count
  const handleEchoCount = () => {
    const count = Math.max(1, parseInt(echoCount));
    setEchoCount(count.toString());
    toast(`Echo count set to ${count}`);
  };
  
  // Cleanup effect
  useEffect(() => {
    return () => {
      cleanupTimers();
    };
  }, []);

  return (
    <div className="animate-fade-in w-full max-w-xl mx-auto px-8 py-12">
      <div className="glass-panel p-8 rounded-4xl shadow-neomorphic">
        <div className="flex justify-between mb-16 animate-slide-down">
          <div className="flex flex-col items-start">
            <span className="text-pomodoro-light-text text-sm uppercase tracking-wider mb-1">Set Focus Time</span>
            <span className="text-4xl font-light text-pomodoro-text">
              {mode === 'countup' 
                ? `+${formatTime(countUpTime)}` 
                : formatTime(timeRemaining)}
            </span>
          </div>
          
          <div className="flex flex-col items-end">
            <span className="text-pomodoro-light-text text-sm uppercase tracking-wider mb-1">Set Break Time</span>
            <span className="text-4xl font-light text-pomodoro-text">{formatTime(breakTime)}</span>
          </div>
        </div>
        
        <div className="flex justify-center space-x-6 mb-16 animate-slide-up">
          <CircleButton 
            label="Start" 
            color="blue" 
            onClick={startTimer} 
            className="group"
          />
          <CircleButton 
            label="Pause" 
            color="green" 
            onClick={pauseTimer} 
            className="group"
          />
          <CircleButton 
            label="Reset" 
            color="yellow" 
            onClick={resetTimer} 
            className="group"
          />
          <CircleButton 
            label="Skip Break" 
            color="outline" 
            onClick={skipBreak} 
            className="group text-sm"
          />
        </div>
        
        <div className="flex justify-center space-x-8 animate-slide-up delay-150">
          <RectButton 
            label="Set Echo Delay Start" 
            onClick={handleEchoDelayStart}
            withInput={true}
            inputValue={echoDelayStart}
            onInputChange={setEchoDelayStart}
            inputPlaceholder="Seconds"
          />
          <RectButton 
            label="Set Echo Interval" 
            onClick={handleEchoInterval}
            withInput={true}
            inputValue={echoInterval}
            onInputChange={setEchoInterval}
            inputPlaceholder="Ms"
          />
        </div>
        
        <div className="flex justify-center mt-8 animate-slide-up delay-200">
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
