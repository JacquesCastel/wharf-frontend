import Image from 'next/image';
import Link from 'next/link';
import type { PublishedProject } from '../lib/projects';
import { AI_PROJECT_ID } from '../lib/content-paths';
import './content-paths.css';

export default function ProjectProof({ project, anchorId, headingLevel = 3 }: { project: PublishedProject; anchorId?: string; headingLevel?: 3 | 4 }) {
  const isAI = project.documentId === AI_PROJECT_ID;
  const Heading = headingLevel === 4 ? 'h4' : 'h3';
  return <article className="project-proof" id={anchorId}>
    {project.vignette?.url && <Link href={`/work/${project.documentId}`} className="project-proof-image" aria-label={`Découvrir le projet : ${project.titre}`}>
      <Image src={project.vignette.url} alt={project.vignette.alternativeText || ''} width={project.vignette.width || 1200} height={project.vignette.height || 675} sizes="(max-width: 760px) 100vw, 50vw" />
      <span className="project-proof-image-label">{isAI ? 'EXPLORATION IA' : 'RÉALISATION WHARF'}</span>
    </Link>}
    <div className="project-proof-copy">
      <p className="project-proof-label">{isAI ? 'Démonstration · Test d’avant-vente' : 'Une réalisation à découvrir'}</p>
      <Heading>{project.titre}</Heading>
      <p>{isAI ? 'Du scénario aux images, du montage au son : un test pour montrer comment Wharf donne forme à un univers avec l’IA.' : project.description_courte}</p>
      {isAI && <p className="project-proof-note">Scénario · Direction artistique · Images · Montage · Son</p>}
      <Link href={`/work/${project.documentId}`} className="card-split-link">{isAI ? 'Explorer le film et les images' : 'Découvrir le projet'} <span aria-hidden="true">→</span></Link>
    </div>
  </article>;
}
