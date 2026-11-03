import Image from 'next/image';
import Link from 'next/link';
import type { PublishedProject } from '../lib/projects';
import { AI_PROJECT_ID } from '../lib/content-paths';
import { CAFE_PROJECT_ID } from '../lib/project-editorial';
import './content-paths.css';

export default function ProjectLinks({ projects }: { projects: PublishedProject[] }) {
  if (!projects.length) return null;
  return <div className="context-projects">
    <p className="context-readings-label">Films à découvrir</p>
    <ul>{projects.map(project => <li key={project.documentId}>
      <Link href={`/work/${project.documentId}`} className="context-project-link">
        {project.vignette?.url && <Image src={project.vignette.url} alt="" width={144} height={100} sizes="88px" />}
        <span><span className="context-reading-format">{project.documentId === AI_PROJECT_ID ? 'Démonstration IA · Test d’avant-vente' : project.documentId === CAFE_PROJECT_ID ? 'Fiction · Film d’autopromotion' : project.type || 'Réalisation Wharf'}</span><span>{project.titre}</span></span>
        <span aria-hidden="true">↗</span>
      </Link>
    </li>)}</ul>
  </div>;
}
