import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";
import { photographs as demoPhotographs, type Photograph } from "@/content/duality";

const supported = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);
const order = new Intl.Collator("pt-BR", { numeric: true, sensitivity: "base" });
// Don't retain file handles: photos must be replaceable/removable on Windows.
sharp.cache({ files: 0 });

export async function loadPhotography() {
  const root = path.join(process.cwd(), "public", "photos", "portfolio");
  const files: string[] = [];
  async function scan(folder: string) {
    let entries;
    try { entries = await readdir(folder, { withFileTypes: true }); }
    catch (error) { if ((error as NodeJS.ErrnoException).code === "ENOENT") return; throw error; }
    for (const entry of entries) {
      if (entry.name.startsWith(".")) continue;
      const file = path.join(folder, entry.name);
      if (entry.isDirectory()) await scan(file);
      else if (entry.isFile() && supported.has(path.extname(entry.name).toLowerCase())) files.push(file);
    }
  }
  await scan(root);
  files.sort((a, b) => order.compare(path.relative(root, a), path.relative(root, b)));
  const photographs: Photograph[] = [];
  for (const file of files) {
    try {
      const metadata = await sharp(await readFile(file)).metadata();
      if (!metadata.width || !metadata.height) continue;
      const rotated = metadata.orientation && metadata.orientation >= 5 && metadata.orientation <= 8;
      const relative = path.relative(root, file).split(path.sep);
      const filename = path.basename(file, path.extname(file));
      const title = filename.replace(/^\d+[\s._-]+/, "").replace(/[_-]+/g, " ").trim() || filename;
      const collection = relative.length > 1 ? relative.slice(0, -1).join(" / ") : "Portfolio";
      photographs.push({
        src: `/photos/portfolio/${relative.map(encodeURIComponent).join("/")}`,
        title,
        alt: title,
        collection,
        width: rotated ? metadata.height : metadata.width,
        height: rotated ? metadata.width : metadata.height,
      });
    } catch {
      console.warn(`[photography] Imagem ignorada: ${path.relative(root, file)}. Verifique se o arquivo pode ser aberto.`);
    }
  }
  return photographs.length ? { photographs, photographyIsDemo: false } : { photographs: demoPhotographs, photographyIsDemo: true };
}
