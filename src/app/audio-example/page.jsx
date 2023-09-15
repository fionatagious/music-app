"use client";

import React, { useRef } from "react";
// import PropTypes from "prop-types";

const AudioExample = () => {
  const preview = useRef(null);
  const recording = useRef(null);
  const startButton = useRef(null);
  const stopButton = useRef(null);
  const downloadButton = useRef(null);
  const logElement = useRef(null);

  let recordingTimeMS = 5000;

  function log(msg) {
    logElement.current.innerHTML += `${msg}\n`;
  }

  function wait(delayInMS) {
    return new Promise((resolve) => setTimeout(resolve, delayInMS));
  }

  function startRecording(stream, lengthInMS) {
    let recorder = new MediaRecorder(stream);
    let data = [];

    recorder.ondataavailable = (event) => data.push(event.data);
    recorder.start();
    log(`${recorder.state} for ${lengthInMS / 1000} seconds…`);

    let stopped = new Promise((resolve, reject) => {
      recorder.onstop = resolve;
      recorder.onerror = (event) => reject(event.name);
    });

    let recorded = wait(lengthInMS).then(() => {
      if (recorder.state === "recording") {
        recorder.stop();
      }
    });

    return Promise.all([stopped, recorded]).then(() => data);
  }

  function stop(stream) {
    stream.getTracks().forEach((track) => track.stop());
  }

  const handleStopButton = () => {
    stop(preview.current.srcObject);
  };

  const handleStartButton = () => {
    navigator.mediaDevices
      .getUserMedia({
        video: true,
        audio: true,
      })
      .then((stream) => {
        preview.current.srcObject = stream;
        downloadButton.current.href = stream;
        preview.current.captureStream =
          preview.current.captureStream || preview.current.mozCaptureStream;
        return new Promise((resolve) => (preview.current.onplaying = resolve));
      })
      .then(() =>
        startRecording(preview.current.captureStream(), recordingTimeMS)
      )
      .then((recordedChunks) => {
        let recordedBlob = new Blob(recordedChunks, { type: "video/webm" });
        recording.current.src = URL.createObjectURL(recordedBlob);
        downloadButton.current.href = recording.current.src;
        downloadButton.current.download = "RecordedVideo.webm";

        log(
          `Successfully recorded ${recordedBlob.size} bytes of ${recordedBlob.type} media.`
        );
      })
      .catch((error) => {
        if (error.name === "NotFoundError") {
          log("Camera or microphone not found. Can't record.");
        } else {
          log(error);
        }
      });
  };

  // stopButton.addEventListener(
  //   "click",
  //   () => {
  //     stop(preview.srcObject);
  //   },
  //   false
  // );

  return (
    <>
      <div ref={logElement}></div>
      <div>
        <button
          className="border-2 border-indigo-500"
          ref={startButton}
          onClick={handleStartButton}
        >
          Start Recording
        </button>
        <h2>Preview</h2>
        <video ref={preview} width="160" height="120" autoPlay muted></video>
      </div>

      <div>
        <button
          className="border-2 border-indigo-500"
          ref={stopButton}
          onClick={() => {
            handleStopButton;
          }}
        >
          Stop Recording
        </button>
        <h2>Recording</h2>
        <video id={recording} width="160" height="120" controls></video>
        <button ref={downloadButton}>Download</button>
      </div>
    </>
  );
};

// AudioExample.propTypes = {};

export default AudioExample;
