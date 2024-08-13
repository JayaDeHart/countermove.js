"use client";

import React, { useContext } from "react";
import { observer } from "mobx-react-lite";
import ReactPlayer from "react-player";
import VideoStore from "../context/videoStore";
import { VideoContext } from "../context/videoContext";

type Props = {};

function Trimmer({}: Props) {
  const store = useContext(VideoContext);
  const video = store.videos[0];
  //   console.log(store.videos[0]);

  return (
    <div>
      <ReactPlayer
        url={store.videos[0]}
        controls
        playbackRate={0.5}
        // height={}
      />
      {/* <ReactPlayer url="https://www.youtube.com/watch?v=KbHXisXdd2c" /> */}
    </div>
  );
}

export default observer(Trimmer);
