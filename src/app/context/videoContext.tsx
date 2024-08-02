"use client";

import React, { createContext, ReactNode, useContext, useEffect } from "react";
import { VideoStore } from "./videoStore";

const store = new VideoStore([]);
export const VideoContext = createContext<VideoStore>(store);

interface StoreProviderProps {
  store: VideoStore;
  children: ReactNode;
}

export default function VideoStoreProvider(props: StoreProviderProps) {
  useEffect(() => {
    const videos = localStorage.getItem("videos");
    if (videos) {
      props.store.videos = JSON.parse(videos);
    }
  }, [props.store]);

  return (
    <VideoContext.Provider value={props.store}>
      {props.children}
    </VideoContext.Provider>
  );
}
