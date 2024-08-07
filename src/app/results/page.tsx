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
import {
  calculateAngles,
  drawResults,
  drawThumbnail,
  kp,
} from "../utilities/canvas";
import { drawCtx } from "../utilities/canvas";
import PlayPauseButton from "../components/playPause";
import Image from "next/image";
import { toJS } from "mobx";

type Props = {};

function Results({}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const store = useContext(VideoContext);
  const [model, setModel] = useState<poseDetection.PoseDetector | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [poseData, setPoseData] = useState<poseDetection.Pose[][]>([]);
  const [count, setCount] = useState<number>(0);
  const animationFrameId = useRef<number | null>(null);
  const frameTime = 20;

  const addFrameListener = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        video.addEventListener("loadeddata", () => {
          video.currentTime = frameTime;
        });
      }
    }
  };

  function doTheThing() {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;

      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      }
    }
  }

  useEffect(() => {
    const loadModel = async () => {
      await tf.setBackend("webgl");
      await tf.ready();
      let model = await poseDetection.createDetector(
        poseDetection.SupportedModels.MoveNet,
        {
          modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
        }
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
      setPoseData((prevPoseData) => [...prevPoseData, poses]);
      setCount((prevCount) => prevCount + 1);
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

  useEffect(() => {
    addFrameListener();
  }, []);

  // console.log(toJS(store.vid1Data));
  // console.log(count);

  console.log(
    calculateAngles(kp.keypoints[16], kp.keypoints[14], kp.keypoints[12])
  );

  return (
    <div className="flex flex-col">
      <h1>Results</h1>
      <video
        ref={videoRef}
        src={store.videos[0]}
        onPlay={handleVideoPlay}
        onPause={handleVideoPause}
        style={{ display: "none" }}
        onEnded={() => {
          setIsPlaying(false);
          store.vid1Data = poseData;
        }}
        onSeeked={doTheThing}
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
  );
}

export default observer(Results);

// https://codesandbox.io/s/posenet-react-hm35t?file=/src/utilities.js

// https://github.dev/tensorflow/tfjs-models/tree/master/pose-detection/demos/upload_video/src
