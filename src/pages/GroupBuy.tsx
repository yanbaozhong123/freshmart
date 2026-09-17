import { Users, Zap } from 'lucide-react';
import { productById } from '../data';
import { useStore } from '../store';
import { Countdown, Pill, Price, SectionHeader } from '../components/bits';
import ProduceArt from '../components/ProduceArt';
import { cn } from '../lib/utils';

export default function GroupBuyPage() {
  const { groups } = useStore();
  return (
    <div className="pb-24">
      {/* 页头 */}
      <div className="border-b border-[#1f2611] bg-[#c4c800] px-4 pb-4 pt-5">
        <p className="num text-[10px] font-bold tracking-[0.22em] text-[#1f2611]/70">GROUP BUY / 限时团购</p>
        <h1 className="mt-1 text-2xl font-black leading-tight text-[#1f2611]">人多力量大 · 好价拼出来</h1>
        <p className="mt-1 text-[12px] font-medium text-[#1f2611]/75">
          达到成团人数即享团购价，未满人数自动退款。
        </p>
      </div>

      <SectionHeader index="01" eyebrow="LIVE NOW" title={`${groups.length} 个团正在拼`} />

      <div className="space-y-3 px-4">
        {groups.map((g) => (
          <GroupCard key={g.id} groupId={g.id} />
        ))}
      </div>

      <p className="num mt-6 text-center text-[10px] tracking-[0.2em] text-[#5c693d]/70">
        MORE DEALS EVERY HOUR · 每小时上新
      </p>
    </div>
  );
}

function GroupCard({ groupId }: { groupId: string }) {
  const { groups, joinedGroupIds, joinGroup, openSheet } = useStore();
  const g = groups.find((x) => x.id === groupId)!;
  const p = productById(g.productId);
  const price = p.groupPrice ?? p.price;
  const joined = joinedGroupIds.includes(g.id);
  const percent = Math.min(100, Math.round((g.joined / g.size) * 100));
  const full = g.joined >= g.size;

  return (
    <article className="overflow-hidden rounded-[9px] border-2 border-[#1f2611] bg-[#fdfff5] shadow-[3px_3px_0_#1f2611]">
      <div className="flex gap-3 p-3">
        <button onClick={() => openSheet({ kind: 'product', productId: p.id })} className="shrink-0">
          <ProduceArt art={p.art} className="h-24 w-24 rounded-[9px] border border-[#5c693d]/50" />
        </button>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-1.5">
            <span className="flex items-center gap-0.5 rounded-full border border-[#1f2611] bg-[#c4c800] px-1.5 py-0.5 text-[9px] font-black text-[#1f2611]">
              <Zap size={9} strokeWidth={3} />
              {g.size}人团
            </span>
            <Countdown endsAt={g.endsAt} />
          </div>
          <h3 className="mt-1.5 truncate text-[15px] font-black text-[#1f2611]">{p.name}</h3>
          <p className="truncate text-[11px] text-[#5c693d]">{p.subtitle} · {p.unit}</p>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <Price value={price} size="lg" />
            <span className="num text-[11px] text-[#5c693d] line-through">¥{p.price}</span>
            <Pill className="ml-auto border-[#e2574c] text-[#e2574c]">
              省 ¥{(p.price - price).toFixed(1)}
            </Pill>
          </div>
        </div>
      </div>

      {/* 成团进度 */}
      <div className="border-t border-dashed border-[#5c693d]/50 px-3 py-2.5">
        <div className="flex items-center justify-between text-[10px] font-medium text-[#5c693d]">
          <span className="flex items-center gap-1">
            <Users size={11} />
            已拼 {g.joined}/{g.size} 人 · 已抢 {g.sold}/{g.total} 份
          </span>
          <span className="num font-bold text-[#1f2611]">{percent}%</span>
        </div>
        <div className="mt-1.5 h-2 overflow-hidden rounded-full border border-[#1f2611]/60 bg-[#f7ffe4]">
          <div className="h-full bg-[#c4c800] transition-[width] duration-500" style={{ width: `${percent}%` }} />
        </div>
        <button
          disabled={joined}
          onClick={() => joinGroup(g.id)}
          className={cn(
            'mt-2.5 w-full rounded-full border border-[#1f2611] py-2.5 text-[13px] font-black transition-all',
            joined
              ? 'cursor-default bg-[#eef8d2] text-[#5c693d]'
              : full
                ? 'bg-[#1f2611] text-[#c4c800] shadow-[2px_2px_0_#c4c800] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none'
                : 'bg-[#c4c800] text-[#1f2611] shadow-[2px_2px_0_#1f2611] active:translate-x-[1px] active:translate-y-[1px] active:shadow-none',
          )}
        >
          {joined ? '已参团 · 待成团' : full ? '团已满 · 看看别的' : `¥${price} 立即参团`}
        </button>
      </div>
    </article>
  );
}
