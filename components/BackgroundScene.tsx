export function BackgroundScene() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(4,6,7,0)_20%,_rgba(2,4,5,0.9)_100%)]" />
    </div>
  );
}
