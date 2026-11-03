import Experience from "@/components/duality/Experience";
import { loadPhotography } from "@/lib/photography";

export default async function Home() {
  const library = await loadPhotography();
  return <Experience library={library} />;
}
