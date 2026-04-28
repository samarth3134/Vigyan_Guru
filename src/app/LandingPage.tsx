import { useState, useEffect } from "react";
import { motion } from "motion/react";

interface LandingPageProps {
  onEnter: () => void;
}

export default function LandingPage({ onEnter }: LandingPageProps) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedTheme = window.localStorage.getItem("vigyan-guru-theme");
      setIsDarkMode(savedTheme === "dark");
    }
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8 }}
      className={`h-screen w-full flex items-center justify-center cursor-pointer overflow-hidden ${
        isDarkMode ? "bg-slate-950" : "bg-white"
      }`}
      onClick={onEnter}
      onWheel={onEnter}
      onTouchMove={onEnter}
    >
      <motion.img
        src="/assets/logo.png"
        alt="Vigyan Guru Logo"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="h-48 md:h-64 lg:h-80 object-contain"
      />
    </motion.div>
  );
}
