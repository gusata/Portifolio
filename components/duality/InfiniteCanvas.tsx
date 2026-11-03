"use client";

import Image from "next/image";
import { useCallback, useEffect, useRef, useState, type PointerEvent } from "react";
import { usePhotography } from "./PhotographyProvider";

// Original implementation. Skiper Infinite Canvas #73 is Pro and is not copied.
const CELL_X = 390, CELL_Y = 300;
const mod = (n: number, size: number) => ((n % size) + size) % size;

export default function InfiniteCanvas({ onOpen }: { onOpen: (index: number) => void }) {
  const { photographs } = usePhotography();
  const [camera, setCamera] = useState({ x: 0, y: 0, zoom: 1 });
  const [dragging, setDragging] = useState(false);
  const [size, setSize] = useState({ width: 1400, height: 700 });
  const viewport = useRef<HTMLDivElement>(null);
  const gesture = useRef<{ x: number; y: number; startX: number; startY: number; moved: boolean } | null>(null);
  const lastMoved = useRef(false);
  const pan = useCallback((x: number, y: number) => setCamera(c => ({ ...c, x: c.x + x / c.zoom, y: c.y + y / c.zoom })), []);
  useEffect(() => {
    const el = viewport.current;
    if (!el) return;
    const observer = new ResizeObserver(([entry]) => setSize({ width: entry.contentRect.width, height: entry.contentRect.height }));
    observer.observe(el);
    const wheel = (event: WheelEvent) => {
      // Wheel remains page scrolling. Shift+wheel explicitly explores the plane.
      if (!event.shiftKey) return;
      event.preventDefault(); pan(-event.deltaX - event.deltaY, 0);
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => { observer.disconnect(); el.removeEventListener("wheel", wheel); };
  }, [pan]);
  const down = (e: PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return;
    gesture.current = { x: e.clientX, y: e.clientY, startX: e.clientX, startY: e.clientY, moved: false };
    lastMoved.current = false;
  };
  const move = (e: PointerEvent<HTMLDivElement>) => {
    const g = gesture.current; if (!g) return;
    if (Math.hypot(e.clientX - g.startX, e.clientY - g.startY) > 7) {
      if (!g.moved) { e.currentTarget.setPointerCapture(e.pointerId); setDragging(true); }
      g.moved = true;
    }
    if (g.moved) pan(e.clientX - g.x, e.clientY - g.y);
    g.x = e.clientX; g.y = e.clientY;
  };
  const up = () => { lastMoved.current = gesture.current?.moved ?? false; gesture.current = null; setDragging(false); };
  const columns = Math.ceil(size.width / camera.zoom / CELL_X) + 2;
  const rows = Math.ceil(size.height / camera.zoom / CELL_Y) + 2;
  const firstCol = Math.floor(-camera.x / CELL_X) - 1;
  const firstRow = Math.floor(-camera.y / CELL_Y) - 1;
  return <div className="atlas-shell">
    <div ref={viewport} className={`infinite-canvas ${dragging ? "is-dragging" : ""}`} role="region" aria-label="Infinite photograph canvas. Drag to explore, or use arrow keys and the direction buttons." tabIndex={0} onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} onLostPointerCapture={up} onClickCapture={e => { if (lastMoved.current) { e.preventDefault(); e.stopPropagation(); lastMoved.current = false; } }} onKeyDown={e => {
      if (e.target !== e.currentTarget) return;
      const directions: Record<string, [number, number]> = { ArrowLeft: [180, 0], ArrowRight: [-180, 0], ArrowUp: [0, 180], ArrowDown: [0, -180] };
      if (directions[e.key]) { e.preventDefault(); pan(...directions[e.key]); }
      if (e.key === "Home") { e.preventDefault(); setCamera({ x: 0, y: 0, zoom: 1 }); }
    }}>
      <div className="atlas-origin" style={{ transform: `translate(${camera.x * camera.zoom}px,${camera.y * camera.zoom}px)` }} aria-hidden="true"><span>+</span></div>
      {Array.from({ length: columns * rows }, (_, cell) => {
        const col = firstCol + cell % columns, row = firstRow + Math.floor(cell / columns);
        const index = mod(col + row * 3, photographs.length);
        const photo = photographs[index];
        const variant = mod(col * 7 + row * 5, 4);
        const width = [280, 210, 310, 245][variant];
        const height = width * photo.height / photo.width;
        const left = ((col * CELL_X + camera.x) * camera.zoom) + size.width * .08;
        const top = ((row * CELL_Y + camera.y) * camera.zoom) + 70 + mod(col, 2) * 40;
        const visible = left >= 10 && left + width * camera.zoom < size.width - 10 && top >= 10 && top + (height + 30) * camera.zoom < size.height - 95;
        return <button key={`${col}:${row}`} className="atlas-frame" data-frame={index} tabIndex={visible ? 0 : -1} aria-label={`Open ${photo.title}`} style={{ left: 0, top: 0, width, height: height + 30, transformOrigin: "0 0", transform: `translate3d(${left}px,${top}px,0) scale(${camera.zoom}) rotate(${[0, -3, 2, -1][variant]}deg)` }} onClick={() => onOpen(index)}>
          <span className="atlas-image"><Image draggable={false} src={photo.src} alt={photo.alt} fill sizes="350px" /></span><span className="atlas-frame-caption"><b>{String(index + 1).padStart(2, "0")}</b><span>{photo.title}</span><i aria-hidden="true">↗</i></span>
        </button>;
      })}
      <div className="atlas-vignette" aria-hidden="true" />
    </div>
    <span className="atlas-hint micro">DRAG TO WANDER / TAP TO OPEN</span>
    <div className="atlas-coordinates micro" aria-hidden="true">X {Math.round(-camera.x).toString().padStart(4, "0")} / Y {Math.round(-camera.y).toString().padStart(4, "0")}</div>
    <div className="atlas-controls" aria-label="Canvas controls">
      <div className="atlas-direction"><button aria-label="Pan left" onClick={() => pan(220, 0)}>←</button><button aria-label="Pan up" onClick={() => pan(0, 180)}>↑</button><button aria-label="Pan down" onClick={() => pan(0, -180)}>↓</button><button aria-label="Pan right" onClick={() => pan(-220, 0)}>→</button></div>
      <div><button aria-label="Zoom out" disabled={camera.zoom <= .6} onClick={() => setCamera(c => ({ ...c, zoom: Math.max(.6, +(c.zoom - .2).toFixed(1)) }))}>−</button><span className="micro" aria-live="polite">{Math.round(camera.zoom * 100)}%</span><button aria-label="Zoom in" disabled={camera.zoom >= 1.4} onClick={() => setCamera(c => ({ ...c, zoom: Math.min(1.4, +(c.zoom + .2).toFixed(1)) }))}>+</button></div>
      <button className="atlas-reset" onClick={() => setCamera({ x: 0, y: 0, zoom: 1 })}>RESET VIEW</button>
    </div>
  </div>;
}
