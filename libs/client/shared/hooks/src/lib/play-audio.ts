import { useEffect, useState } from 'react';

interface UseAudioProps {
  url: string,
  endedCallback?: () => void,
  errorCallback?: () => void,
}

export const useAudio = (props: UseAudioProps) => {
  const { url, endedCallback, errorCallback } = props;

  const [audio, setAudio] = useState(new Audio(url));
  const [playing, setPlaying] = useState<boolean>(false);

  const toggle = () => setPlaying(!playing);

  const playAgain = () => {
    audio.playbackRate = 1;
    setPlaying(true);
  };

  const playSpeakSlowlyAgain = (
    speed: 0.1 | 0.2 | 0.3 | 0.4 | 0.5 | 0.6 | 0.7 | 0.8 | 0.9 | 1 = 0.7
  ) => {
    audio.playbackRate = speed;
    setPlaying(true);
  };

  useEffect(() => {
    if (playing) {
      audio.play();
      if (audio.error && errorCallback) {
        errorCallback();
        setPlaying(false);
      }
    } else {
      audio.pause();
    }
  }, [playing]);

  useEffect(() => {
    const endedAudio = () => {
      setPlaying(false);
      if (endedCallback) endedCallback();
    };
    
    audio.addEventListener('ended', endedAudio);
    return () => {
      audio.removeEventListener('ended', endedAudio);
    };
  }, [audio]);

  useEffect(() => {
    setAudio(new Audio(url));
    setPlaying(false);
  }, [url]);

  return {
    playing,
    setPlaying,
    playAgain,
    playSpeakSlowlyAgain,
    toggle,
  };
};
