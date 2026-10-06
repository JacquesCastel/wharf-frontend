import Image from 'next/image';
import TrackedFilm from './TrackedFilm';
import { projectMediaUrl } from '../lib/projects';
import { mediaKind, videoEmbed, safeVideoLink, seriesColumns, type ProjectMediaItem } from '../lib/project-media';

export default function ProjectMediaSeries({ title, items = [], columns, projectId, blockIndex }: { title?: string; items?: ProjectMediaItem[]; columns?: number; projectId: string; blockIndex: number }) {
  return <section className="project-media-series" aria-label={title || 'Images et films du projet'}>
    {title && <h2>{title}</h2>}
    <div className={`project-media-grid project-media-columns-${seriesColumns(columns)}`}>
      {items.map((item, index) => {
        const kind = mediaKind(item.media);
        const embed = !kind ? videoEmbed(item.video_url) : undefined;
        const link = !kind && !embed ? safeVideoLink(item.video_url) : undefined;
        if (!kind && !embed && !link) return null;
        const label = item.titre || item.legende || `Film ${index + 1} du projet`;
        return <figure key={item.id ?? index} className="project-media-item">
          {kind === 'image' && item.media && <Image src={projectMediaUrl(item.media.url)} alt={item.media.alternativeText || item.legende || item.titre || ''} width={item.media.width || 1200} height={item.media.height || 800} sizes="(max-width: 760px) 100vw, (max-width: 1100px) 50vw, 600px" loading="lazy" />}
          {kind === 'video' && item.media && <TrackedFilm native src={projectMediaUrl(item.media.url)} mime={item.media.mime} poster={item.affiche?.url ? projectMediaUrl(item.affiche.url) : undefined} title={label} film={`${projectId}-${blockIndex}-${index}`} />}
          {embed && <div className="video-embed"><TrackedFilm src={embed} title={label} film={`${projectId}-${blockIndex}-${index}`} /></div>}
          {link && <a className="card-split-link" href={link} target="_blank" rel="noopener noreferrer">{label} ↗</a>}
          {(item.titre || item.legende) && <figcaption>{item.titre && <h3>{item.titre}</h3>}{item.legende && <p>{item.legende}</p>}</figcaption>}
        </figure>;
      })}
    </div>
  </section>;
}
