/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { FC, useEffect, useRef, useState } from 'react';

import { useTheme } from '@mui/material';
import MicIcon from '@mui/icons-material/Mic';

import { ButtonCustom } from '../button-custom';
import { SxProps } from '@mui/system';

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

let mic: any;

if (typeof window !== 'undefined') {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  mic = new SpeechRecognition();
  mic.continuous = true;
  mic.interimResults = true;
}

interface VoiceRecordingProps {
  lang: any;
  setVoiceRecording: (value: string) => void;
  correctAnswer?: string;
  handleAnswers: (value: string) => void;
  onClick?: (isClick: boolean) => void;
  isClicked: boolean;
  autoStart?: boolean;
  autoStartInTime?: number; // seconds
  colorDefault?: string;
  colorSpeak?: string;
  microSize?: string;
  sx?: SxProps;
}

const VoiceRecording: FC<VoiceRecordingProps> = (props) => {
  const { lang, setVoiceRecording, correctAnswer, handleAnswers, onClick, isClicked, colorDefault, colorSpeak, microSize, autoStart = false, autoStartInTime = 5, sx } = props;

  const theme = useTheme();

  const [isListening, setIsListening] = useState(false);
  const [textRecording, setTextRecording] = useState<string>('');

  const autoStopTimeoutRef = useRef<any>();
  const clearOnaudioprocessTimeoutRef = useRef<any>();

  const gumStream = useRef<any>();
  const javascriptNode = useRef<any>();

  const handleListen = () => {
    const micIcon = document.getElementById('mic_icon');

    try {
      if (isListening) {
        mic.start();
        mic.onend = () => mic.start(); // restart mic when have error
        if (typeof window !== 'undefined' ) {
          if (typeof navigator === 'undefined') {
            alert('Unsupported media devices');
          } else {
            navigator.mediaDevices.getUserMedia({ audio: true, video: false })
              .then(function(stream: any) {
                gumStream.current = stream;
                const audioContext = new AudioContext();
                const analyser = audioContext.createAnalyser();
                analyser.smoothingTimeConstant = 0.8;
                analyser.fftSize = 1024;
              
                const microphone = audioContext.createMediaStreamSource(stream);
                microphone.connect(analyser);
      
                javascriptNode.current = audioContext.createScriptProcessor(2048, 1, 1);
                javascriptNode.current.connect(audioContext.destination);
              
                analyser.connect(javascriptNode.current);
      
                javascriptNode.current.onaudioprocess = function() {
                  const array = new Uint8Array(analyser.frequencyBinCount);
      
                  analyser.getByteFrequencyData(array);
                  let values = 0;
      
                  const length = array.length;
                  for (let i = 0; i < length; i++) {
                    values += (array[i]);
                  }
      
                  const average = Math.round(values / (length / 2));
                  const volume = 50 - average < 1 ? 1 : 50 - average > 99 ? 99 : 50 - average;
      
                  if (micIcon) micIcon.setAttribute('style', `stroke: url(#svg_color_${volume}); fill: url(#svg_color_${volume})`);
                };
              })
              .catch(function(err: any) {
                alert('Microphone access denied');
              });
          }
        }
  
      } else {
        mic.stop();
        mic.onend = () => console.log('Mic off');
  
        if (clearOnaudioprocessTimeoutRef.current) clearTimeout(clearOnaudioprocessTimeoutRef.current);

        clearOnaudioprocessTimeoutRef.current = setTimeout(() => {
          if (javascriptNode?.current?.onaudioprocess) javascriptNode.current.onaudioprocess = null;

          if (gumStream.current?.active) gumStream.current.getTracks().forEach((track: any) => track.stop());

          if (micIcon) micIcon.setAttribute('style', 'stroke: url(#svg_color_99); fill: url(#svg_color_99)');
        }, 100);
      }
    } catch (error) {
      // 
    }

    mic.onstart = () => console.log('Mics on');

    mic.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0])
        .map((result: any) => result.transcript)
        .join('');

      if (correctAnswer && (correctAnswer?.toLocaleLowerCase() === transcript.toLocaleLowerCase())) {
        // stop when pronouncing the correct answer
        setIsListening(false);
        setTextRecording('');
        handleAnswers(transcript);
        clearTimeout(autoStopTimeoutRef.current);
      }

      setTextRecording(transcript);

      mic.onerror = (event: any) => console.log(event.error);
    };
  };

  useEffect(() => handleListen(), [isListening]);

  useEffect(() => mic.lang = lang, [lang]);
  
  useEffect(() => {
    if (isListening) setTextRecording('');
  }, [isListening]);
  
  useEffect(() => {
    if (textRecording && !isListening) handleAnswers(textRecording);
    else setVoiceRecording(textRecording);
  }, [textRecording, isListening]);

  useEffect(() => {
    if (autoStart) {
      setIsListening(true);

      autoStopTimeoutRef.current = setTimeout(() => {
        setIsListening(false);
      }, autoStartInTime * 1000 - 300);
    }
  }, [autoStart]);

  useEffect(() => {
    return () => {
      clearTimeout(autoStopTimeoutRef.current);
    };
  }, []);

  return (
    <>
      {
        [...new Array(99)].map((item, index) => {
          return (
            <svg width="0" height="0" key={index}>
              <linearGradient id={`svg_color_${index + 1}`} gradientTransform="rotate(90)" x1={`${index + 1}%`} y1={'0%'} x2={'0%'} y2={'0%'}>
                <stop stopColor={colorSpeak ? colorSpeak : theme.colors.primary.main} offset="0%" />
                <stop stopColor={colorDefault ? colorDefault : theme.colors.secondary.main} offset="0%" />
              </linearGradient>
            </svg>
          );
        })
      }

      <ButtonCustom
        children={
          <MicIcon
            id="mic_icon"
            sx={{
              fontSize: microSize ?? '50px',
            }}
            style={{
              stroke: 'url(#svg_color_99)',
              fill: 'url(#svg_color_99)',
            }}  
          />
        }
        rest={{
          onClick: () => onClick ? onClick(true) : null,
          onMouseDown: () => setIsListening(true),
          onMouseUp: () => setIsListening(false),
          onMouseLeave: () => setIsListening(false),
          disabled: isClicked,
        }}
        sx={{
          padding: theme.spacing(1.5),
          minWidth: '20px',
          color: '#ffffff00',
          ...sx,
        }}
      />
    </>
  );
};

export { VoiceRecording };