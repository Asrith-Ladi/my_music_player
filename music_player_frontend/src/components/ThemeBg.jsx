// src/components/ThemeBackground.jsx
import { useEffect } from "react";

export default function ThemeBackground({ theme, darkGradient, lightGradient }) {
  useEffect(() => {
    const element = document.documentElement;

    // Smooth fade & zoom effect
    element.style.transition = "background 0.6s ease, transform 0.6s ease";
    element.style.transform = "scale(1.05)";

    element.style.background = theme === "dark" ? darkGradient : lightGradient;
    element.style.backgroundRepeat = "no-repeat";
    element.style.backgroundSize = "cover";
    element.style.backgroundPosition = "center center";
    element.style.backgroundAttachment = "fixed";
    element.style.minHeight = "100%";
    element.style.width = "100%";
    element.style.margin = "0";
    element.style.padding = "0";

    // Remove scrolling
    element.style.overflowX = "hidden";
    element.style.overflowY = "hidden"; // 🚫 Disable vertical scroll

    // Safe area padding for iOS notches
    element.style.paddingTop = "env(safe-area-inset-top)";
    element.style.paddingBottom = "env(safe-area-inset-bottom)";

    // Reset zoom after animation
    setTimeout(() => {
      element.style.transform = "scale(1)";
    }, 600);
  }, [theme, darkGradient, lightGradient]);

  return null; // No UI, just effect
}
