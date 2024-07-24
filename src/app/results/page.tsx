"use client";
import { observer } from "mobx-react-lite";
import React, { useContext, useRef, useEffect } from "react";
import { VideoContext } from "../context/videoContext";
import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs-core";
import "@tensorflow/tfjs-backend-webgl";
import { drawKeypoints, drawSkeleton } from "../utilities/canvas";

type Props = {};

function Results({}: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const vidref1 = useRef<HTMLVideoElement>(null);
  const { videos } = useContext(VideoContext);
  const detectorConfig = {
    modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
  };

  async function initializeTFBackend() {
    await tf.setBackend("webgl");
    await tf.ready();
  }

  function drawResult(
    pose: poseDetection.Pose[],
    video: HTMLVideoElement,
    videoWidth: number,
    videoHeight: number,
    canvas: React.RefObject<HTMLCanvasElement>
  ) {
    if (canvas.current) {
      const ctx = canvas.current.getContext("2d");
      if (ctx) {
        canvas.current.width = videoWidth;
        canvas.current.height = videoHeight;
        pose.forEach((singlePose) => {
          drawKeypoints(singlePose.keypoints, 0.6, ctx);
          drawSkeleton(singlePose.keypoints, 0.7, ctx);
        });
      }
    }
  }

  async function generatePoses() {
    await initializeTFBackend();
    const detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      detectorConfig
    );
    if (vidref1.current) {
      const video = vidref1.current;
      const poses = await detector.estimatePoses(video);
      drawResult(poses, video, video.videoWidth, video.videoHeight, canvasRef);
    }
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      generatePoses();
    }, 100); // Replace 1000 with your desired interval in milliseconds

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div className="flex justify-center">
      <video src={videos[0]} ref={vidref1}></video>
      {/* <video src={videos[1]}></video> */}
      <canvas ref={canvasRef} />
    </div>
  );
}

export default observer(Results);

// https://codesandbox.io/s/posenet-react-hm35t?file=/src/utilities.js
