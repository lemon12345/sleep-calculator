"use client";
import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Hero from "./Hero";
import Features from "./Features";
import UseCases from "./UseCases";
import FAQ from "./FAQ";

export default function HomeComponent() {
  const [selectedColor, setSelectedColor] = useState("#FFC0CB");
  const [width, setWidth] = useState(1920);
  const [height, setHeight] = useState(1080);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const t = useTranslations("SleepCalculator");

  useEffect(() => {
    const updateDimensions = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    updateDimensions();
    window.addEventListener("resize", updateDimensions);

    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  return (
    <>
      {/* Hero section contains the main h1 tag - Sleep Calculator / 睡眠计算器 */}
      <Hero />

      {/* All subsequent sections use h2, h3, etc. for proper hierarchy */}
      <Features />
      <UseCases />
      <FAQ />
    </>
  );
}
