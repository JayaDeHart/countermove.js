"use client";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import VideoStoreProvider from "./context/videoContext";
import videoStore from "./context/videoStore";

const inter = Inter({ subsets: ["latin"] });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <VideoStoreProvider store={videoStore}>
        <body className={inter.className}>{children}</body>
      </VideoStoreProvider>
    </html>
  );
}
