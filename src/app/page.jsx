"use client";
import { useEffect, useState, useRef } from "react";
import Image from "next/image";

export default function Home() {
  //const stream = useRef(null);
  // const [stream, setStream] = useState(null);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  const record = useRef(null);
  const stop = useRef(null);
  // const soundClips = document.querySelector(".sound-clips");

  // async function getMedia(constraints) {
  //   let stream = null;

  //   try {
  //     stream = await navigator.mediaDevices.getUserMedia(constraints);
  //     /* use the stream */
  //   } catch (err) {
  //     /* handle the error */
  //   }
  // }

  // useEffect(() => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    console.log("getUserMedia supported.");
    //setStream(navigator.mediaDevices.getUserMedia({ audio: true }));
    navigator.mediaDevices
      .getUserMedia({ audio: true })
      .then((stream) => {
        const audio = document.querySelector("audio");
        audio.srcObject = stream;
        setMediaRecorder(new MediaRecorder(stream));
      })
      .catch((err) => {
        console.error(`The following getUserMedia error occurred: ${err}`);
      });
  } else {
    console.log("getUserMedia not supported on your browser!");
  }
  // });

  const handleRecord = () => {
    mediaRecorder.start();
    console.log(mediaRecorder.state);
    console.log("recorder started");
    record.current.style.background = "red";
    record.current.style.color = "black";
  };

  const handleStop = () => {
    console.log(mediaRecorder);
    mediaRecorder.stop();
    console.log(mediaRecorder.state);
    console.log("recorder stopped");
    record.current.style.background = "";
    record.current.style.color = "";
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

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="max-w-5xl w-full">
        <h1>Our Music App</h1>
        <audio controls src="" />
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
      </div>
    </main>
  );
}
