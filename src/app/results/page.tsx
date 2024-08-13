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
import OverlayVideo from "./overlayVideo";

type Props = {};

function Results({}: Props) {
  const store = useContext(VideoContext);

  return (
    <div className="flex flex-col">
      <h1>Results</h1>
      <div>
        <OverlayVideo index={0} video={store.videos[0]} />
        <OverlayVideo index={1} video={store.videos[1]} />
      </div>
    </div>
  );
}

export default observer(Results);

// https://codesandbox.io/s/posenet-react-hm35t?file=/src/utilities.js

// https://github.dev/tensorflow/tfjs-models/tree/master/pose-detection/demos/upload_video/src
