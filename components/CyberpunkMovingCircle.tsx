"use client";
import React, { useEffect, useState, useCallback } from "react";

const CyberpunkMovingCircle = () => {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [targetPosition, setTargetPosition] = useState({ x: 0, y: 0 });
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  const colors = [
    "#ff00ff", // 네온 핑크
    "#00ffff", // 네온 청록색
    "#ff00aa", // 네온 자홍색
    "#aa00ff", // 네온 보라색
    "#ffff00", // 네온 노랑
  ];

  const [currentColor, setCurrentColor] = useState(colors[0]);

  const updateWindowSize = useCallback(() => {
    setWindowSize({ width: window.innerWidth, height: window.innerHeight });
  }, []);

  useEffect(() => {
    updateWindowSize();
    window.addEventListener("resize", updateWindowSize);
    return () => window.removeEventListener("resize", updateWindowSize);
  }, [updateWindowSize]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    setTargetPosition({ x: e.clientX, y: e.clientY });
  }, []);

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (e.touches && e.touches[0]) {
      setTargetPosition({ x: e.touches[0].clientX, y: e.touches[0].clientY });
    }
  }, []);

  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [handleMouseMove, handleTouchMove]);

  useEffect(() => {
    const moveCircle = () => {
      setPosition((prev) => ({
        x: prev.x + (targetPosition.x - prev.x) * 0.1,
        y: prev.y + (targetPosition.y - prev.y) * 0.1,
      }));
      setCurrentColor(colors[Math.floor(Date.now() / 1000) % colors.length]);
      requestAnimationFrame(moveCircle);
    };

    const animationId = requestAnimationFrame(moveCircle);
    return () => cancelAnimationFrame(animationId);
  }, [targetPosition]);

  return (
    <svg
      width="100%"
      height="100vh"
      style={{
        background:
          "linear-gradient(180deg, rgba(171, 246, 255, 1) 0%, rgba(198, 163, 252, 1) 100%)",
      }}
    >
      <defs>
        <filter id="glow">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <circle
        cx={position.x}
        cy={position.y}
        r="20"
        fill={currentColor}
        filter="url(#glow)"
      >
        <animate
          attributeName="r"
          values="15;20;15"
          dur="1.5s"
          repeatCount="indefinite"
        />
      </circle>
    </svg>
  );
};

export default CyberpunkMovingCircle;
