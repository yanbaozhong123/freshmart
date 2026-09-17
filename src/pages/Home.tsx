import { useMemo, useState } from 'react';
import { ChevronRight, MapPin, Search, Zap } from 'lucide-react';
import { BANNERS, PRODUCTS, productById } from '../data';
import type { Category, Product } from '../types';
import { useStore } from '../store';
import { FreeShipBar, Pill, Price, SectionHeader, Stepper } from '../components/bits';
import ProduceArt from '../components/ProduceArt';
import { cn } from '../lib/utils';

const CATEGORIES: ('全部' | Category)[] = ['全部', '水果', '蔬菜', '肉禽', '海鲜', '蛋奶'];

export default function HomePage() {
  const [cat, setCat] = useState<'全部' | Category>('全部');
  const list = useMemo(
    () => (cat === '全部' ? PRODUCTS : PRODUCTS.filter((p) => p.category === cat)),
    [cat],
  );

  return (
    <div className="pb-24">
      <StickyHeader />
      <Banner />
      <CategoryRow active={cat} onChange={setCat} />
      <FreeShipStrip />
      <GroupTeaser />
      <SectionHeader index="01" eyebrow="DAILY FRESH" title={cat === '全部' ? '今日鲜货' : `今日鲜货 · ${cat}`} />
      <ProductGrid list={list} />
      <TeamTeaser />
    </div>
  );
}

/** 吸顶头部：54px 三段式（logo / 定位 / 菜篮） */
function StickyHeader() {
  const { cartCount, setTab } = useStore();
  return (
    <header className="sticky top-0 z-30 border-b border-[#1f2611] bg-[#f7ffe4]/95 backdrop-blur">
      <div className="flex h-[54px] items-center justify-between px-3">
        <div className="flex items-baseline gap-1.5">
          <span className="text-lg font-black tracking-tight text-[#1f2611]">鲜市</span>
          <span className="num text-[9px] font-bold tracking-[0.2em] text-[#5c693d]">FRESHMART</span>
        </div>
        <button className="flex items-center gap-1 rounded-full border border-[#5c693d]/50 px-2.5 py-1 text-[11px] font-medium text-[#5c693d]">
          <MapPin size={12} strokeWidth={2.5} />
          静安寺 · 嘉里中心
          <ChevronRight size={12} />
        </button>
        <button
          onClick={() => setTab('cart')}
          className="relative grid h-9 w-9 place-items-center rounded-full border border-[#1f2611] bg-[#c4c800] shadow-[2px_2px_0_#1f2611] transition-transform active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          aria-label="菜篮"
        >
          <BasketIcon />
          {cartCount > 0 && (
            <span className="num pop-in absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full border border-[#1f2611] bg-[#e2574c] px-0.5 text-[9px] font-bold text-white">
              {cartCount}
            </span>
          )}
        </button>
      </div>
      <div className="px-3 pb-2">
        <label className="flex h-8 items-center gap-2 rounded-full border border-[#5c693d]/50 bg-[#fdfff5] px-3 text-[12px] text-[#5c693d]/70">
          <Search size={13} />
          搜「草莓」试试，产地直采 5 点到仓
        </label>
      </div>
    </header>
  );
}

function BasketIcon() {
  return (
    <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#1f2611" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M5 9l4 10h6l4-10" />
      <path d="M3 9h18" />
      <path d="M9 9V6a3 3 0 016 0v3" />
    </svg>
  );
}

/** 交叉淡入轮播：绝对定位 slides + CSS steps 动画 */
function Banner() {
  return (
    <div className="px-3 pt-3">
      <div className="slide-frame relative aspect-[2/1] overflow-hidden rounded-[9px] border-2 border-[#1f2611]">
        {BANNERS.map((b) => (
          <div key={b.id} className="absolute inset-0" style={{ background: b.bg }}>
            <svg className="absolute right-2 top-2 float-slow opacity-90" width="72" height="72" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="52" fill="none" stroke={b.ink} strokeWidth="2" strokeDasharray="4 6" opacity="0.5" />
              <circle cx="60" cy="60" r="34" fill={b.ink === '#1f2611' ? '#f7ffe4' : '#1f2611'} opacity="0.16" />
            </svg>
            <div className="relative flex h-full flex-col justify-between p-4" style={{ color: b.ink }}>
              <p className="num text-[10px] font-bold tracking-[0.22em]">{b.kicker}</p>
              <div>
                <h3 className="whitespace-pre-line text-[26px] font-black leading-[1.12] tracking-tight">
                  {b.title}
                </h3>
                <p className="mt-1.5 text-[11px] font-medium opacity-85">{b.sub}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="mt-2 flex justify-center gap-1.5">
        {BANNERS.map((b, i) => (
          <span key={b.id} className="h-1 w-4 rounded-full bg-[#1f2611]" style={{ opacity: i === 0 ? 1 : 0.25 }} />
        ))}
      </div>
    </div>
  );
}

function CategoryRow({ active, onChange }: { active: string; onChange: (c: '全部' | Category) => void }) {
  return (
    <div className="no-scrollbar mt-3 flex gap-2 overflow-x-auto px-3">
      {CATEGORIES.map((c) => (
        <Pill
          key={c}
          solid={active === c}
          onClick={() => onChange(c)}
          className={cn('shrink-0 px-4 py-1.5 text-[12px] tracking-normal', active === c && 'shadow-[2px_2px_0_#1f2611]')}
        >
          {c}
        </Pill>
      ))}
    </div>
  );
}

function FreeShipStrip() {
  const { cartTotal } = useStore();
  return (
    <div className="mt-3 border-y border-[#5c693d]/40 bg-[#eef8d2] px-4 py-2.5">
      <FreeShipBar total={cartTotal} />
    </div>
  );
}

/** 首页团购 teaser：横向滑动的拼团卡 */
function GroupTeaser() {
  const { groups, setTab } = useStore();
  return (
    <section>
      <SectionHeader
        index="02"
        eyebrow="GROUP BUY"
        title="正在拼 · 限时团"
        action={
          <Pill dark={false} onClick={() => setTab('group')} className="shadow-[2px_2px_0_#1f2611]">
            全部 <ChevronRight size={11} />
          </Pill>
        }
      />
      <div className="no-scrollbar flex gap-2.5 overflow-x-auto px-4 pb-1">
        {groups.map((g) => {
          const p = productById(g.productId);
          const price = p.groupPrice ?? p.price;
          return (
            <button
              key={g.id}
              onClick={() => setTab('group')}
              className="w-36 shrink-0 overflow-hidden rounded-[9px] border-2 border-[#1f2611] bg-[#fdfff5] text-left shadow-[3px_3px_0_#1f2611] transition-transform active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              <div className="relative">
                <ProduceArt art={p.art} className="aspect-square w-full" />
                <span className="absolute left-1.5 top-1.5 flex items-center gap-0.5 rounded-full bg-[#c4c800] px-1.5 py-0.5 text-[9px] font-black text-[#1f2611]">
                  <Zap size={9} strokeWidth={3} />
                  {g.size}人团
                </span>
              </div>
              <div className="p-2">
                <p className="truncate text-[12px] font-bold text-[#1f2611]">{p.name}</p>
                <div className="mt-1 flex items-center justify-between">
                  <Price value={price} />
                  <span className="num text-[10px] text-[#5c693d] line-through">¥{p.price}</span>
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
}

/** 密排商品网格：图-led、文字叠左上角、最小间距 */
function ProductGrid({ list }: { list: Product[] }) {
  const { cart, addToCart, setQty, openSheet } = useStore();
  const qtyOf = (id: string) => cart.find((l) => l.productId === id)?.qty ?? 0;

  return (
    <div className="grid grid-cols-2 gap-[3px] px-[3px]">
      {list.map((p) => (
        <article
          key={p.id}
          onClick={() => openSheet({ kind: 'product', productId: p.id })}
          className="group relative cursor-pointer overflow-hidden rounded-[9px] border border-[#5c693d]/50 bg-[#fdfff5]"
        >
          <ProduceArt art={p.art} className="aspect-[5/4] w-full" />
          {/* 左上角叠字 */}
          <div className="absolute left-2 top-2">
            <p className="text-[13px] font-black leading-tight text-[#1f2611] drop-shadow-[0_1px_0_#fdfff5]">
              {p.name}
            </p>
            <p className="text-[10px] font-medium text-[#5c693d] drop-shadow-[0_1px_0_#fdfff5]">{p.subtitle}</p>
          </div>
          {p.tag && (
            <span className="absolute right-2 top-2 rounded-full border border-[#1f2611] bg-[#c4c800] px-1.5 py-0.5 text-[9px] font-black text-[#1f2611]">
              {p.tag}
            </span>
          )}
          <div className="flex items-center justify-between p-2">
            <div className="flex items-baseline gap-1">
              <Price value={p.price} />
              <span className="text-[10px] text-[#5c693d]">/{p.unit}</span>
            </div>
            <Stepper
              qty={qtyOf(p.id)}
              onChange={(q) => {
                if (q === 0) setQty(p.id, 0);
                else if (qtyOf(p.id) === 0) addToCart(p.id, q);
                else setQty(p.id, q);
              }}
            />
          </div>
        </article>
      ))}
    </div>
  );
}

/** 拼单玩法入口：深橄榄横条 */
function TeamTeaser() {
  const { openSheet, teams } = useStore();
  const hot = teams[0];
  return (
    <section className="mt-5 px-3 pb-2">
      <div className="relative overflow-hidden rounded-[9px] border-2 border-[#1f2611] bg-[#1f2611] p-4 text-[#f7ffe4] shadow-[4px_4px_0_#c4c800]">
        <p className="num text-[10px] font-bold tracking-[0.22em] text-[#c4c800]">03 / TEAM ORDER</p>
        <h3 className="mt-1 text-xl font-black leading-tight">邻里拼单 · 各付各的</h3>
        <p className="mt-1 text-[12px] leading-relaxed text-[#f7ffe4]/75">
          同小区 / 同事凑单满 ¥39 免运费。你买你的草莓，他买他的牛排，一单送到家。
        </p>
        <div className="mt-3 flex gap-2">
          <button
            onClick={() => openSheet({ kind: 'team-create' })}
            className="rounded-full border border-[#f7ffe4] bg-[#c4c800] px-4 py-2 text-[12px] font-black text-[#1f2611] transition-transform active:scale-95"
          >
            发起拼单
          </button>
          <button
            onClick={() => openSheet({ kind: 'team-detail', teamId: hot.id })}
            className="rounded-full border border-[#f7ffe4]/60 px-4 py-2 text-[12px] font-bold text-[#f7ffe4] transition-colors hover:bg-[#f7ffe4]/10"
          >
            逛逛附近的单
          </button>
        </div>
      </div>
    </section>
  );
}
