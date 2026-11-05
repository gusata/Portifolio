import Experience from "@/components/duality/Experience";
import { LanguageProvider } from "@/components/LanguageProvider";
import { loadPhotography } from "@/lib/photography";

export default async function Home() {
  const library = await loadPhotography();
  return <LanguageProvider><Experience library={library} /></LanguageProvider>;
}
