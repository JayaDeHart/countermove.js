"use client";
import { useContext, useRef, useState, useEffect, ChangeEvent } from "react";
import { FaRegCircleStop } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import { FaRedo } from "react-icons/fa";
import { observer } from "mobx-react-lite";
import { VideoContext } from "../context/videoContext";
import PlayPauseButton from "./playPause";

interface CameraProps {
  number: number;
}

const CameraComponent = (props: CameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const recordedVideoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [recording, setRecording] = useState(false);

  const [isPlaying, setIsPlaying] = useState(false);

  const store = useContext(VideoContext);
  const [videoUrl, setVideoUrl] = useState<string>("");

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    mediaRecorderRef.current = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks, { type: "video/webm" });
      setVideoUrl(URL.createObjectURL(blob));
      store.addVideo(URL.createObjectURL(blob), props.number);
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };

  function getRecordingFunction() {
    setVideoUrl("");
    if (recording) {
      stopRecording();
    } else {
      startRecording();
    }
  }

  function getVideoIcon() {
    const iconProps = {
      color: "white",
      size: 60,
    };
    if (!videoUrl && !recording) {
      return <FaVideo {...iconProps} />;
    }
    if (recording) {
      return <FaRegCircleStop {...iconProps} />;
    }
    if (!recording && videoUrl) {
      return <FaRedo {...iconProps} />;
    } else {
      return <FaVideo {...iconProps} />;
    }
  }

  const handlePlayVideo = () => {
    if (recordedVideoRef.current) {
      if (recordedVideoRef.current.paused) {
        recordedVideoRef.current.play();
        setIsPlaying(true);
      } else {
        recordedVideoRef.current.pause();
        setIsPlaying(false);
      }
    }
  };

  function handleFileClick() {
    if (fileInputRef.current) {
      setVideoUrl("");
      fileInputRef.current.click();
    }
  }

  function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
    if (e.target.files) {
      setVideoUrl(URL.createObjectURL(e.target.files[0]));
      store.addVideo(URL.createObjectURL(e.target.files[0]), props.number);
    }
  }

  return (
    <div className="h-full w-full flex flex-col items-center">
      <div
        className="bg-slate-200 border border-black border-solid m-1 hover:cursor-pointer relative inline-block h-full w-full"
        onClick={getRecordingFunction}
      >
        {!videoUrl && (
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            ref={videoRef}
            autoPlay
          ></video>
        )}
        <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-10">
          {getVideoIcon()}
        </div>
        {videoUrl && (
          <video
            className="absolute top-0 left-0 w-full h-full object-cover"
            src={videoUrl}
            ref={recordedVideoRef}
            onEnded={() => setIsPlaying(false)}
          ></video>
        )}
      </div>
      <PlayPauseButton
        isPlaying={isPlaying}
        handlePlayPause={handlePlayVideo}
        disabled={!videoUrl}
      />
      <input
        className="hidden"
        type="file"
        accept="video/*"
        ref={fileInputRef}
        onChange={handleFileChange}
      />
      <button
        className="text-base bg-slate-500 text-white font-bold py-2 px-4 rounded flex items-center justify-center m-2"
        onClick={handleFileClick}
      >
        Upload File
      </button>
    </div>
  );
};

export default observer(CameraComponent);
