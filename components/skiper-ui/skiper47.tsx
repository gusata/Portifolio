// Adapted for DUALITY from the official Skiper UI registry, skiper47.
"use client";

import { motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useId } from "react";
import React from "react";
import {
  Autoplay,
  A11y,
  Keyboard,
  EffectCoverflow,
  Navigation,
  Pagination,
} from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css/effect-coverflow";
import "swiper/css/pagination";
import "swiper/css/navigation";
import "swiper/css";
import "swiper/css/effect-cards";

import { cn } from "@/lib/utils";

const Carousel_001 = ({
  images,
  className,
  showPagination = false,
  showNavigation = false,
  loop = true,
  autoplay = false,
  spaceBetween = 40,
  onSelect,
}: {
  images: { src: string; alt: string }[];
  className?: string;
  showPagination?: boolean;
  showNavigation?: boolean;
  loop?: boolean;
  autoplay?: boolean;
  spaceBetween?: number;
  onSelect?: (index: number) => void;
}) => {
  const reduced = useReducedMotion();
  const id = useId().replace(/:/g, "");
  const css = `
  .Carousal_001 {
    padding-bottom: 50px !important;
  }
  `;
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.5,
      }}
      className={cn("skiper-perspective relative w-full", className)}
    >
      <style>{css}</style>

      <Swiper
        spaceBetween={spaceBetween}
        autoplay={
          autoplay && !reduced
            ? {
                delay: 1500,
                disableOnInteraction: false,
              }
            : false
        }
        effect={reduced ? "slide" : "coverflow"}
        speed={reduced ? 0 : 600}
        keyboard={{ enabled: true, onlyInViewport: true }}
        a11y={{ enabled: true }}
        grabCursor={true}
        centeredSlides={true}
        loop={loop}
        slidesPerView={1.2}
        breakpoints={{ 700: { slidesPerView: 2.1 }, 1100: { slidesPerView: 2.43 } }}
        coverflowEffect={{
          rotate: 0,
          slideShadows: false,
          stretch: 0,
          depth: 100,
          modifier: 2.5,
        }}
        pagination={
          showPagination
            ? {
                clickable: true,
              }
            : false
        }
        navigation={
          showNavigation
            ? {
                nextEl: `[data-carousel-next="${id}"]`,
                prevEl: `[data-carousel-prev="${id}"]`,
              }
            : false
        }
        className="Carousal_001"
        modules={[EffectCoverflow, Autoplay, Pagination, Navigation, A11y, Keyboard]}
      >
        {images.map((image, index) => (
          <SwiperSlide key={index} className="skiper-slide w-full">
            <button className="skiper-slide-open" onClick={() => onSelect?.(index)} aria-label={`Open ${image.alt}`}>
              <Image fill sizes="(max-width: 700px) 85vw, 50vw" className="object-contain" src={image.src} alt={image.alt} />
            </button>
          </SwiperSlide>
        ))}
        {showNavigation && (
          <div className="skiper-carousel-arrows">
            <button data-carousel-prev={id} aria-label="Previous photograph">←</button>
            <button data-carousel-next={id} aria-label="Next photograph">→</button>
          </div>
        )}
      </Swiper>
    </motion.div>
  );
};

export { Carousel_001 };

/**
 * Skiper 47 Carousel_001 — React + Swiper
 * Built with Swiper.js - Read docs to learn more https://swiperjs.com/
 * Illustrations by AarzooAly - https://x.com/AarzooAly
 *
 * License & Usage:
 * - Free to use and modify in both personal and commercial projects.
 * - Attribution to Skiper UI is required when using the free version.
 * - No attribution required with Skiper UI Pro.
 *
 * Feedback and contributions are welcome.
 *
 * Author: @gurvinder-singh02
 * Website: https://gxuri.me
 * Twitter: https://x.com/Gur__vi
 */
