export type Category = '水果' | '蔬菜' | '肉禽' | '海鲜' | '蛋奶';

export interface Product {
  id: string;
  name: string;
  subtitle: string;
  price: number; // 单价 ¥
  unit: string; // 500g / 盒 / 份
  category: Category;
  art: ArtKey;
  tag?: string; // 秒杀 / 有机 / 今日鲜等
  stock: number;
  /** 团购价，存在即可参与团购 */
  groupPrice?: number;
}

export type ArtKey =
  | 'apple'
  | 'banana'
  | 'orange'
  | 'greens'
  | 'tomato'
  | 'carrot'
  | 'broccoli'
  | 'chicken'
  | 'steak'
  | 'fish'
  | 'shrimp'
  | 'crab'
  | 'eggs'
  | 'milk'
  | 'strawberry'
  | 'grape';

export interface GroupBuy {
  id: string;
  productId: string;
  size: number; // 成团人数
  joined: number; // 已参团（含模拟成员）
  /** 剩余毫秒，挂载时基于 Date.now() 计算 */
  endsInMs: number;
  /** 绝对截止时间（store 初始化时填充） */
  endsAt?: number;
  sold: number;
  total: number;
}

export interface TeamMember {
  name: string;
  avatarHue: number;
  isOwner?: boolean;
  items?: { productId: string; qty: number }[];
  paid?: boolean;
}

/** 拼单（同小区/同事一起凑单免运费，各自付各自的） */
export interface Team {
  id: string;
  title: string;
  owner: string;
  ownerHue: number;
  capacity: number;
  members: TeamMember[];
  /** 截单时间（相对毫秒） */
  endsInMs: number;
  /** 绝对截单时间（store 初始化时填充） */
  endsAt?: number;
  freeShipThreshold: number;
  note?: string;
}

export interface CartLine {
  productId: string;
  qty: number;
}

export interface Order {
  id: string;
  items: CartLine[];
  total: number;
  kind: '普通' | '团购' | '拼单';
  placedAt: number;
  status: '配送中' | '已完成' | '待成团';
}

export type TabKey = 'home' | 'group' | 'cart' | 'mine';

export type SheetState =
  | { kind: 'none' }
  | { kind: 'team-create' }
  | { kind: 'team-detail'; teamId: string }
  | { kind: 'checkout'; kind2?: '普通' | '拼单' }
  | { kind: 'group-join'; groupId: string }
  | { kind: 'product'; productId: string };
