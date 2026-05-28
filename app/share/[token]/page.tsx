"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "@/lib/supabase";

import PartnerLandingScreen from "@/components/screens/partner-landing-screen";
import PartnerUploadScreen from "@/components/screens/partner-upload-screen";
import MemeRevealScreen from "@/components/screens/meme-reveal-screen";
import FinalScreen from "@/components/screens/final-screen";

import type { UserData, AppScreen } from "@/app/page";

export default function SharePage() {
  const { token } = useParams() as { token: string };
  const [screen, setScreen] = useState<AppScreen>("partner-landing");
  const [userData, setUserData] = useState<UserData>({
    selfieUrl: null,
    nickname: "",
    shareLink: "",
    partnerSelfieUrl: null,
  });

  useEffect(() => {
    async function loadSession() {
      const { data } = await supabase
        .from("meme_sessions")
        .select("*")
        .eq("token", token)
        .single();

      if (data) {
        setUserData({
          selfieUrl: data.selfie_url,
          nickname: data.nickname || "",
          shareLink: window.location.href,
