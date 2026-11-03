export const projects = [
  { name: "ClaudeFy", discipline: "AI TOOLING / WINDOWS", description: "A native Windows utility that surfaces Claude Code token usage, session limits and plan progress through system notifications.", source: "https://github.com/gusata/ClaudeFy", image: "", live: "" },
  { name: "LEIA", discipline: "AI / CODE DOCUMENTATION", description: "An AI documentation engine that reads a codebase and translates its structure into clear project documentation.", source: "https://github.com/gusata/LEIA", image: "", live: "" },
  { name: "Bob", discipline: "PRODUCT / BROWSER START PAGE", description: "A quiet browser start page for local notes and text shortcuts. Personal data stays on the device.", source: "https://github.com/gusata/Bob", image: "/work/bob.png", live: "https://bob-webpage.vercel.app/" },
  { name: "Formazzi", discipline: "FULL STACK / LEARNING", description: "A corporate training platform for courses, certifications, assessments and employee progress.", source: "https://github.com/gusata/Front_Formazzi", image: "", live: "" },
  { name: "Quiet Head", discipline: "PRODUCT / AUTOMOTIVE COMMUNITY", description: "A social space for people who share a love of cars.", source: "https://github.com/gusata/Quiet-Head", image: "/quiet.png", live: "https://quiet-head.vercel.app/" },
  { name: "Blitz", discipline: "PRODUCT / DOCUMENT OCR", description: "An AI-assisted OCR workflow that reads documents and sends extracted information into a system.", source: "", image: "/blitz3.jpeg", live: "" },
];
export type Photograph = { src: string; alt: string; title: string; collection: string; width: number; height: number };
// Temporary Unsplash demonstration collection, authorized for layout previews.
export const photographyIsDemo = true;
export const photographs: Photograph[] = [
  {
    "src": "/photos/demo/frame-01.jpg",
    "alt": "Lake and mountains in soft natural light",
    "title": "Still water",
    "collection": "DEMO / UNSPLASH",
    "width": 1800,
    "height": 1200
  },
  {
    "src": "/photos/demo/frame-02.jpg",
    "alt": "A dramatic mountain peak beneath clouds",
    "title": "Mountain air",
    "collection": "DEMO / UNSPLASH",
    "width": 1800,
    "height": 1200
  },
  {
    "src": "/photos/demo/frame-03.jpg",
    "alt": "Sunlight filtering through a green forest",
    "title": "Into the forest",
    "collection": "DEMO / UNSPLASH",
    "width": 1800,
    "height": 1199
  },
  {
    "src": "/photos/demo/frame-04.jpg",
    "alt": "Mountain silhouette under a star-filled sky",
    "title": "After dusk",
    "collection": "DEMO / UNSPLASH",
    "width": 1800,
    "height": 1201
  },
  {
    "src": "/photos/demo/frame-05.jpg",
    "alt": "Mountains and trees reflected in a calm lake",
    "title": "Reflections",
    "collection": "DEMO / UNSPLASH",
    "width": 1800,
    "height": 1200
  },
  {
    "src": "/photos/demo/frame-06.jpg",
    "alt": "A broad mountain lake and distant hills",
    "title": "Open horizon",
    "collection": "DEMO / UNSPLASH",
    "width": 1800,
    "height": 1200
  },
  {
    "src": "/photos/demo/frame-07.jpg",
    "alt": "Mountain landscape in warm sunlight",
    "title": "Far from here",
    "collection": "DEMO / UNSPLASH",
    "width": 1800,
    "height": 1196
  },
  {
    "src": "/photos/demo/frame-08.jpg",
    "alt": "Sunlit meadow and trees",
    "title": "Afternoon light",
    "collection": "DEMO / UNSPLASH",
    "width": 1800,
    "height": 1200
  }
];
export type Project = (typeof projects)[number];
