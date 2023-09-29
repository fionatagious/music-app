'use client';

import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js'

export default function Home() {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [chunks, setChunks] = useState([]);
  const clipContainer = useRef(null);
  const record = useRef(null);
  const stop = useRef(null);
  
  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log('getUserMedia supported.');
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          setMediaRecorder(new MediaRecorder(stream));
        })
        .catch((err) => {
          console.error(`The following getUserMedia error occurred: ${err}`);
        });

      } else {
        console.log('getUserMedia not supported on your browser!');
      }
    }, []);
    
    const handleRecord = () => {
      mediaRecorder.start();
      record.current.classList.add('bg-red-500', 'text-black');
    };

    const createWaveform = (audioUrl) => {
      const wavesurfer = WaveSurfer.create({
        container: document.getElementById('waveform'),
        waveColor: '#4F4A85',
        progressColor: '#383351',
        url: audioUrl,
      })
      wavesurfer.once('interaction', () => {
        wavesurfer.play()
      })
  }

  const handleStop = () => {
    mediaRecorder.stop();
    mediaRecorder.onstop = function (e) {
      record.current.classList.remove('bg-red-500', 'text-black');
      const blob = new Blob(chunks, { type: 'audio/ogg; codecs=opus' });
      setChunks([]);
      const audioURL = window.URL.createObjectURL(blob);
      const audio = document.createElement('audio');
      audio.controls = true;
      audio.src = audioURL;
      createWaveform(audioURL);
      clipContainer.current.appendChild(audio);
    };
    mediaRecorder.ondataavailable = function (e) {
      chunks.push(e.data);
    };
  };

  const handleClick = () => {
    var context = new AudioContext();
    var oscillator = context.createOscillator();
    oscillator.type = 'sine';
    oscillator.frequency.value = 300;
    oscillator.connect(context.destination);
    oscillator.start();
    // Beep for 500 milliseconds
    setTimeout(function () {
      oscillator.stop();
    }, 200);
  };
  
  const handleReset = () => {
    clipContainer.current.querySelector('audio').remove();
  };
  
  
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-5xl">
        <h1>Our Music App</h1>
        <div id="waveform">Audiowave Visualizer</div>
        <div ref={clipContainer}></div>
        <button
          className="rounded-lg border-2 border-indigo-500 p-2"
          onClick={handleRecord}
          ref={record}
        >
          REC
        </button>
        <button
          className="rounded-lg border-2 border-indigo-500 p-2"
          onClick={handleStop}
          ref={stop}
        >
          STOP
        </button>

        <button
          className="rounded-lg border-2 border-indigo-500 p-2"
          onClick={handleClick}
        >
          Tap to play beat
        </button>
        <button
          className="rounded-lg border-2 border-indigo-500 p-2"
          onClick={handleReset}
        >
          Reset
        </button>
      </div>
    </main>
  );
}
