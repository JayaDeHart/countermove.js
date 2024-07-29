"use client";
import { useContext, useRef, useState, useEffect } from "react";
import { FaRegCircleStop } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import { FaRedo } from "react-icons/fa";
import { observer } from "mobx-react-lite";
import { VideoStore } from "../context/videoStore";
import { VideoContext } from "../context/videoContext";
import { FaPause, FaPlay } from "react-icons/fa6";
import PlayPauseButton from "./playPause";

interface CameraProps {
  number: number;
}

const CameraComponent = (props: CameraProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const recordedVideoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>("");
  const [isPlaying, setIsPlaying] = useState(false);

  const store = useContext(VideoContext);

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
      store.videos[props.number - 1] = URL.createObjectURL(blob);
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
    </div>
  );
};

export default observer(CameraComponent);
