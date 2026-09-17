import { Home, ShoppingBasket, Users, UserRound } from 'lucide-react';
import { useStore } from '../store';
import type { TabKey } from '../types';
import { cn } from '../lib/utils';

const TABS: { key: TabKey; label: string; icon: typeof Home }[] = [
  { key: 'home', label: '首页', icon: Home },
  { key: 'group', label: '团购', icon: Users },
  { key: 'cart', label: '菜篮', icon: ShoppingBasket },
  { key: 'mine', label: '我的', icon: UserRound },
];

export default function TabBar() {
  const { tab, setTab, cartCount } = useStore();
  return (
    <nav className="absolute inset-x-0 bottom-0 z-30 grid h-16 grid-cols-4 border-t-2 border-[#1f2611] bg-[#f7ffe4]">
      {TABS.map(({ key, label, icon: Icon }) => {
        const active = tab === key;
        return (
          <button
            key={key}
            onClick={() => setTab(key)}
            className="relative flex flex-col items-center justify-center gap-0.5"
          >
            <span className="relative">
              <Icon
                size={20}
                strokeWidth={active ? 2.6 : 2}
                className={active ? 'text-[#1f2611]' : 'text-[#5c693d]/70'}
              />
              {key === 'cart' && cartCount > 0 && (
                <span className="num pop-in absolute -right-2 -top-1.5 grid h-3.5 min-w-3.5 place-items-center rounded-full border border-[#1f2611] bg-[#e2574c] px-0.5 text-[8px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </span>
            <span
              className={cn(
                'text-[10px] font-bold tracking-wide',
                active ? 'text-[#1f2611]' : 'text-[#5c693d]/70',
              )}
            >
              {label}
            </span>
            {active && <span className="absolute -top-[2px] h-[3px] w-8 rounded-full bg-[#c4c800]" />}
          </button>
        );
      })}
    </nav>
  );
}
