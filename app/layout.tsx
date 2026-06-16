import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geistSans = Geist({
  subsets: ["latin"],
  variable: "--font-sans",
});

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: "MemeUs| Turn Your Face Into Emotional Damage",
  description:
    "Create viral relationship memes with your face. Send your partner a link and watch them react to seeing you as a clock, astronaut, chair, and more.",
  generator: "v0.app",
  keywords: [
    "meme generator",
    "couples meme",
    "relationship meme",
    "viral meme",
    "instagram meme",
    "tiktok trend",
  ],
  openGraph: {
    title: "MemeUs | Turn Your Face Into Emotional Damage",
    description:
      "Someone turned themselves into memes for you. Upload a selfie to unlock the chaos.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "MemeUs| Turn Your Face Into Emotional Damage",
    description:
      "Someone turned themselves into memes for you. Upload a selfie to unlock the chaos.",
  },
  icons: {
    icon: [
      { url: "/icon-light-32x32.png", media: "(prefers-color-scheme: light)" },
      { url: "/icon-dark-32x32.png", media: "(prefers-color-scheme: dark)" },
      { url: "/icon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#1a0a2e",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark bg-background">
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased overflow-x-hidden`}
      >
        {children}
        {process.env.NODE_ENV === "production" && <Analytics />}
      </body>
    </html>
  );
}
