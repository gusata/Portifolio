let activeLocks = 0;
let overflowBeforeLock = "";
let lockedBody: HTMLElement | null = null;

export function acquireBodyScrollLock() {
  const body = document.body;

  if (activeLocks === 0) {
    overflowBeforeLock = body.style.overflow;
    lockedBody = body;
  }

  activeLocks += 1;
  body.style.overflow = "hidden";

  let released = false;
  return () => {
    if (released) return;
    released = true;
    activeLocks -= 1;

    if (activeLocks === 0) {
      if (lockedBody) lockedBody.style.overflow = overflowBeforeLock;
      overflowBeforeLock = "";
      lockedBody = null;
    }
  };
}
