"use client";

import localFont from "next/font/local";
import { Oxanium } from "next/font/google";

import "@/styles/globals.scss";

import { uiStore } from "@/stores/uiStore";

const pretendard = localFont({
  src: [
    {
      path: "../assets/fonts/pretendard/Pretendard-Light.woff",
      weight: "300",
    },
    {
      path: "../assets/fonts/pretendard/Pretendard-Normal.woff",
      weight: "400",
    },
    {
      path: "../assets/fonts/pretendard/Pretendard-SemiBold.woff",
      weight: "500",
    },
    {
      path: "../assets/fonts/pretendard/Pretendard-Bold.woff",
      weight: "600",
    },
    {
      path: "../assets/fonts/pretendard/Pretendard-ExtraBold.woff",
      weight: "700",
    },
  ],
  variable: "--font-pretendard",
});

const oxanium = Oxanium({
  subsets: ["latin"], // 또는 ['latin-ext', 'devanagari'] 등 필요에 따라
  weight: ["400", "500", "600", "700"], // 사용할 굵기
  display: "swap", // FOUT 방지 옵션
});

export default function ThemeProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = uiStore((state) => state.theme);

  return (
    <html>
      <body
        className={`
          ${theme === "DARK" ? "dark" : "light"} 
          ${pretendard.variable}
          ${oxanium.className}
        `}
      >
        {children}
      </body>
    </html>
  );
}
