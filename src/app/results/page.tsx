"use client";
import { observer } from "mobx-react-lite";
import React, { useContext } from "react";
import { VideoContext } from "../context/videoContext";

type Props = {};

function Results({}: Props) {
  const { videos } = useContext(VideoContext);
  return (
    <div className="text-red-200">
      <video src={videos[0]} controls></video>
      <video src={videos[1]} controls></video>
    </div>
  );
}

export default observer(Results);
