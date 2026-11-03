"use client";

// Skiper UI #63 ? static filter extracted from the official registry.
// Demo/editor controls omitted; SVG definitions positioned out of document flow.
// https://skiper-ui.com/v1/skiper63
// Free version attribution retained in the photography footer.

export const SquiCircleFilterStatic = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      width="0"
      height="0"
      className="skiper-squircle-defs"
      version="1.1"
    >
      <defs>
        <filter id="SkiperSquiCircleFilterLayout">
          <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 20 -7"
            result="goo"
          />
          <feBlend in="SourceGraphic" in2="goo" />
        </filter>
      </defs>
    </svg>
  );
};

