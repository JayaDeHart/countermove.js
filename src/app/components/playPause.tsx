import { CSSProperties } from "react";
import { FaPause, FaPlay } from "react-icons/fa6";

interface PlayPauseButtonProps {
  isPlaying: boolean;
  handlePlayPause: () => void;
  disabled: boolean;
  style?: CSSProperties;
}

const PlayPauseButton = ({
  isPlaying,
  handlePlayPause,
  disabled,
  style,
}: PlayPauseButtonProps) => {
  return (
    <button
      onClick={handlePlayPause}
      disabled={disabled}
      className={`bg-slate-600 text-white font-bold py-2 px-4 rounded flex items-center justify-center ${
        disabled ? "bg-gray-400 cursor-default" : "hover:bg-slate-700"
      }`}
      style={style}
    >
      {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} />}
    </button>
  );
};

export default PlayPauseButton;
