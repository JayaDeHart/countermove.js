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
import { drawResults, drawThumbnail } from "../utilities/canvas";
import { drawCtx } from "../utilities/canvas";
import PlayPauseButton from "../components/playPause";
import Image from "next/image";

type Props = {};

function Results({}: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const store = useContext(VideoContext);
  const [model, setModel] = useState<poseDetection.PoseDetector | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loading, setLoading] = useState(true);
  const animationFrameId = useRef<number | null>(null);
  const frameTime = 20;

  const initializeThumbnail = () => {
    console.log("called");
    if (videoRef.current && canvasRef.current) {
      console.log("called with videoRef");
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      // canvas.width = 400;
      // canvas.height = 400;

      if (ctx) {
        video.addEventListener("loadeddata", () => {
          video.currentTime = frameTime;
        });

        video.addEventListener("seeked", () => {
          ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
          const imageSrc = canvas.toDataURL("image/jpeg");
          const image = new window.Image();
          image.src = imageSrc;
          image.onload = () => {
            drawThumbnail(image, ctx);
          };
        });
      }

      // if (ctx) {
      //   video.addEventListener("loadeddata", () => {
      //     drawCtx(video, ctx);
      //   });
      // }

      // if (ctx) {
      //   const image = new window.Image();
      //   image.src = "/thumbnaildummy.jpeg";
      //   image.onload = () => {
      //     drawThumbnail(image, ctx);
      //   };
      // }
    }
  };

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
      initializeThumbnail();
    };

    loadModel();
  }, []);

  const detectPose = useCallback(async () => {
    console.log("detect pose but no model");
    console.log(videoRef.current, canvasRef.current, model);
    if (videoRef.current && canvasRef.current && model) {
      console.log("detectpose but with model");
      const video = videoRef.current;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      const poses = await model.estimatePoses(video);
      if (ctx) {
        console.log("theoretically drawing shit here");
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
    initializeThumbnail();
  }, [detectPose, model, loading]);

  console.log(model);

  return (
    <div className="flex flex-col">
      <h1>Results</h1>
      <video
        ref={videoRef}
        src={store.videos[0]}
        onPlay={handleVideoPlay}
        onPause={handleVideoPause}
        style={{ display: "none" }}
        onEnded={() => setIsPlaying(false)}
        onLoad={initializeThumbnail}
      />
      <canvas ref={canvasRef} height={500} width={500} />
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
