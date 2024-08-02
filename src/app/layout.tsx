"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import VideoStoreProvider from "./context/videoContext";
import videoStore, { VideoStore } from "./context/videoStore";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const store = new VideoStore([]);

  return (
    <html lang="en">
      <VideoStoreProvider store={store}>
        <body className={inter.className}>{children}</body>
      </VideoStoreProvider>
    </html>
  );
}
