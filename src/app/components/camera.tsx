'use client'
import { useRef, useState } from 'react';
import { FaRegCircleStop } from "react-icons/fa6";
import { FaVideo } from "react-icons/fa";
import { FaRedo } from "react-icons/fa";



const CameraComponent = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const [recording, setRecording] = useState(false);
  const [videoUrl, setVideoUrl] = useState<string>('');

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    if (videoRef.current) {
      videoRef.current.srcObject = stream;
    }
    mediaRecorderRef.current = new MediaRecorder(stream);
    const chunks: Blob[] = [];

    mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
      if (event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorderRef.current.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      setVideoUrl(URL.createObjectURL(blob));
    };

    mediaRecorderRef.current.start();
    setRecording(true);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setRecording(false);
  };

  function getRecordingFunction(){
    if(recording){
      stopRecording()
    }
    else{

      startRecording()
    }
  }

  function getVideoIcon(){
    if(!videoUrl && !recording){
      return <FaVideo/>
    }
    if(recording){
      return <FaRegCircleStop />
    }
    if(!recording && videoUrl){
      return <FaRedo/>
    }
    else {
      return <FaVideo/>
    }
  }

  return (
    <div className=''>
      <div className='border border-black border-solid p-24 hover:cursor-pointer' onClick={getRecordingFunction}>
        {getVideoIcon()}
        <video className='z-10' ref={videoRef} autoPlay={recording}></video>
      </div>
       {videoUrl && <div>
          <video src={videoUrl} controls></video>
        </div>
       }
    </div>
  );
};

export default CameraComponent;


// import { useRef, useState } from 'react';

// const CameraComponent = () => {
//   const videoRef = useRef<HTMLVideoElement>(null);
//   const mediaRecorderRef = useRef<MediaRecorder | null>(null);
//   const [recording, setRecording] = useState(false);
//   const [videoUrl, setVideoUrl] = useState<string>('');

//   const startRecording = async () => {
//     const stream = await navigator.mediaDevices.getUserMedia({ video: true });
//     if (videoRef.current) {
//       videoRef.current.srcObject = stream;
//     }
//     mediaRecorderRef.current = new MediaRecorder(stream);
//     const chunks: Blob[] = [];

//     mediaRecorderRef.current.ondataavailable = (event: BlobEvent) => {
//       if (event.data.size > 0) {
//         chunks.push(event.data);
//       }
//     };

//     mediaRecorderRef.current.onstop = () => {
//       const blob = new Blob(chunks, { type: 'video/webm' });
//       setVideoUrl(URL.createObjectURL(blob));
//     };

//     mediaRecorderRef.current.start();
//     setRecording(true);
//   };

//   const stopRecording = () => {
//     if (mediaRecorderRef.current) {
//       mediaRecorderRef.current.stop();
//     }
//     setRecording(false);
//   };

//   return (
//     <div>
//       <video ref={videoRef} autoPlay></video>
//       <div>
//         {recording ? (
//           <button onClick={stopRecording}>Stop Recording</button>
//         ) : (
//           <button onClick={startRecording}>Start Recording</button>
//         )}
//       </div>
//       {videoUrl && (
//         <div>
//           <h3>Recorded Video:</h3>
//           <video src={videoUrl} controls></video>
//         </div>
//       )}
//     </div>
//   );
// };

// export default CameraComponent;
