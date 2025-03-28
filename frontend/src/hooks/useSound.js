import { useCallback } from 'react';

const useSound = () => {
  const playNotificationSound = useCallback(() => {
    try {
      const audio = new Audio("/notification.mp3");
      audio.volume = 0.5;
      audio.play().catch(error => {
        // Autoplay was prevented, which is common in browsers
        // We'll just silently catch this error
        console.log("Audio playback prevented:", error);
      });
    } catch (error) {
      console.error("Error playing notification sound:", error);
    }
  }, []);

  return { playNotificationSound };
};

export default useSound; 