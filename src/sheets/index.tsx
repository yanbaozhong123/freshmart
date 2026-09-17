import { useMemo, useState } from 'react';
import { Check, Clock3, Copy, Share2, ShoppingBag, Truck } from 'lucide-react';
import { toast } from 'sonner';
import { AVATAR_NAMES, FREE_SHIP_THRESHOLD, SHIP_FEE, fmtPrice, productById } from '../data';
import { useStore } from '../store';
import type { SheetState } from '../types';
import { Avatar, Countdown, FreeShipBar, MemberStack, Pill, Price, Sheet, Stepper } from '../components/bits';
import ProduceArt from '../components/ProduceArt';
import { cn } from '../lib/utils';

export default function Sheets({ sheet }: { sheet: SheetState }) {
  if (sheet.kind === 'none') return null;
  switch (sheet.kind) {
    case 'product':
      return <ProductSheet productId={sheet.productId} />;
    case 'team-create':
      return <TeamCreateSheet />;
    case 'team-detail':
      return <TeamDetailSheet teamId={sheet.teamId} />;
    case 'checkout':
      return <CheckoutSheet />;
    case 'group-join':
      return <GroupJoinSheet groupId={sheet.groupId} />;
  }
}

/** 商品详情弹层 */
function ProductSheet({ productId }: { productId: string }) {
  const { closeSheet, cart, addToCart, setQty, openSheet } = useStore();
  const p = productById(productId);
  const qty = cart.find((l) => l.productId === p.id)?.qty ?? 0;
  return (
    <Sheet onClose={closeSheet}>
      <ProduceArt art={p.art} className="aspect-[2/1] w-full rounded-[9px] border-2 border-[#1f2611]" />
      <div className="mt-3 flex items-start justify-between gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-black text-[#1f2611]">{p.name}</h3>
            {p.tag && <Pill solid>{p.tag}</Pill>}
          </div>
          <p className="mt-0.5 text-[12px] text-[#5c693d]">{p.subtitle} · 每{p.unit}</p>
        </div>
        <Stepper
          qty={qty}
          onChange={(q) => {
            if (q === 0) setQty(p.id, 0);
            else if (qty === 0) addToCart(p.id, q, true);
            else setQty(p.id, q);
          }}
        />
      </div>
      <div className="mt-2 flex items-baseline gap-2">
        <Price value={p.price} size="lg" />
        {p.groupPrice && (
          <button onClick={() => openSheet({ kind: 'group-join', groupId: `g-${p.id}` })} className="text-left">
            <Pill solid className="border-[#1f2611] shadow-[2px_2px_0_#1f2611]">
              团购价 ¥{p.groupPrice} → 去拼团
            </Pill>
          </button>
        )}
      </div>
      <ul className="mt-3 space-y-1.5 border-t border-dashed border-[#5c693d]/50 pt-3 text-[11px] text-[#5c693d]">
        <li>· 凌晨采摘，5:00 到仓，全程冷链</li>
        <li>· 不满意 24 小时无理由退</li>
        <li>· 满 ¥{FREE_SHIP_THRESHOLD} 免配送费，不满收 ¥{SHIP_FEE}</li>
      </ul>
      <button
        onClick={() => {
          if (qty === 0) addToCart(p.id, 1);
          closeSheet();
        }}
        className="mt-4 w-full rounded-full border border-[#1f2611] bg-[#c4c800] py-3 text-[14px] font-black text-[#1f2611] shadow-[3px_3px_0_#1f2611] transition-transform active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
      >
        {qty > 0 ? `已在菜篮 ×${qty}，继续逛` : '加入菜篮'}
      </button>
    </Sheet>
  );
}

/** 发起拼单：选人数、写标题、带着菜篮开团 */
function TeamCreateSheet() {
  const { closeSheet, cart, cartTotal, createTeam, openSheet } = useStore();
  const [capacity, setCapacity] = useState(3);
  const [title, setTitle] = useState('小区拼单 · 今晚一起买');
  const [note, setNote] = useState('各付各的，凑满 ¥39 免运费。');

  const canCreate = cart.length > 0;

  return (
    <Sheet onClose={closeSheet}>
      <p className="num text-[10px] font-bold tracking-[0.22em] text-[#5c693d]">TEAM ORDER / 发起拼单</p>
      <h3 className="mt-1 text-xl font-black text-[#1f2611]">带菜篮开团，喊邻居来凑</h3>

      <label className="mt-4 block text-[11px] font-bold text-[#5c693d]">拼单标题</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mt-1 w-full rounded-[9px] border border-[#5c693d]/60 bg-[#fdfff5] px-3 py-2.5 text-[13px] font-medium text-[#1f2611] outline-none focus:border-[#1f2611]"
        placeholder="给拼单起个名"
      />

      <label className="mt-3 block text-[11px] font-bold text-[#5c693d]">拼单人数（含自己）</label>
      <div className="mt-1.5 flex gap-2">
        {[2, 3, 4, 5, 6].map((n) => (
          <button
            key={n}
            onClick={() => setCapacity(n)}
            className={cn(
              'num h-9 flex-1 rounded-full border text-[13px] font-bold transition-all',
              capacity === n
                ? 'border-[#1f2611] bg-[#c4c800] text-[#1f2611] shadow-[2px_2px_0_#1f2611]'
                : 'border-[#5c693d]/50 bg-[#fdfff5] text-[#5c693d]',
            )}
          >
            {n}人
          </button>
        ))}
      </div>

      <label className="mt-3 block text-[11px] font-bold text-[#5c693d]">给拼友捎句话</label>
      <input
        value={note}
        onChange={(e) => setNote(e.target.value)}
        className="mt-1 w-full rounded-[9px] border border-[#5c693d]/60 bg-[#fdfff5] px-3 py-2.5 text-[13px] font-medium text-[#1f2611] outline-none focus:border-[#1f2611]"
      />

      {/* 我带的东西 */}
      <div className="mt-4 rounded-[9px] border border-[#5c693d]/50 bg-[#fdfff5] p-3">
        <p className="flex items-center justify-between text-[11px] font-bold text-[#5c693d]">
          <span className="flex items-center gap-1"><ShoppingBag size={12} /> 我带的菜</span>
          <span className="num">¥{fmtPrice(cartTotal)}</span>
        </p>
        {cart.length === 0 && (
          <p className="mt-2 text-[12px] text-[#5c693d]">菜篮还是空的 —— 先加几件商品再开团。</p>
        )}
        <div className="mt-2 space-y-1.5">
          {cart.map((l) => {
            const p = productById(l.productId);
            return (
              <div key={l.productId} className="flex items-center gap-2 text-[12px] text-[#1f2611]">
                <ProduceArt art={p.art} className="h-7 w-7 rounded border border-[#5c693d]/40" />
                <span className="flex-1 font-medium">{p.name}</span>
                <span className="num text-[#5c693d]">×{l.qty}</span>
              </div>
            );
          })}
        </div>
      </div>

      <button
        disabled={!canCreate}
        onClick={() => {
          const id = createTeam(title, capacity, note);
          closeSheet();
          openSheet({ kind: 'team-detail', teamId: id });
          toast.success('拼单已发起，快分享给邻居');
        }}
        className="mt-4 w-full rounded-full border border-[#1f2611] bg-[#1f2611] py-3 text-[14px] font-black text-[#c4c800] shadow-[3px_3px_0_#c4c800] transition-transform active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:opacity-40"
      >
        {canCreate ? `发起拼单 · 我的份额 ¥${fmtPrice(cartTotal)}` : '先加购商品再开团'}
      </button>
    </Sheet>
  );
}

/** 拼单详情：成员、各自清单、免运费进度、邀请模拟 */
function TeamDetailSheet({ teamId }: { teamId: string }) {
  const { teams, closeSheet, joinTeam, leaveTeam, addMemberToTeam, myTeams, cart, cartTotal, setTab } = useStore();
  const team = teams.find((t) => t.id === teamId);
  const [inviting, setInviting] = useState(false);
  const isMine = myTeams.includes(teamId);

  const teamTotal = useMemo(
    () =>
      team
        ? team.members.reduce(
            (s, m) => s + (m.items ?? []).reduce((x, it) => x + productById(it.productId).price * it.qty, 0),
            0,
          )
        : 0,
    [team],
  );
  const missing = Math.max(0, (team?.capacity ?? 0) - (team?.members.length ?? 0));

  if (!team) {
    return (
      <Sheet onClose={closeSheet}>
        <p className="py-8 text-center text-[13px] text-[#5c693d]">这个拼单已截单或解散。</p>
      </Sheet>
    );
  }

  return (
    <Sheet onClose={closeSheet}>
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="num text-[10px] font-bold tracking-[0.22em] text-[#5c693d]">TEAM / {team.id.toUpperCase()}</p>
          <h3 className="mt-1 text-lg font-black leading-tight text-[#1f2611]">{team.title}</h3>
          <p className="mt-1 flex items-center gap-1.5 text-[11px] text-[#5c693d]">
            <Avatar name={team.owner} hue={team.ownerHue} size={16} /> {team.owner} 发起 · <Clock3 size={11} />
            <Countdown endsAt={team.endsAt} />
          </p>
        </div>
        <Pill solid>{team.members.length}/{team.capacity} 人</Pill>
      </div>

      {team.note && (
        <p className="mt-3 rounded-[9px] border border-dashed border-[#5c693d]/60 bg-[#fdfff5] p-2.5 text-[12px] leading-relaxed text-[#5c693d]">
          「{team.note}」
        </p>
      )}

      <div className="mt-4">
        <div className="flex items-center justify-between">
          <MemberStack members={team.members} capacity={team.capacity} />
          {missing > 0 ? (
            <button
              onClick={() => {
                setInviting(true);
                setTimeout(() => {
                  const name = AVATAR_NAMES[Math.floor(Math.random() * AVATAR_NAMES.length)];
                  addMemberToTeam(team.id, name);
                  toast.success(`${name} 加入了拼单`);
                  setInviting(false);
                }, 900);
              }}
              disabled={inviting}
              className="flex items-center gap-1 rounded-full border border-[#1f2611] bg-[#c4c800] px-3 py-1.5 text-[11px] font-black text-[#1f2611] shadow-[2px_2px_0_#1f2611] transition-transform active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:opacity-60"
            >
              <Share2 size={12} /> {inviting ? '邀请中…' : '模拟邀请好友'}
            </button>
          ) : (
            <Pill solid dark className="pop-in"><Check size={10} /> 已拼满</Pill>
          )}
        </div>
      </div>

      {/* 全员免运费进度 */}
      <div className="mt-4 rounded-[9px] border border-[#5c693d]/50 bg-[#fdfff5] p-3">
        <p className="flex items-center justify-between text-[11px] font-bold text-[#5c693d]">
          <span className="flex items-center gap-1"><Truck size={12} /> 全单合计 ¥{fmtPrice(teamTotal)}</span>
          {teamTotal >= team.freeShipThreshold ? (
            <span className="font-black text-[#1f2611]">全员免运费</span>
          ) : (
            <span>差 ¥{fmtPrice(team.freeShipThreshold - teamTotal)}</span>
          )}
        </p>
        <div className="mt-2">
          <FreeShipBar total={teamTotal} compact />
        </div>
      </div>

      {/* 各自的清单 */}
      <div className="mt-4 space-y-2.5">
        <p className="text-[11px] font-bold tracking-tag text-[#5c693d]">各付各的 · 明细</p>
        {team.members.map((m) => {
          const mine = (m.items ?? []).reduce((s, it) => s + productById(it.productId).price * it.qty, 0);
          return (
            <div key={m.name} className="rounded-[9px] border border-[#5c693d]/40 bg-[#fdfff5] p-2.5">
              <div className="flex items-center gap-2">
                <Avatar name={m.name} hue={m.avatarHue} size={22} />
                <span className="text-[12px] font-bold text-[#1f2611]">
                  {m.name}
                  {m.isOwner && <Pill className="ml-1.5">团长</Pill>}
                </span>
                <span className="num ml-auto text-[12px] font-bold text-[#1f2611]">¥{fmtPrice(mine)}</span>
                {m.paid ? (
                  <Pill solid className="border-[#1f2611]">已付</Pill>
                ) : (
                  <Pill className="border-[#e2574c] text-[#e2574c]">待付</Pill>
                )}
              </div>
              {(m.items ?? []).length > 0 && (
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {m.items!.map((it) => {
                    const p = productById(it.productId);
                    return (
                      <span key={it.productId} className="flex items-center gap-1 rounded-md border border-[#5c693d]/40 bg-[#f7ffe4] px-1.5 py-0.5 text-[10px] text-[#5c693d]">
                        {p.name} ×{it.qty}
                      </span>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* 操作区 */}
      <div className="mt-4 flex gap-2">
        {!isMine && missing > 0 && (
          <button
            onClick={() => {
              if (cart.length > 0) joinTeam(team.id);
              else {
                closeSheet();
                setTab('home');
                toast('先挑几件商品，再回来加入拼单');
              }
            }}
            className="flex-1 rounded-full border border-[#1f2611] bg-[#c4c800] py-3 text-[13px] font-black text-[#1f2611] shadow-[3px_3px_0_#1f2611] transition-transform active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
          >
            {cart.length > 0 ? `带着菜篮加入 · ¥${fmtPrice(cartTotal)}` : '先去加购，再来拼'}
          </button>
        )}
        {isMine && (
          <button
            onClick={() => {
              leaveTeam(team.id);
              closeSheet();
            }}
            className="flex-1 rounded-full border border-[#5c693d]/60 py-3 text-[13px] font-bold text-[#5c693d]"
          >
            解散 / 退出拼单
          </button>
        )}
        <button
          onClick={() => toast.success('口令已复制，去微信群粘贴吧')}
          className={cn('flex items-center justify-center gap-1 rounded-full border border-[#1f2611] bg-[#fdfff5] px-4 text-[12px] font-bold text-[#1f2611]', !isMine && missing > 0 && 'flex-none')}
        >
          <Copy size={13} /> 分享
        </button>
      </div>
    </Sheet>
  );
}

/** 结算弹层 */
function CheckoutSheet() {
  const { closeSheet, cart, cartTotal, shipFee, freeGap, placeOrder } = useStore();
  const [addr, setAddr] = useState('静安寺 · 嘉里中心办公楼 3F 前台');
  const [slot, setSlot] = useState('今天 18:00-19:00');
  return (
    <Sheet onClose={closeSheet}>
      <p className="num text-[10px] font-bold tracking-[0.22em] text-[#5c693d]">CHECKOUT / 确认订单</p>
      <h3 className="mt-1 text-xl font-black text-[#1f2611]">最后一确认</h3>

      <label className="mt-4 block text-[11px] font-bold text-[#5c693d]">收货地址</label>
      <input value={addr} onChange={(e) => setAddr(e.target.value)} className="mt-1 w-full rounded-[9px] border border-[#5c693d]/60 bg-[#fdfff5] px-3 py-2.5 text-[13px] font-medium text-[#1f2611] outline-none focus:border-[#1f2611]" />

      <label className="mt-3 block text-[11px] font-bold text-[#5c693d]">送达时间</label>
      <div className="mt-1.5 flex gap-2">
        {['今天 18:00-19:00', '今天 20:00-21:00', '明天 07:00-08:00'].map((s) => (
          <button
            key={s}
            onClick={() => setSlot(s)}
            className={cn(
              'flex-1 rounded-full border px-2 py-2 text-[11px] font-bold transition-all',
              slot === s ? 'border-[#1f2611] bg-[#c4c800] text-[#1f2611] shadow-[2px_2px_0_#1f2611]' : 'border-[#5c693d]/50 bg-[#fdfff5] text-[#5c693d]',
            )}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-1.5 rounded-[9px] border border-[#5c693d]/50 bg-[#fdfff5] p-3 text-[12px]">
        {cart.map((l) => {
          const p = productById(l.productId);
          return (
            <div key={l.productId} className="flex justify-between text-[#1f2611]">
              <span>{p.name} <span className="num text-[#5c693d]">×{l.qty}</span></span>
              <span className="num font-bold">¥{fmtPrice(p.price * l.qty)}</span>
            </div>
          );
        })}
        <div className="flex justify-between border-t border-dashed border-[#5c693d]/50 pt-1.5 text-[#5c693d]">
          <span>配送费{freeGap > 0 ? '（未满 ¥39）' : ''}</span>
          <span className="num font-bold">{shipFee === 0 ? '免运费' : `¥${shipFee}`}</span>
        </div>
        <div className="flex justify-between pt-1 text-[14px] font-black text-[#1f2611]">
          <span>合计</span>
          <span className="num">¥{fmtPrice(cartTotal + shipFee)}</span>
        </div>
      </div>

      <button
        onClick={() => placeOrder('普通')}
        className="mt-4 w-full rounded-full border border-[#1f2611] bg-[#c4c800] py-3 text-[14px] font-black text-[#1f2611] shadow-[3px_3px_0_#1f2611] transition-transform active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
      >
        提交订单 · ¥{fmtPrice(cartTotal + shipFee)}
      </button>
    </Sheet>
  );
}

/** 团购确认弹层 */
function GroupJoinSheet({ groupId }: { groupId: string }) {
  const { closeSheet, groups, joinGroup, joinedGroupIds, setTab } = useStore();
  const g = groups.find((x) => `g-${x.productId}` === groupId) ?? groups[0];
  const p = productById(g.productId);
  const price = p.groupPrice ?? p.price;
  const joined = joinedGroupIds.includes(g.id);

  return (
    <Sheet onClose={closeSheet}>
      <div className="flex items-center gap-3">
        <ProduceArt art={p.art} className="h-20 w-20 rounded-[9px] border-2 border-[#1f2611]" />
        <div>
          <p className="num text-[10px] font-bold tracking-[0.22em] text-[#5c693d]">{g.size} 人团 · 还差 {Math.max(0, g.size - g.joined)} 人</p>
          <h3 className="mt-0.5 text-lg font-black text-[#1f2611]">{p.name}</h3>
          <div className="mt-1 flex items-baseline gap-1.5">
            <Price value={price} size="lg" />
            <span className="num text-[11px] text-[#5c693d] line-through">¥{p.price}</span>
          </div>
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between rounded-[9px] border border-[#5c693d]/50 bg-[#fdfff5] px-3 py-2">
        <span className="text-[11px] font-bold text-[#5c693d]">距截团</span>
        <Countdown endsAt={g.endsAt} dark />
      </div>
      <button
        disabled={joined}
        onClick={() => {
          joinGroup(g.id);
          closeSheet();
          setTab('mine');
        }}
        className="mt-4 w-full rounded-full border border-[#1f2611] bg-[#c4c800] py-3 text-[14px] font-black text-[#1f2611] shadow-[3px_3px_0_#1f2611] transition-transform active:translate-x-[1px] active:translate-y-[1px] active:shadow-none disabled:opacity-50"
      >
        {joined ? '已参团' : `支付 ¥${price} 参团`}
      </button>
      <p className="mt-2 text-center text-[10px] text-[#5c693d]">未满 {g.size} 人自动全额退款 · 已成团立即发货</p>
    </Sheet>
  );
}
