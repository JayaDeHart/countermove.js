import CameraComponent from "./components/camera";

export default function Home() {

  return (
    <main className="flex flex-col items-center">
      <h1 className="text-4xl">CounterMove</h1>
      <div className="flex">
        <div className="flex flex-col items-center m-10">
          <h3>Move 1</h3>
          <CameraComponent/>
        </div>
        <div className="flex flex-col items-center m-10">
          <h3>Move 2</h3>
          <CameraComponent/>
        </div>
      </div>
    </main>
  );
}
