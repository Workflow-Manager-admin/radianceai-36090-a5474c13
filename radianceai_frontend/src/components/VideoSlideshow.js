import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * PUBLIC_INTERFACE
 * VideoSlideshow: A full-width, autoplaying, animated video carousel/hero.
 * Props:
 *   videos: Array of
 *     {
 *       src: string (URL to mp4/webm),
 *       poster: string (URL to poster image/thumbnail, optional),
 *       title: string (Product/video title, optional)
 *     }
 *   interval: number (milliseconds between slides, default 6200)
 */
const AUTOPLAY_INTERVAL = 6200;

export function VideoSlideshow({
  videos = [],
  interval = AUTOPLAY_INTERVAL,
  aspectRatio = "21/9"
}) {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef(null);
  const numVideos = videos.length;

  // Auto-advance logic
  useEffect(() => {
    if (numVideos === 0) return;
    timerRef.current = setTimeout(() => {
      setCurrent((c) => (c + 1) % numVideos);
    }, interval);
    return () => clearTimeout(timerRef.current);
  }, [current, numVideos, interval]);

  // Manual controls (arrows/clicks if needed)
  const goTo = (idx) => {
    if (idx === current || idx < 0 || idx >= numVideos) return;
    setCurrent(idx);
  };

  // Pause on hover/focus
  const [paused, setPaused] = useState(false);
  useEffect(() => {
    if (!paused) return;
    clearTimeout(timerRef.current);
    return () => {};
  }, [paused]);

  if (!videos || numVideos === 0) return null;

  return (
    <div
      className="video-hero"
      style={{
        width: "100vw",
        marginLeft: "calc(-50vw + 50%)",
        position: "relative",
        overflow: "hidden",
        minHeight: 220,
        maxHeight: 360,
        aspectRatio,
        borderRadius: "0 0 var(--radius-xl) var(--radius-xl)",
        boxShadow: "0 6px 44px 2px #fadadd36",
        background: "var(--gradient-glow, #fadadd44)",
        zIndex: 5,
        marginBottom: 18
      }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      tabIndex={-1}
      aria-roledescription="carousel"
      aria-label="Bestseller product highlights"
    >
      <AnimatePresence initial={false} mode="wait">
        <motion.div
          className="video-slide"
          key={current}
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.98 }}
          transition={{
            duration: 0.99,
            ease: [0.38, 0.9, 0.46, 1]
          }}
          style={{
            width: "100%",
            height: "100%",
            position: "absolute",
            inset: 0,
            display: "flex"
          }}
        >
          <video
            key={videos[current]?.src}
            src={videos[current]?.src}
            poster={videos[current]?.poster || ""}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              borderRadius: "0 0 var(--radius-xl) var(--radius-xl)"
            }}
            autoPlay
            muted
            loop={false}
            playsInline
            aria-label={videos[current]?.title || "Product video"}
            onEnded={() => setCurrent((c) => (c + 1) % numVideos)}
          />
          {videos[current]?.title && (
            <div
              className="video-title"
              style={{
                position: "absolute",
                left: 0,
                bottom: 24,
                width: "100%",
                color: "#fff",
                textShadow: "0 4px 20px #2d1354cc",
                fontWeight: 900,
                fontSize: "2.2vw",
                padding: "0 40px",
                letterSpacing: ".04em",
                zIndex: 5,
                pointerEvents: "none"
              }}
            >
              {videos[current].title}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
      {/* Dots navigation */}
      <div
        className="video-dots"
        style={{
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          left: 0,
          right: 0,
          bottom: 12,
          gap: 11,
          zIndex: 10
        }}
      >
        {videos.map((v, idx) => (
          <button
            key={v.src + idx}
            onClick={() => goTo(idx)}
            aria-label={`Go to slide ${idx + 1} (${v.title || "Product"})`}
            style={{
              width: 16,
              height: 16,
              borderRadius: "50%",
              background:
                idx === current
                  ? "linear-gradient(92deg, #fadadd 64%, #f339db 100%)"
                  : "#fffafdcc",
              opacity: idx === current ? 1 : 0.44,
              border: idx === current ? "2.5px solid #d149b3" : "1.5px solid #fadadd",
              margin: 0,
              padding: 0,
              cursor: "pointer",
              transition: "all 0.21s cubic-bezier(.33,1.07,.47,1)",
              outline: idx === current ? "2.2px solid #f339db44" : "none"
            }}
            tabIndex={0}
          />
        ))}
      </div>
    </div>
  );
}

export default VideoSlideshow;
