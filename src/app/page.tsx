"use client";

import { observer } from "mobx-react-lite";
import CameraComponent from "./components/camera";
import Link from "next/link";

function Home() {
  return (
    <main className="flex flex-col items-center">
      <h1 className="text-4xl">CounterMove</h1>
      <div className="flex">
        <div className="flex flex-col items-center m-10">
          <h3>Move 1</h3>
          <CameraComponent number={1} />
        </div>
        <div className="flex flex-col items-center m-10">
          <h3>Move 2</h3>
          <CameraComponent number={2} />
        </div>
      </div>
      <Link href="/results">
        <button>Get Results</button>
      </Link>
    </main>
  );
}

export default observer(Home);
