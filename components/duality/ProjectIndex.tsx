"use client";

import { projects, type Project } from "@/content/duality";
import { useLanguage } from "@/components/LanguageProvider";
import { dualityCopy } from "./locale";

const Arrow = () => <svg aria-hidden="true" viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M5 19 19 5M5 5h14v14" stroke="currentColor" strokeWidth="1.4" /></svg>;

const focusLabel = (project: Project) => project.discipline
  .toLowerCase()
  .replace(/\b\w/g, letter => letter.toUpperCase())
  .replace(/\bAi\b/g, "AI")
  .replace(/\bOcr\b/g, "OCR");

export default function ProjectIndex({ open }: { open: (index: number) => void }) {
  const { language } = useLanguage();
  const copy = dualityCopy[language === "en" ? "en" : "pt"].projects;
  return <section className="project-index" id="work" aria-label={copy.tableLabel}>
    <div className="project-table-wrap">
      <table className="project-table">
        <caption className="sr-only">{copy.caption}</caption>
        <colgroup><col /><col /><col /><col /></colgroup>
        <thead><tr><th scope="col">{copy.project}</th><th scope="col">{copy.focus}</th><th scope="col">{copy.technologies}</th><th scope="col">{copy.view}</th></tr></thead>
        <tbody>{projects.map((project, index) => <tr key={project.name}>
          <th scope="row"><button className="project-table-name" type="button" onClick={() => open(index)} aria-label={copy.open(project.name)}>{project.name}</button></th>
          <td>{language === "en" ? focusLabel(project) : project.disciplinePt ?? project.discipline}</td>
          <td className="project-table-technologies">{project.stack?.join(" · ") ?? "—"}</td>
          <td className="project-table-view"><button type="button" onClick={() => open(index)} aria-label={copy.viewProject(project.name)}><Arrow /></button></td>
        </tr>)}</tbody>
      </table>
    </div>
  </section>;
}
