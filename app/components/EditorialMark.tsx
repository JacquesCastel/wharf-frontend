/** A decorative composition in the colours of the Wharf manifesto. */
export default function EditorialMark({ className = '', variant = 'orbit' }: { className?: string; variant?: 'orbit' | 'arches' | 'frames' }) {
  return <div className={`editorial-mark ${className}`} aria-hidden="true">
    <svg viewBox="0 0 320 320" fill="none" focusable="false">
      {variant === 'arches' ? <>
        <rect data-scroll-shift="75" data-scroll-turn="8" x="68" y="60" width="170" height="206" rx="85" fill="var(--scene-lilac)" />
        <path data-scroll-shift="-110" data-scroll-drift="24" d="M32 262V128a104 104 0 0 1 208 0v134M56 262V128a80 80 0 0 1 160 0v134M80 262V128a56 56 0 0 1 112 0v134" stroke="var(--scene-ink)" />
        <circle data-scroll-shift="-160" data-scroll-drift="-20" cx="240" cy="245" r="30" fill="var(--scene-peach)" />
      </> : variant === 'frames' ? <>
        <rect data-scroll-shift="100" data-scroll-turn="-9" x="34" y="95" width="160" height="130" fill="var(--scene-sage)" />
        <rect data-scroll-shift="-125" data-scroll-turn="12" x="106" y="58" width="170" height="148" fill="var(--scene-peach)" />
        <rect data-scroll-shift="-50" data-scroll-turn="-15" x="62" y="92" width="204" height="166" stroke="var(--scene-ink)" />
        <circle data-scroll-shift="150" data-scroll-drift="-30" cx="259" cy="235" r="16" fill="var(--scene-lilac)" />
      </> : <>
      <circle data-scroll-shift="85" data-scroll-drift="-35" data-scroll-zoom="0.08" cx="165" cy="163" r="112" fill="var(--scene-lilac)" />
      <path data-scroll-shift="-90" data-scroll-drift="35" d="M29 196C84 132 164 87 272 81" stroke="var(--scene-ink)" strokeWidth="1" />
      <g transform="rotate(-43 159 157)"><ellipse data-scroll-shift="-115" data-scroll-turn="24" cx="159" cy="157" rx="145" ry="57" stroke="var(--scene-ink)" strokeWidth="1" /></g>
      <circle data-scroll-shift="-170" data-scroll-drift="45" cx="267" cy="79" r="24" fill="var(--scene-peach)" />
      <circle data-scroll-shift="150" data-scroll-drift="-35" cx="54" cy="237" r="13" fill="var(--scene-sage)" />
      <path data-scroll-shift="-50" data-scroll-turn="-18" d="M164 119v88M120 163h88" stroke="var(--scene-ink)" strokeWidth="1" />
      </>}
    </svg>
  </div>;
}
