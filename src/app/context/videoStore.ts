"use client";

import { makeAutoObservable } from "mobx";

export class VideoStore {
  videos: string[];
  vid1Data: any[];
  vid2Data: any[];

  constructor(videos: string[] = []) {
    this.videos = videos;
    this.vid1Data = [];
    this.vid2Data = [];
    makeAutoObservable(this);
  }

  addVideo(video: string, index: number) {
    this.videos[index] = video;
    this.saveVideosToLocalStorage();
  }

  removeVideo(index: number) {
    this.videos.splice(index, 1);
    this.saveVideosToLocalStorage();
  }

  saveVideosToLocalStorage() {
    localStorage.setItem("videos", JSON.stringify(this.videos));
  }
}

export default VideoStore;
