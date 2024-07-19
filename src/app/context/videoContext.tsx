"use client";

import React, { createContext, ReactNode, useContext } from "react";
import videoStore, { VideoStore } from "./videoStore";

export const VideoContext = createContext<VideoStore>(videoStore);

interface StoreProviderProps {
  store: VideoStore;
  children: ReactNode;
}

export default function VideoStoreProvider(props: StoreProviderProps) {
  return (
    <VideoContext.Provider value={props.store}>
      {props.children}
    </VideoContext.Provider>
  );
}
