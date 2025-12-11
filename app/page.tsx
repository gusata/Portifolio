import { BackgroundSceneWrapper } from "@/components/BackgroundSceneWrapper";
import { AboutStage } from "@/components/AboutStage";
import { ContactStage } from "@/components/ContactStage";
import { HeroStage } from "@/components/HeroStage";
import { Navbar } from "@/components/Navbar";
import { ProjectGallery } from "@/components/ProjectGallery";

export default function Home() {
  return (
    <div className="relative h-screen w-full overflow-hidden bg-[#111111] text-[var(--foreground)]">
      <Navbar />
      <BackgroundSceneWrapper />
      <main className="scroll-container h-full overflow-y-scroll scroll-smooth">
        <HeroStage />
        <AboutStage />
        <ProjectGallery />
        <ContactStage />
      </main>
    </div>
  );
}
