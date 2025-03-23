
// Simple utility to play beep sound
export const playBeep = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();
  
  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);
  
  oscillator.type = 'sine';
  oscillator.frequency.value = 800;
  gainNode.gain.value = 0.5;
  
  oscillator.start();
  
  // Stop after 0.1 seconds
  setTimeout(() => {
    oscillator.stop();
    audioContext.close();
  }, 100);
};

// Play beeps continuously for a certain duration
export const playBeepsForDuration = (durationMs: number, callback?: () => void) => {
  let elapsedTime = 0;
  const interval = 500; // Beep every 500ms
  
  const intervalId = setInterval(() => {
    playBeep();
    elapsedTime += interval;
    
    if (elapsedTime >= durationMs) {
      clearInterval(intervalId);
      if (callback) callback();
    }
  }, interval);
  
  return () => clearInterval(intervalId);
};
