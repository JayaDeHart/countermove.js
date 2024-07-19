import { makeAutoObservable } from "mobx";

export class VideoStore {
  videos: string[];

  constructor(videos: string[] = []) {
    this.videos = videos;
    makeAutoObservable(this);
  }
}

const videoStore = new VideoStore();

export default videoStore;
