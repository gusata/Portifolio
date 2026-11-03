// Adapted for DUALITY from the official Skiper UI registry, skiper52.
"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import React, { useState } from "react";
import Image from "next/image";

import { cn } from "@/lib/utils";

const HoverExpand_001 = ({
  images,
  className,
  onSelect,
}: {
  images: { src: string; alt: string; code: string }[];
  className?: string;
  onSelect?: (index: number) => void;
}) => {
  const [activeImage, setActiveImage] = useState<number | null>(0);

  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{
        duration: 0.3,
        delay: 0.5,
      }}
      className={cn("skiper-expand relative w-full", className)}
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="w-full"
      >
        <div className="skiper-expand-panels flex w-full items-center justify-center gap-2">
          {images.map((image, index) => (
            <motion.button
              type="button"
              data-active={activeImage === index}
              aria-label={`Open ${image.alt}`}
              onFocus={() => setActiveImage(index)}
              key={index}
              className="skiper-expand-panel relative cursor-pointer overflow-hidden"
              initial={false}
              animate={{
                flex: activeImage === index ? 4 : 1,
              }}
              transition={{ duration: reduced ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => { setActiveImage(index); onSelect?.(index); }}
              onHoverStart={() => setActiveImage(index)}
            >
              <AnimatePresence>
                {activeImage === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="absolute h-full w-full bg-gradient-to-t from-black/40 to-transparent"
                  />
                )}
              </AnimatePresence>
              <AnimatePresence>
                {activeImage === index && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="pointer-events-none absolute z-10 flex h-full w-full flex-col items-end justify-end p-4"
                  >
                    <p className="text-left text-xs text-white">
                      {image.code}
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
              <Image
                fill
                sizes="(max-width: 700px) 80vw, 50vw"
                src={image.src}
                className="size-full object-cover"
                alt={image.alt}
              />
            </motion.button>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export { HoverExpand_001 };

/**
 * Skiper 52 HoverExpand_001 — React + Framer Motion
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