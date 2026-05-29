"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import LandingScreen from "@/components/screens/landing-screen";
import UploadSelfieScreen from "@/components/screens/upload-selfie-screen";
import LinkGeneratedScreen from "@/components/screens/link-generated-screen";
import PartnerLandingScreen from "@/components/screens/partner-landing-screen";
import PartnerUploadScreen from "@/components/screens/partner-upload-screen";
import MemeRevealScreen from "@/components/screens/meme-reveal-screen";
import FinalScreen from "@/components/screens/final-screen";
import WaitingScreen from "@/components/screens/waiting-screen";

export type AppScreen =
  | "landing"
  | "upload"
  | "link-generated"
  | "waiting"
  | "partner-landing"
  | "partner-upload"
  | "meme-reveal"
  | "final";

export interface UserData {
  selfieUrl: string | null;
  nickname: string;
  shareLink: string;
  token: string;
  partnerSelfieUrl: string | null;
  privateMessage: string;
}

export default function Home() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>("landing");
  const [userData, setUserData] = useState<UserData>({
    selfieUrl: null,
    nickname: "",
    shareLink: "",
    token: "",
    partnerSelfieUrl: null,
    privateMessage: "",
  });

  const handleNavigate = (screen: AppScreen) => {
    setCurrentScreen(screen);
  };

  const handleUpdateUserData = (data: Partial<UserData>) => {
    setUserData((prev) => ({ ...prev, ...data }));
  };

  return (
    <main className="min-h-screen w-full overflow-hidden">
      <AnimatePresence mode="wait">
        {currentScreen === "landing" && (
          <LandingScreen key="landing" onNavigate={handleNavigate} />
        )}
        {currentScreen === "upload" && (
          <UploadSelfieScreen
            key="upload"
            onNavigate={handleNavigate}
            onUpdateUserData={handleUpdateUserData}
          />
        )}
        {currentScreen === "link-generated" && (
          <LinkGeneratedScreen
            key="link-generated"
            userData={userData}
            onNavigate={handleNavigate}
          />
        )}
        {currentScreen === "waiting" && (
          <WaitingScreen
            key="waiting"
            userData={userData}
            onUpdateUserData={handleUpdateUserData}
            onNavigate={handleNavigate}
          />
        )}
        {currentScreen === "partner-landing" && (
          <PartnerLandingScreen
            key="partner-landing"
            userData={userData}
            onNavigate={handleNavigate}
          />
        )}
        {currentScreen === "partner-upload" && (
          <PartnerUploadScreen
            key="partner-upload"
            onNavigate={handleNavigate}
            onUpdateUserData={handleUpdateUserData}
          />
        )}
        {currentScreen === "meme-reveal" && (
          <MemeRevealScreen
            key="meme-reveal"
            userData={userData}
            onNavigate={handleNavigate}
          />
        )}
        {currentScreen === "final" && (
          <FinalScreen
            key="final"
            userData={userData}
            onNavigate={handleNavigate}
          />
        )}
      </AnimatePresence>
    </main>
  );
}
