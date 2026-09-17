import type { GroupBuy, Product, Team } from './types';

export const FREE_SHIP_THRESHOLD = 39; // ¥39 免配送费
export const SHIP_FEE = 5;

export const PRODUCTS: Product[] = [
  { id: 'p01', name: '红颜草莓', subtitle: '当季头茬 · 单果25g+', price: 29.9, unit: '500g', category: '水果', art: 'strawberry', tag: '秒杀', stock: 86 },
  { id: 'p02', name: '赣南脐橙', subtitle: '高山果园直采', price: 12.8, unit: '500g', category: '水果', art: 'orange', tag: '团购价 ¥9.9', groupPrice: 9.9, stock: 200 },
  { id: 'p03', name: '烟台红富士', subtitle: '脆甜多汁 · 80果径', price: 9.9, unit: '500g', category: '水果', art: 'apple', stock: 150 },
  { id: 'p04', name: '云南高山香蕉', subtitle: '自然催熟 · 无保鲜剂', price: 6.5, unit: '500g', category: '水果', art: 'banana', stock: 120 },
  { id: 'p05', name: '巨峰葡萄', subtitle: '带果粉 · 当天摘', price: 15.8, unit: '500g', category: '水果', art: 'grape', tag: '团购价 ¥12.8', groupPrice: 12.8, stock: 60 },
  { id: 'p06', name: '上海青', subtitle: '露地种植 · 凌晨采摘', price: 3.9, unit: '300g', category: '蔬菜', art: 'greens', tag: '今日鲜', stock: 300 },
  { id: 'p07', name: '普罗旺斯番茄', subtitle: '沙瓤多汁 · 可生吃', price: 8.8, unit: '500g', category: '蔬菜', art: 'tomato', tag: '有机', stock: 90 },
  { id: 'p08', name: '沙地胡萝卜', subtitle: '脆甜 · 宝宝辅食优选', price: 4.5, unit: '500g', category: '蔬菜', art: 'carrot', stock: 180 },
  { id: 'p09', name: '西兰花', subtitle: '紧实花球 · 冷链直达', price: 7.9, unit: '颗', category: '蔬菜', art: 'broccoli', stock: 140 },
  { id: 'p10', name: '清远土鸡', subtitle: '120天散养 · 现杀冷鲜', price: 39.9, unit: '半只', category: '肉禽', art: 'chicken', tag: '团购价 ¥33.9', groupPrice: 33.9, stock: 45 },
  { id: 'p11', name: '原切西冷牛排', subtitle: '谷饲200天 · 单片200g', price: 32.8, unit: '片', category: '肉禽', art: 'steak', stock: 75 },
  { id: 'p12', name: '挪威三文鱼', subtitle: '中段刺身级 · 当日切', price: 68.0, unit: '200g', category: '海鲜', art: 'fish', tag: '今日鲜', stock: 30 },
  { id: 'p13', name: '基围虾', subtitle: '活冻锁鲜 · 30-40头', price: 45.8, unit: '500g', category: '海鲜', art: 'shrimp', tag: '团购价 ¥38.8', groupPrice: 38.8, stock: 55 },
  { id: 'p14', name: '梭子蟹', subtitle: '舟山野生 · 满膏', price: 88.0, unit: '只', category: '海鲜', art: 'crab', stock: 24 },
  { id: 'p15', name: '土鸡蛋', subtitle: '谷物喂养 · 30枚装', price: 24.9, unit: '盒', category: '蛋奶', art: 'eggs', stock: 110 },
  { id: 'p16', name: '鲜牛奶', subtitle: '巴氏杀菌 · 950ml', price: 12.5, unit: '瓶', category: '蛋奶', art: 'milk', tag: '第二件半价', stock: 95 },
];

export const GROUP_BUYS: GroupBuy[] = [
  { id: 'g01', productId: 'p13', size: 3, joined: 2, endsInMs: 1000 * 60 * 47, sold: 38, total: 50 },
  { id: 'g02', productId: 'p02', size: 2, joined: 1, endsInMs: 1000 * 60 * 132, sold: 61, total: 80 },
  { id: 'g03', productId: 'p10', size: 5, joined: 3, endsInMs: 1000 * 60 * 26, sold: 12, total: 30 },
  { id: 'g04', productId: 'p05', size: 3, joined: 2, endsInMs: 1000 * 60 * 88, sold: 45, total: 60 },
];

export const SEED_TEAMS: Team[] = [
  {
    id: 't01',
    title: '静安寺写字楼 · 午饭后捎一单',
    owner: '阿瓜',
    ownerHue: 84,
    capacity: 4,
    endsInMs: 1000 * 60 * 34,
    freeShipThreshold: FREE_SHIP_THRESHOLD,
    note: '凑够 ¥39 免运费，各付各的，送到前台。',
    members: [
      { name: '阿瓜', avatarHue: 84, isOwner: true, paid: true, items: [{ productId: 'p12', qty: 1 }] },
      { name: '栗子', avatarHue: 30, paid: true, items: [{ productId: 'p06', qty: 2 }, { productId: 'p16', qty: 1 }] },
    ],
  },
  {
    id: 't02',
    title: '万科小区 · 今晚火锅拼单',
    owner: '毛豆妈',
    ownerHue: 200,
    capacity: 6,
    endsInMs: 1000 * 60 * 96,
    freeShipThreshold: FREE_SHIP_THRESHOLD,
    note: '还差 2 人，拼牛肉和虾滑，19:00 前截单。',
    members: [
      { name: '毛豆妈', avatarHue: 200, isOwner: true, paid: true, items: [{ productId: 'p11', qty: 2 }] },
      { name: '老周', avatarHue: 150, paid: false, items: [{ productId: 'p13', qty: 1 }] },
      { name: '小鱼', avatarHue: 260, paid: true, items: [{ productId: 'p09', qty: 1 }, { productId: 'p15', qty: 1 }] },
    ],
  },
  {
    id: 't03',
    title: '科技园 3 号楼 · 下午茶水果团',
    owner: 'Leon',
    ownerHue: 320,
    capacity: 5,
    endsInMs: 1000 * 60 * 150,
    freeShipThreshold: FREE_SHIP_THRESHOLD,
    note: '草莓和葡萄拼起来，够 5 人发车。',
    members: [{ name: 'Leon', avatarHue: 320, isOwner: true, paid: true, items: [{ productId: 'p01', qty: 1 }] }],
  },
];

export const BANNERS = [
  { id: 'b1', kicker: 'FRESH DAILY 5AM', title: '凌晨采摘\n上午到家', sub: '产地直发 · 满 ¥39 免配送费', bg: '#c4c800', ink: '#1f2611' },
  { id: 'b2', kicker: 'GROUP BUY', title: '3 人成团\n好价到手', sub: '基围虾 ¥38.8/500g · 限时 47 分钟', bg: '#1f2611', ink: '#f7ffe4' },
  { id: 'b3', kicker: 'TEAM ORDER', title: '邻里拼单\n各付各的', sub: '同小区凑单免运费 · 一键发起', bg: '#5c693d', ink: '#f7ffe4' },
];

export const productById = (id: string) => PRODUCTS.find((p) => p.id === id)!;

export const fmtPrice = (n: number) => (Number.isInteger(n) ? n.toFixed(0) : n.toFixed(2));

export const fmtCountdown = (ms: number) => {
  const s = Math.max(0, Math.floor(ms / 1000));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = s % 60;
  const pad = (x: number) => String(x).padStart(2, '0');
  return h > 0 ? `${pad(h)}:${pad(m)}:${pad(ss)}` : `${pad(m)}:${pad(ss)}`;
};

export const AVATAR_NAMES = ['桃子', '阿Ken', '草莓酱', '大熊', 'Vivi', '老陈', '柚子', 'Nora'];
