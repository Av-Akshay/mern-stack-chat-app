import { useCallback, useEffect, useRef } from 'react';

const useSound = () => {
  const audioRef = useRef(null);
  const lastPlayedTime = useRef(0);
  const isAudioLoaded = useRef(false);

  useEffect(() => {
    // Preload the audio on mount only once
    if (!isAudioLoaded.current) {
      audioRef.current = new Audio("/notification.mp3");
      audioRef.current.volume = 0.5;
      
      // Preload audio
      try {
        audioRef.current.load();
        isAudioLoaded.current = true;
      } catch (error) {
        console.error("Error loading notification sound:", error);
      }
    }
    
    return () => {
      // Clean up on unmount
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
        isAudioLoaded.current = false;
      }
    };
  }, []);

  const playNotificationSound = useCallback((volume = 0.5) => {
    try {
      if (!audioRef.current || !isAudioLoaded.current) return;
      
      const now = Date.now();
      // Debounce sound play - don't play more than once every 1 second
      if (now - lastPlayedTime.current < 1000) {
        return;
      }
      
      // Reset the audio to start and set volume
      audioRef.current.currentTime = 0;
      audioRef.current.volume = volume;
      
      // Play the sound
      const playPromise = audioRef.current.play();
      
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            // Update last played time
            lastPlayedTime.current = now;
          })
          .catch(error => {
            // Autoplay was prevented, which is common in browsers
            console.log("Audio playback prevented:", error);
          });
      }
    } catch (error) {
      console.error("Error playing notification sound:", error);
    }
  }, []);

  const setVolume = useCallback((volume) => {
    if (audioRef.current) {
      audioRef.current.volume = Math.max(0, Math.min(1, volume));
    }
  }, []);

  return { 
    playNotificationSound,
    setVolume 
  };
};

export default useSound; 