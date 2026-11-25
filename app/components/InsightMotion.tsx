import MotionPlayer from './MotionPlayer';
import { articleMotion } from '../lib/insight-motions';
import './insight-motion.css';

const timestamp = (seconds: number) => `00:${String(seconds).padStart(2, '0')}`;

export default function InsightMotion({ theme, slug }: { theme: string; slug: string }) {
  const preview = process.env.VERCEL_ENV === 'preview' || process.env.NODE_ENV === 'development';
  const motion = articleMotion(theme, slug, preview);
  if (!motion) return null;
  return <section className="insight-motion" aria-labelledby={`motion-${motion.id}`}>
    <p className="editorial-eyebrow">Le sujet en mouvement · {motion.duration} secondes</p>
    <h2 id={`motion-${motion.id}`}>{motion.title}</h2>
    {motion.status === 'draft' && <p>Nouvel épisode — version de travail.</p>}
    <p>{motion.description}</p>
    <MotionPlayer id={motion.id} title={motion.title} />
    <details className="insight-motion-transcript">
      <summary>Lire la transcription du motion</summary>
      <ol>{motion.transcript.map(cue => <li key={cue.start}>
        <span className="insight-motion-time">{timestamp(cue.start)}–{timestamp(cue.end)}</span> {cue.text}
      </li>)}</ol>
    </details>
  </section>;
}
