"use client";
import { observer } from "mobx-react-lite";
import React, {
  useContext,
  useRef,
  useEffect,
  useCallback,
  useState,
} from "react";
import { VideoContext } from "../context/videoContext";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import { drawKeypoints, drawResults, drawSkeleton } from "../utilities/canvas";
import videoStore from "../context/videoStore";
import VideoStoreProvider from "../context/videoContext";
import { drawCtx } from "../utilities/canvas";
import PlayPauseButton from "../components/playPause";

type Props = {};

function Results({}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const store = useContext(VideoContext);
  const [model, setModel] = useState<poseDetection.PoseDetector | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const animationFrameId = useRef<number | null>(null);

  const detectorConfig = {
    modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
  };

  useEffect(() => {
    const loadModel = async () => {
      await tf.setBackend("webgl");
      await tf.ready();
      let model = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        detectorConfig
      );
      setModel(model);
    };

    loadModel();
  }, []);

  const detectPose = useCallback(async () => {
    if (videoRef.current && canvasRef.current && model) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      const poses = await model.estimatePoses(video);
      if (ctx) {
        drawCtx(video, ctx);
        drawResults(poses, ctx);
      }

      animationFrameId.current = requestAnimationFrame(detectPose);
    }
  }, [model, canvasRef]);

  const handleVideoPlay = useCallback(() => {
    if (animationFrameId.current === null) {
      detectPose();
    }
  }, [detectPose]);

  const handleVideoPause = useCallback(() => {
    if (animationFrameId.current !== null) {
      cancelAnimationFrame(animationFrameId.current);
      animationFrameId.current = null;
    }
  }, []);

  const handlePlayVideo = () => {
    if (videoRef.current) {
      if (!videoRef.current.paused) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  console.log(videoRef.current?.videoWidth);

  return (
    <VideoStoreProvider store={store}>
      <div className="flex flex-col">
        <h1>Results</h1>
        <video
          ref={videoRef}
          src={store.videos[0]}
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          style={{ display: "none" }}
          onEnded={() => setIsPlaying(false)}
        />
        <canvas ref={canvasRef} />
        <PlayPauseButton
          isPlaying={isPlaying}
          handlePlayPause={handlePlayVideo}
          disabled={false}
          style={{
            position: "absolute",
            top: 500,
            left: 500,
          }}
        />
      </div>
    </VideoStoreProvider>
  );
}

export default observer(Results);

// https://codesandbox.io/s/posenet-react-hm35t?file=/src/utilities.js

// https://github.dev/tensorflow/tfjs-models/tree/master/pose-detection/demos/upload_video/src
