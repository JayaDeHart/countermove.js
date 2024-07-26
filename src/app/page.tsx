"use client";

import { observer } from "mobx-react-lite";
import CameraComponent from "./components/camera";
import Link from "next/link";
import videoStore from "./context/videoStore";
import VideoStoreProvider from "./context/videoContext";

function Home() {
  return (
    <VideoStoreProvider store={videoStore}>
      <main className="flex flex-col items-center m-10 h-full text-2xl">
        <h1 className="text-8xl">
          <span className="font-avenger">Counter</span>
          <span className="font-avengers">Move</span>
        </h1>
        <div className="flex w-full h-2/3 justify-center">
          <div className="flex flex-col items-center m-10 w-1/4">
            <h3>Move 1</h3>
            <CameraComponent number={1} />
          </div>
          <div className="flex flex-col items-center m-10 w-1/4">
            <h3>Move 2</h3>
            <CameraComponent number={2} />
          </div>
        </div>
        <Link href="/results">
          <button className="bg-slate-600 text-white font-bold py-2 px-4 rounded hover:bg-slate-700">
            Get Results
          </button>
        </Link>
      </main>
    </VideoStoreProvider>
  );
}

export default observer(Home);
