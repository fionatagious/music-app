"use client";
import { useEffect, useState, useRef } from "react";

export default function Home() {
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const [chunks, setChunks] = useState([]);
  const clipContainer = useRef(null);
  const record = useRef(null);
  const stop = useRef(null);

  useEffect(() => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      console.log("getUserMedia supported.");
      navigator.mediaDevices
        .getUserMedia({ audio: true })
        .then((stream) => {
          setMediaRecorder(new MediaRecorder(stream));
        })
        .catch((err) => {
          console.error(`The following getUserMedia error occurred: ${err}`);
        });
    } else {
      console.log("getUserMedia not supported on your browser!");
    }
  }, [])
  

  const handleRecord = () => {
    mediaRecorder.start();
    record.current.style.background = "red";
    record.current.style.color = "black";
  };

  const handleStop = () => {
    mediaRecorder.stop();
    mediaRecorder.onstop = function (e) {
      record.current.style.background = "";
      record.current.style.color = "";
      const audio = document.createElement("audio");
      clipContainer.current.appendChild(audio);
      audio.controls = true;
      const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
      setChunks([]);
      const audioURL = window.URL.createObjectURL(blob);
      audio.src = audioURL;
    }
    mediaRecorder.ondataavailable = function (e) {
      chunks.push(e.data);
    };
  };

  const handleClick = () => {
    var context = new AudioContext();
    var oscillator = context.createOscillator();
    oscillator.type = "sine";
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
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-5xl w-full">
        <h1>Our Music App</h1>
        <div ref={clipContainer}></div>
        <button
          className="border-2 border-indigo-500 p-2 rounded-lg"
          onClick={handleRecord}
          ref={record}
        >
          REC
        </button>
        <button
          className="border-2 border-indigo-500 p-2 rounded-lg"
          onClick={handleStop}
          ref={stop}
        >
          STOP
        </button>

        <button
          className="border-2 border-indigo-500 p-2 rounded-lg"
          onClick={handleClick}
        >
          Tap to play beat
        </button>
        <button className="border-2 border-indigo-500 p-2 rounded-lg" onClick={handleReset}>
          Reset
        </button>
      </div>
    </main>
  );
}
