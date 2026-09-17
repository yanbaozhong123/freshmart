import type { ReactNode } from 'react';
import type { ArtKey } from '../types';

/**
 * 纯代码绘制的生鲜插画：扁平色块 + 1px 橄榄描边。
 * 每种商品一个构图，保证任何网络环境下都不破图。
 */
export default function ProduceArt({
  art,
  bg = '#eef8d2',
  className,
}: {
  art: ArtKey;
  bg?: string;
  className?: string;
}) {
  return (
    <svg viewBox="0 0 120 120" className={className} role="img" aria-label={art}>
      <rect width="120" height="120" fill={bg} />
      {ARTS[art]}
    </svg>
  );
}

const OL = '#5c693d';
const DK = '#1f2611';
const CH = '#c4c800';
const WT = '#fdfff5';

const ARTS: Record<ArtKey, ReactNode> = {
  apple: (
    <g stroke={DK} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M60 38c-6-10-20-12-28-2-10 12-6 34 8 46 8 7 14 7 20 3 6 4 12 4 20-3 14-12 18-34 8-46-8-10-22-8-28 2z" fill="#e2574c" />
      <path d="M60 36c0-8 2-14 8-18" fill="none" />
      <path d="M66 22c8-6 16-4 18 2-6 6-14 6-18-2z" fill={CH} />
      <ellipse cx="44" cy="56" rx="5" ry="9" fill="#f2a099" stroke="none" opacity="0.8" />
    </g>
  ),
  banana: (
    <g stroke={DK} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M22 34c6 38 30 58 66 56 8 0 12-4 10-8-34 4-58-14-66-52z" fill={CH} />
      <path d="M30 30c8 40 34 62 68 58" fill="none" />
      <path d="M22 34l-4-8 8-2 4 8z" fill={OL} />
      <path d="M98 82l6 2-2 8-8-2z" fill={OL} />
    </g>
  ),
  orange: (
    <g stroke={DK} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
      <circle cx="52" cy="70" r="34" fill="#f0a13c" />
      <circle cx="84" cy="58" r="24" fill="#e8892b" />
      <path d="M84 34c4-6 12-8 16-6-2 6-10 10-16 6z" fill={OL} />
      <path d="M52 36c2-4 6-6 8-6-1 4-5 7-8 6z" fill={OL} />
      <circle cx="42" cy="60" r="3" fill={WT} stroke="none" opacity="0.7" />
      <circle cx="78" cy="50" r="2.5" fill={WT} stroke="none" opacity="0.7" />
    </g>
  ),
  strawberry: (
    <g stroke={DK} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M60 40c16 0 30 10 30 26 0 20-18 36-30 40-12-4-30-20-30-40 0-16 14-26 30-26z" fill="#e23b4e" />
      <path d="M60 40c-4-8-2-14 2-18 4 4 6 10 2 18" fill={OL} />
      <path d="M44 42c-6-4-8-10-6-14 6 1 10 6 12 12M76 42c6-4 8-10 6-14-6 1-10 6-12 12" fill={CH} />
      <g fill={CH} stroke="none">
        <circle cx="48" cy="62" r="2" /><circle cx="62" cy="58" r="2" /><circle cx="74" cy="66" r="2" />
        <circle cx="54" cy="76" r="2" /><circle cx="68" cy="82" r="2" /><circle cx="60" cy="94" r="2" />
      </g>
    </g>
  ),
  grape: (
    <g stroke={DK} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M60 30c0-6 2-10 6-14" fill="none" />
      <path d="M62 20c8-6 16-4 18 2-6 6-14 6-18-2z" fill={OL} />
      {[[60,42],[46,50],[74,50],[38,64],[60,62],[82,64],[48,80],[72,80],[60,94]].map(([x,y],i)=>(
        <circle key={i} cx={x} cy={y} r="11" fill={i%3===0?'#7b4d9e':'#8f63b3'} />
      ))}
    </g>
  ),
  greens: (
    <g stroke={DK} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M60 100V52" fill="none" />
      <path d="M60 56C44 52 34 38 36 24c16 2 26 14 28 30z" fill={CH} />
      <path d="M60 56c16-4 26-18 24-32-16 2-26 14-28 30z" fill="#8fce5d" />
      <path d="M60 52C50 40 50 24 60 14c10 10 10 26 0 38z" fill="#6db33f" />
      <path d="M44 100h32l-4-24H48z" fill={WT} />
    </g>
  ),
  tomato: (
    <g stroke={DK} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
      <circle cx="46" cy="72" r="28" fill="#e2574c" />
      <circle cx="82" cy="66" r="22" fill="#d94338" />
      <path d="M46 46l-3-8M82 44l-2-7" fill="none" />
      <path d="M46 44c-8-2-14-8-14-14 8 0 14 4 16 10zM46 44c8-2 14-8 14-14-8 0-14 4-16 10z" fill={OL} />
      <path d="M82 42c-6-2-10-6-10-11 6 0 11 3 12 8z" fill={OL} />
    </g>
  ),
  carrot: (
    <g stroke={DK} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M42 44c14-10 34-8 40 6L58 98c-4 8-14 8-16-2z" fill="#e8892b" />
      <path d="M46 40c-4-10 0-20 6-26 4 6 4 16 0 24M56 38c0-12 6-20 14-24 2 8-2 18-8 24" fill={CH} />
      <path d="M50 60l14-4M48 74l14-4" fill="none" opacity="0.6" />
    </g>
  ),
  broccoli: (
    <g stroke={DK} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M52 66h16l4 34H48z" fill="#b7cf8e" />
      <circle cx="44" cy="48" r="16" fill={OL} />
      <circle cx="66" cy="40" r="18" fill="#6db33f" />
      <circle cx="82" cy="54" r="14" fill={OL} />
      <circle cx="58" cy="56" r="16" fill="#8fce5d" />
    </g>
  ),
  chicken: (
    <g stroke={DK} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M34 58c0-20 16-34 34-32 18 2 28 16 26 32-2 18-16 30-32 30S34 76 34 58z" fill="#f2c14e" />
      <circle cx="88" cy="42" r="10" fill="#f2c14e" />
      <path d="M96 40l10 2-8 6z" fill={CH} />
      <circle cx="90" cy="40" r="2" fill={DK} stroke="none" />
      <path d="M52 44c4-4 10-4 14 0M44 56c6-6 16-6 22 0" fill="none" opacity="0.55" />
      <path d="M44 86l-4 12M56 88l-2 12" fill="none" />
    </g>
  ),
  steak: (
    <g stroke={DK} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M30 70c0-22 20-36 42-32 16 3 24 14 22 28-2 16-18 28-38 28-16 0-26-10-26-24z" fill="#c14b41" />
      <path d="M42 70c0-14 14-24 30-21 10 2 16 9 15 18-1 10-12 18-26 18-11 0-19-6-19-15z" fill="#e8a08e" />
      <path d="M52 66c2-6 10-9 16-7" fill="none" opacity="0.7" />
      <path d="M34 52l-8-6M88 44l8-8" fill="none" opacity="0.5" />
    </g>
  ),
  fish: (
    <g stroke={DK} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M22 62c14-18 40-24 60-14l16-12c2 14 2 24 0 34l-16-10c-20 12-46 8-60 2z" fill="#9fd0de" />
      <circle cx="40" cy="56" r="3.5" fill={DK} stroke="none" />
      <path d="M56 48c8-2 16-2 24 2M56 62c8 2 16 2 24-2" fill="none" opacity="0.6" />
      <path d="M70 34c6-8 16-10 22-8-2 8-10 12-18 12" fill={CH} />
    </g>
  ),
  shrimp: (
    <g stroke={DK} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M36 84c-8-8-10-22-2-32 10-12 30-14 42-4 6 5 8 12 6 18L64 88c-10 4-20 2-28-4z" fill="#f08a4b" />
      <path d="M44 78c-5-6-6-14-1-20 6-8 18-9 26-3" fill="none" opacity="0.6" />
      <path d="M82 62l18-8-6 14 12 2-20 10" fill={CH} />
      <circle cx="42" cy="60" r="2.5" fill={DK} stroke="none" />
      <path d="M52 44l-6-10M62 42l-2-12M72 44l2-10" fill="none" />
    </g>
  ),
  crab: (
    <g stroke={DK} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
      <ellipse cx="60" cy="72" rx="26" ry="18" fill="#e2574c" />
      <circle cx="50" cy="56" r="4" fill={WT} />
      <circle cx="70" cy="56" r="4" fill={WT} />
      <circle cx="50" cy="56" r="1.6" fill={DK} stroke="none" />
      <circle cx="70" cy="56" r="1.6" fill={DK} stroke="none" />
      <path d="M38 64C26 58 20 46 24 36c10 2 18 12 20 24M82 64c12-6 18-18 14-28-10 2-18 12-20 24" fill="#e8892b" />
      <path d="M36 82l-14 8M44 88l-10 10M84 82l14 8M76 88l10 10" fill="none" />
    </g>
  ),
  eggs: (
    <g stroke={DK} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M24 78h72l-6 22H30z" fill={CH} />
      <ellipse cx="44" cy="60" rx="11" ry="14" fill={WT} />
      <ellipse cx="62" cy="56" rx="11" ry="14" fill={WT} />
      <ellipse cx="78" cy="62" rx="11" ry="14" fill={WT} />
      <path d="M30 78h60" fill="none" />
    </g>
  ),
  milk: (
    <g stroke={DK} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M44 40h32v54c0 6-4 10-10 10H54c-6 0-10-4-10-10z" fill={WT} />
      <path d="M44 40l6-16h20l6 16" fill="#cfe3f2" />
      <path d="M50 24h20" fill="none" />
      <path d="M44 62h32v22c0 6-4 10-10 10H54c-6 0-10-4-10-10z" fill={CH} />
      <path d="M56 70c2-4 8-4 10 0s-2 8-5 9c-3-1-7-5-5-9z" fill={WT} stroke="none" />
    </g>
  ),
};
