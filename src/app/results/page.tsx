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
import { drawKeypoints, drawSkeleton } from "../utilities/canvas";
import videoStore from "../context/videoStore";
import VideoStoreProvider from "../context/videoContext";

type Props = {};

function Results({}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const store = useContext(VideoContext);
  const [model, setModel] = useState<poseDetection.PoseDetector | null>(null);
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

  console.log("canvas:", canvasRef);

  const detectPose = useCallback(async () => {
    if (videoRef.current && canvasRef.current && model) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      console.log("ctx", ctx);

      // canvas.width = video.videoWidth;
      // canvas.height = video.videoHeight;
      canvas.width = 480;
      canvas.height = 640;

      const poses = await model.estimatePoses(video);
      console.log(poses);

      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        poses.forEach((pose) => {
          drawSkeleton(pose.keypoints, 0.5, ctx);
          pose.keypoints.forEach(({ x, y, score, name }) => {
            if (score! > 0.5) {
              ctx.beginPath();
              ctx.arc(x, y, 1, 0, 2 * Math.PI);
              ctx.fillStyle = "red";
              ctx.fill();
              ctx.fillText(name || "unknown", x + 5, y + 5, 50);
            }
          });
        });
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
      videoRef.current.play();
    }
  };

  return (
    <VideoStoreProvider store={store}>
      <div style={{ position: "relative" }}>
        <video
          ref={videoRef}
          src={store.videos[0]}
          onPlay={handleVideoPlay}
          onPause={handleVideoPause}
          style={{ display: "block", zIndex: 10 }}
        />
        <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: 640,
            height: 480,
          }}
        />
        <div className="h-7 w-8 bg-black" onClick={handlePlayVideo}></div>
      </div>
    </VideoStoreProvider>
  );
}

export default observer(Results);

// https://codesandbox.io/s/posenet-react-hm35t?file=/src/utilities.js
