"use client";

import React, { useContext, useState, useRef, useEffect } from "react";
import { observer } from "mobx-react-lite";
import ReactPlayer from "react-player";
import VideoStore from "../context/videoStore";
import { VideoContext } from "../context/videoContext";
import { FFmpeg } from "@ffmpeg/ffmpeg";
import { toBlobURL } from "@ffmpeg/util";
import Button from "../components/button";

type Props = {};

function Trimmer({}: Props) {
  const [loaded, setLoaded] = useState(false);
  const [trimmed, setTrimmed] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);

  const store = useContext(VideoContext);
  const video = store.videos[0];

  const ffmpegRef = useRef(new FFmpeg());

  const load = async () => {
    const baseURL = "https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd";
    const ffmpeg = ffmpegRef.current;
    // ffmpeg.on("log", ({ message }) => {
    //   messageRef.current.innerHTML = message;
    //   console.log(message);
    // });
    // toBlobURL is used to bypass CORS issue, urls with the same
    // domain can be used directly.
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, "text/javascript"),
      wasmURL: await toBlobURL(
        `${baseURL}/ffmpeg-core.wasm`,
        "application/wasm"
      ),
    });
    setLoaded(true);
  };

  const trimVideo = async (
    startTime: number | null,
    endTime: number | null,
    video: string
  ) => {
    if (loaded && startTime && endTime) {
      // Convert Blob URL back to a Blob
      const videoBlob = await fetch(video).then((res) => res.blob());

      // Read the Blob data as an array buffer
      const videoData = await videoBlob.arrayBuffer();
      const ffmpeg = ffmpegRef.current;

      // Write the video to FFmpeg's virtual file system
      ffmpeg.writeFile("input.mp4", new Uint8Array(videoData));

      // Run FFmpeg to trim the video
      await ffmpeg.exec([
        "-i",
        "input.mp4",
        "-ss",
        startTime.toString(),
        "-to",
        endTime.toString(),
        "-c",
        "copy",
        "output.mp4",
      ]);

      // Read the trimmed video from the virtual file system
      const trimmedData = await ffmpeg.readFile("output.mp4");

      // Create a URL for the trimmed video
      const url = URL.createObjectURL(
        new Blob([trimmedData], { type: "video/mp4" })
      );
      setTrimmed(url);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="flex flex-col items-center w-full">
      <ReactPlayer
        url={store.videos[0]}
        controls
        playbackRate={0.5}
        style={{}}
      />
      <div className="flex items-center justify-evenly w-full">
        <Button color="green" text="Start" onClick={() => null} />
        <Button
          color="red"
          text="Stop"
          disabled={!startTime}
          onClick={() => null}
        />
        <Button
          color="slate"
          text="trim"
          disabled={!startTime || !endTime}
          onClick={() => trimVideo(0, 1, video)}
        />
      </div>

      {trimmed && <ReactPlayer url={trimmed} controls />}
    </div>
  );
}

export default observer(Trimmer);

// https://inside.caratlane.com/trim-video-in-reactjs-c8b6e34702cb
