import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import type { ReactNode } from 'react';
import { toast } from 'sonner';
import {
  FREE_SHIP_THRESHOLD,
  GROUP_BUYS,
  SEED_TEAMS,
  SHIP_FEE,
  productById,
} from './data';
import type { CartLine, GroupBuy, Order, SheetState, TabKey, Team } from './types';

interface StoreCtx {
  tab: TabKey;
  setTab: (t: TabKey) => void;
  sheet: SheetState;
  openSheet: (s: SheetState) => void;
  closeSheet: () => void;

  cart: CartLine[];
  addToCart: (productId: string, qty?: number, silent?: boolean) => void;
  setQty: (productId: string, qty: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
  shipFee: number;
  freeGap: number;

  groups: GroupBuy[];
  joinedGroupIds: string[];
  joinGroup: (groupId: string) => void;

  teams: Team[];
  createTeam: (title: string, capacity: number, note: string) => string;
  joinTeam: (teamId: string) => void;
  leaveTeam: (teamId: string) => void;
  addMemberToTeam: (teamId: string, name: string) => void;
  myTeams: string[];

  orders: Order[];
  placeOrder: (kind: Order['kind']) => void;
}

const Ctx = createContext<StoreCtx | null>(null);

const ME = '我';

const VALID_TABS: TabKey[] = ['home', 'group', 'cart', 'mine'];

/** 支持 #group / #cart / #mine 深链直达对应 Tab */
function initialTab(): TabKey {
  const h = window.location.hash.replace('#', '') as TabKey;
  return VALID_TABS.includes(h) ? h : 'home';
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [tab, setTab] = useState<TabKey>(initialTab);
  const [sheet, setSheet] = useState<SheetState>({ kind: 'none' });
  const [cart, setCart] = useState<CartLine[]>([]);
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>([]);
  const [teams, setTeams] = useState<Team[]>(() =>
    SEED_TEAMS.map((t) => ({ ...t, endsAt: Date.now() + t.endsInMs })),
  );
  const [myTeams, setMyTeams] = useState<string[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const groupSeq = useRef(0);

  // 团购倒计时基准：转成绝对时间
  const [groups] = useState<GroupBuy[]>(() =>
    GROUP_BUYS.map((g) => ({ ...g, endsAt: Date.now() + g.endsInMs })),
  );

  const openSheet = useCallback((s: SheetState) => setSheet(s), []);
  const closeSheet = useCallback(() => setSheet({ kind: 'none' }), []);

  const addToCart = useCallback((productId: string, qty = 1, silent = false) => {
    setCart((prev) => {
      const hit = prev.find((l) => l.productId === productId);
      if (hit) return prev.map((l) => (l.productId === productId ? { ...l, qty: l.qty + qty } : l));
      return [...prev, { productId, qty }];
    });
    if (!silent) toast.success(`${productById(productId).name} 已加入菜篮`);
  }, []);

  const setQty = useCallback((productId: string, qty: number) => {
    setCart((prev) =>
      qty <= 0 ? prev.filter((l) => l.productId !== productId) : prev.map((l) => (l.productId === productId ? { ...l, qty } : l)),
    );
  }, []);

  const clearCart = useCallback(() => setCart([]), []);

  const cartCount = useMemo(() => cart.reduce((s, l) => s + l.qty, 0), [cart]);
  const cartTotal = useMemo(
    () => cart.reduce((s, l) => s + productById(l.productId).price * l.qty, 0),
    [cart],
  );
  const freeGap = Math.max(0, FREE_SHIP_THRESHOLD - cartTotal);
  const shipFee = cartTotal === 0 || freeGap === 0 ? 0 : SHIP_FEE;

  const joinGroup = useCallback(
    (groupId: string) => {
      const g = groups.find((x) => x.id === groupId);
      if (!g || joinedGroupIds.includes(groupId) || g.joined >= g.size) return;
      setJoinedGroupIds((prev) => [...prev, groupId]);
      const p = productById(g.productId);
      const price = g && p.groupPrice ? p.groupPrice : p.price;
      setOrders((prev) => [
        {
          id: `GO${Date.now().toString().slice(-6)}`,
          items: [{ productId: g.productId, qty: 1 }],
          total: price,
          kind: '团购',
          placedAt: Date.now(),
          status: '待成团',
        },
        ...prev,
      ]);
      toast.success('参团成功，已成团后自动发货');
    },
    [groups, joinedGroupIds],
  );

  const createTeam = useCallback(
    (title: string, capacity: number, note: string) => {
      groupSeq.current += 1;
      const id = `tm${Date.now().toString(36)}${groupSeq.current}`;
      setTeams((prev) => [
        {
          id,
          title,
          owner: ME,
          ownerHue: 63,
          capacity,
          endsInMs: 1000 * 60 * 60,
          endsAt: Date.now() + 1000 * 60 * 60,
          freeShipThreshold: FREE_SHIP_THRESHOLD,
          note,
          members: [{ name: ME, avatarHue: 63, isOwner: true, paid: true, items: cart.map((l) => ({ ...l })) }],
        },
        ...prev,
      ]);
      setMyTeams((prev) => [...prev, id]);
      setCart([]);
      return id;
    },
    [cart],
  );

  const joinTeam = useCallback(
    (teamId: string) => {
      setTeams((prev) =>
        prev.map((t) =>
          t.id === teamId && t.members.length < t.capacity && !t.members.some((m) => m.name === ME)
            ? {
                ...t,
                members: [
                  ...t.members,
                  { name: ME, avatarHue: 63, items: cart.map((l) => ({ ...l })), paid: cart.length === 0 },
                ],
              }
            : t,
        ),
      );
      setMyTeams((prev) => (prev.includes(teamId) ? prev : [...prev, teamId]));
      if (cart.length > 0) setCart([]);
      toast.success('已加入拼单，各付各的，互不打扰');
    },
    [cart],
  );

  const leaveTeam = useCallback((teamId: string) => {
    setTeams((prev) =>
      prev
        .map((t) => (t.id === teamId ? { ...t, members: t.members.filter((m) => m.name !== ME) } : t))
        .filter((t) => t.members.length > 0),
    );
    setMyTeams((prev) => prev.filter((id) => id !== teamId));
    toast('已退出该拼单');
  }, []);

  const addMemberToTeam = useCallback((teamId: string, name: string) => {
    setTeams((prev) =>
      prev.map((t) =>
        t.id === teamId && t.members.length < t.capacity && !t.members.some((m) => m.name === name)
          ? {
              ...t,
              members: [
                ...t.members,
                { name, avatarHue: (Date.now() / 7) % 360, items: [], paid: true },
              ],
            }
          : t,
      ),
    );
  }, []);

  const placeOrder = useCallback(
    (kind: Order['kind']) => {
      if (cart.length === 0) return;
      setOrders((prev) => [
        {
          id: `O${Date.now().toString().slice(-6)}`,
          items: cart.map((l) => ({ ...l })),
          total: cartTotal + shipFee,
          kind,
          placedAt: Date.now(),
          status: '配送中',
        },
        ...prev,
      ]);
      setCart([]);
      setSheet({ kind: 'none' });
      setTab('mine');
      toast.success('下单成功，骑手已出发');
    },
    [cart, cartTotal, shipFee],
  );

  const value: StoreCtx = {
    tab,
    setTab,
    sheet,
    openSheet,
    closeSheet,
    cart,
    addToCart,
    setQty,
    clearCart,
    cartCount,
    cartTotal,
    shipFee,
    freeGap,
    groups,
    joinedGroupIds,
    joinGroup,
    teams,
    createTeam,
    joinTeam,
    leaveTeam,
    addMemberToTeam,
    myTeams,
    orders,
    placeOrder,
  };

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useStore() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
