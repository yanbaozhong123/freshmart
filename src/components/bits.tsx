import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { Minus, Plus } from 'lucide-react';
import { FREE_SHIP_THRESHOLD, fmtCountdown, fmtPrice } from '../data';
import { cn } from '../lib/utils';

/** 胶囊标签：1px 橄榄描边 + 2rem 圆角，核心组件语言 */
export function Pill({
  children,
  solid = false,
  dark = false,
  className,
  onClick,
}: {
  children: ReactNode;
  solid?: boolean;
  dark?: boolean;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <span
      onClick={onClick}
      className={cn(
        'inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-[10px] font-medium tracking-tag leading-4',
        solid
          ? dark
            ? 'border-[#1f2611] bg-[#1f2611] text-[#f7ffe4]'
            : 'border-[#5c693d] bg-[#5c693d] text-[#f7ffe4]'
          : dark
            ? 'border-[#f7ffe4]/50 text-[#f7ffe4]'
            : 'border-[#5c693d]/60 text-[#5c693d]',
        onClick && 'cursor-pointer transition-colors hover:bg-[#5c693d] hover:text-[#f7ffe4]',
        className,
      )}
    >
      {children}
    </span>
  );
}

/** 数量步进器：加购核心交互 */
export function Stepper({
  qty,
  onChange,
  small,
}: {
  qty: number;
  onChange: (q: number) => void;
  small?: boolean;
}) {
  const btn = cn(
    'grid place-items-center rounded-full border border-[#1f2611] bg-[#fdfff5] text-[#1f2611] transition-transform active:scale-90',
    small ? 'h-5 w-5' : 'h-6 w-6',
  );
  if (qty === 0) {
    return (
      <button
        onClick={(e) => {
          e.stopPropagation();
          onChange(1);
        }}
        className={cn(
          'grid place-items-center rounded-full border border-[#1f2611] bg-[#c4c800] text-[#1f2611] shadow-[2px_2px_0_#1f2611] transition-transform active:translate-x-[1px] active:translate-y-[1px] active:shadow-none',
          small ? 'h-5 w-5' : 'h-6 w-6',
        )}
        aria-label="加入菜篮"
      >
        <Plus size={small ? 12 : 14} strokeWidth={2.5} />
      </button>
    );
  }
  return (
    <div className="flex items-center gap-1.5" onClick={(e) => e.stopPropagation()}>
      <button onClick={() => onChange(qty - 1)} className={btn} aria-label="减少">
        <Minus size={small ? 12 : 14} strokeWidth={2.5} />
      </button>
      <span key={qty} className="num pop-in min-w-4 text-center text-xs font-bold text-[#1f2611]">
        {qty}
      </span>
      <button
        onClick={() => onChange(qty + 1)}
        className="grid h-6 w-6 place-items-center rounded-full border border-[#1f2611] bg-[#c4c800] text-[#1f2611] transition-transform active:scale-90"
        aria-label="增加"
      >
        <Plus size={14} strokeWidth={2.5} />
      </button>
    </div>
  );
}

/** 倒计时：基于绝对截止时间每秒刷新 */
export function Countdown({ endsAt, dark }: { endsAt?: number; dark?: boolean }) {
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (!endsAt) return null;
  const left = endsAt - now;
  return (
    <span
      className={cn(
        'num inline-flex items-center gap-1 rounded-md border px-1.5 py-0.5 text-[11px] font-bold tabular-nums',
        dark ? 'border-[#f7ffe4]/40 text-[#f7ffe4]' : 'border-[#1f2611]/30 bg-[#1f2611] text-[#c4c800]',
      )}
    >
      <span className={cn('inline-block h-1.5 w-1.5 rounded-full', left < 60000 ? 'blink bg-red-500' : 'bg-[#c4c800]', dark && left >= 60000 && 'bg-[#1f2611]')} />
      {left <= 0 ? '已结束' : fmtCountdown(left)}
    </span>
  );
}

/** 免运费进度条：黄绿（chartreuse）签名色 */
export function FreeShipBar({ total, compact }: { total: number; compact?: boolean }) {
  const pct = Math.min(100, Math.round((total / FREE_SHIP_THRESHOLD) * 100));
  const done = total >= FREE_SHIP_THRESHOLD;
  return (
    <div className={cn('w-full', compact ? 'px-0' : 'px-4')}>
      {!compact && (
        <p className="mb-1.5 text-[11px] font-medium text-[#5c693d]">
          {done ? (
            <>
              <span className="num font-bold text-[#1f2611]">¥{FREE_SHIP_THRESHOLD}</span> 已凑够，免配送费
            </>
          ) : (
            <>
              再买 <span className="num font-bold text-[#1f2611]">¥{fmtPrice(FREE_SHIP_THRESHOLD - total)}</span> 免配送费
            </>
          )}
        </p>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full border border-[#1f2611]/70 bg-[#fdfff5]">
        <div
          className="h-full rounded-full bg-[#c4c800] transition-[width] duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

/** 价格：大号数字 + 小单位 */
export function Price({ value, size = 'md' }: { value: number; size?: 'md' | 'lg' }) {
  const [int, dec] = fmtPrice(value).split('.');
  return (
    <span className="num font-bold leading-none text-[#1f2611]">
      <span className={size === 'lg' ? 'text-xs' : 'text-[10px]'}>¥</span>
      <span className={size === 'lg' ? 'text-2xl' : 'text-base'}>{int}</span>
      {dec && <span className={size === 'lg' ? 'text-sm' : 'text-[10px]'}>.{dec}</span>}
    </span>
  );
}

/** 首字头像：色相随机，1px 深橄榄描边 */
export function Avatar({ name, hue, size = 32 }: { name: string; hue: number; size?: number }) {
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full border border-[#1f2611] font-bold text-[#1f2611]"
      style={{
        width: size,
        height: size,
        background: `hsl(${hue} 62% 68%)`,
        fontSize: size * 0.42,
      }}
    >
      {name.slice(0, 1)}
    </span>
  );
}

/** 区块标题：编号 + 大写英文 eyebrow + 中文标题 */
export function SectionHeader({
  index,
  eyebrow,
  title,
  action,
  dark,
}: {
  index: string;
  eyebrow: string;
  title: string;
  action?: ReactNode;
  dark?: boolean;
}) {
  return (
    <div className={cn('flex items-end justify-between px-4 pb-2.5 pt-5', dark && 'text-[#f7ffe4]')}>
      <div>
        <p className={cn('num text-[10px] tracking-[0.18em]', dark ? 'text-[#f7ffe4]/60' : 'text-[#5c693d]/80')}>
          {index} / {eyebrow}
        </p>
        <h2 className={cn('mt-0.5 text-lg font-black leading-tight', dark ? 'text-[#f7ffe4]' : 'text-[#1f2611]')}>
          {title}
        </h2>
      </div>
      {action}
    </div>
  );
}

/** 底部弹层骨架 */
export function Sheet({
  children,
  onClose,
  dark,
}: {
  children: ReactNode;
  onClose: () => void;
  dark?: boolean;
}) {
  return (
    <div className="absolute inset-0 z-40 flex flex-col justify-end">
      <button
        aria-label="关闭"
        onClick={onClose}
        className="fade-in absolute inset-0 bg-[#1f2611]/60 backdrop-blur-[2px]"
      />
      <div
        className={cn(
          'sheet-up relative max-h-[86%] overflow-y-auto no-scrollbar rounded-t-3xl border-t-2 border-[#1f2611] px-4 pb-8 pt-3',
          dark ? 'bg-[#1f2611] text-[#f7ffe4]' : 'bg-[#f7ffe4]',
        )}
      >
        <div className={cn('mx-auto mb-3 h-1 w-10 rounded-full', dark ? 'bg-[#f7ffe4]/30' : 'bg-[#1f2611]/20')} />
        {children}
      </div>
    </div>
  );
}

/** 拼单进度：头像堆叠 + 空位虚线圆 */
export function MemberStack({
  members,
  capacity,
  size = 30,
}: {
  members: { name: string; avatarHue: number }[];
  capacity: number;
  size?: number;
}) {
  const slots = Array.from({ length: capacity }, (_, i) => members[i]);
  return (
    <div className="flex items-center">
      {slots.map((m, i) =>
        m ? (
          <span key={i} style={{ zIndex: 10 - i }} className="-ml-1.5 first:ml-0">
            <Avatar name={m.name} hue={m.avatarHue} size={size} />
          </span>
        ) : (
          <span
            key={i}
            style={{ zIndex: 10 - i, width: size, height: size, fontSize: size * 0.4 }}
            className="-ml-1.5 grid shrink-0 place-items-center rounded-full border border-dashed border-[#5c693d]/70 font-bold text-[#5c693d]/70 first:ml-0"
          >
            ?
          </span>
        ),
      )}
    </div>
  );
}
