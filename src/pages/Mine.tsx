import { ChevronRight, Package, Ticket, Users } from 'lucide-react';
import { fmtPrice, productById } from '../data';
import { useStore } from '../store';
import { Avatar, Pill } from '../components/bits';

export default function MinePage() {
  const { orders, teams, myTeams, openSheet, setTab } = useStore();
  const myTeamList = teams.filter((t) => myTeams.includes(t.id));

  return (
    <div className="pb-24">
      {/* 用户卡 */}
      <div className="border-b-2 border-[#1f2611] bg-[#1f2611] px-4 pb-5 pt-6 text-[#f7ffe4]">
        <div className="flex items-center gap-3">
          <Avatar name="我" hue={63} size={52} />
          <div>
            <p className="text-lg font-black">鲜市用户_8321</p>
            <p className="num text-[10px] tracking-tag text-[#f7ffe4]/60">MEMBER SINCE 2026 · 静安寺自提点</p>
          </div>
          <Pill dark className="ml-auto">鲜粉 LV.3</Pill>
        </div>
        <div className="mt-4 grid grid-cols-3 divide-x divide-[#f7ffe4]/20 rounded-[9px] border border-[#f7ffe4]/25 py-2.5 text-center">
          {[
            ['订单', orders.length],
            ['参团', myTeams.length],
            ['优惠券', 4],
          ].map(([k, v]) => (
            <div key={k as string}>
              <p className="num text-lg font-black text-[#c4c800]">{v}</p>
              <p className="text-[10px] text-[#f7ffe4]/60">{k}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 我的拼单 */}
      <section className="mt-4 px-4">
        <div className="flex items-center justify-between">
          <h2 className="flex items-center gap-1.5 text-[15px] font-black text-[#1f2611]">
            <Users size={15} /> 我的拼单
          </h2>
          <button onClick={() => setTab('home')} className="flex items-center text-[11px] font-medium text-[#5c693d]">
            去逛逛 <ChevronRight size={12} />
          </button>
        </div>
        {myTeamList.length === 0 ? (
          <button
            onClick={() => openSheet({ kind: 'team-create' })}
            className="mt-2 w-full rounded-[9px] border-2 border-dashed border-[#5c693d] p-4 text-[12px] font-bold text-[#5c693d] transition-colors hover:bg-[#eef8d2]"
          >
            还没有拼单，发起一单喊邻居来凑 →
          </button>
        ) : (
          <div className="mt-2 space-y-2">
            {myTeamList.map((t) => (
              <button
                key={t.id}
                onClick={() => openSheet({ kind: 'team-detail', teamId: t.id })}
                className="flex w-full items-center gap-2.5 rounded-[9px] border border-[#5c693d]/50 bg-[#fdfff5] p-3 text-left"
              >
                <Avatar name={t.owner} hue={t.ownerHue} size={34} />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-bold text-[#1f2611]">{t.title}</span>
                  <span className="block text-[10px] text-[#5c693d]">
                    {t.members.length}/{t.capacity} 人 · {t.members.length >= t.capacity ? '已拼满' : '拼单中'}
                  </span>
                </span>
                <ChevronRight size={14} className="text-[#5c693d]" />
              </button>
            ))}
          </div>
        )}
      </section>

      {/* 订单 */}
      <section className="mt-5 px-4">
        <h2 className="flex items-center gap-1.5 text-[15px] font-black text-[#1f2611]">
          <Package size={15} /> 全部订单
        </h2>
        {orders.length === 0 ? (
          <p className="mt-2 rounded-[9px] border border-[#5c693d]/40 p-4 text-center text-[12px] text-[#5c693d]">
            暂无订单，去下一单新鲜的
          </p>
        ) : (
          <div className="mt-2 space-y-2">
            {orders.map((o) => (
              <div key={o.id} className="rounded-[9px] border border-[#5c693d]/50 bg-[#fdfff5] p-3">
                <div className="flex items-center justify-between">
                  <span className="num text-[10px] tracking-tag text-[#5c693d]">NO.{o.id}</span>
                  <Pill solid={o.status !== '待成团'} className={o.status === '待成团' ? 'border-[#e89b2b] text-[#e89b2b]' : ''}>
                    {o.status}
                  </Pill>
                </div>
                <div className="mt-2 flex items-center gap-1.5">
                  {o.items.slice(0, 4).map((it) => (
                    <Avatar key={it.productId} name={productById(it.productId).name} hue={40} size={26} />
                  ))}
                  <span className="num ml-auto text-[13px] font-black text-[#1f2611]">¥{fmtPrice(o.total)}</span>
                </div>
                <p className="mt-1 text-[10px] text-[#5c693d]">
                  {o.kind}单 · {o.items.reduce((s, i) => s + i.qty, 0)} 件 · 刚刚
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 服务入口 */}
      <section className="mt-5 px-4 pb-4">
        <div className="divide-y divide-[#5c693d]/30 rounded-[9px] border border-[#5c693d]/50 bg-[#fdfff5]">
          {[
            ['客服与售后', Ticket],
            ['优惠券 · 4 张', Ticket],
            ['自提点管理', Package],
          ].map(([label, Icon]) => {
            const I = Icon as typeof Ticket;
            return (
              <button key={label as string} className="flex w-full items-center gap-2 px-3 py-3 text-left text-[13px] font-bold text-[#1f2611]">
                <I size={14} className="text-[#5c693d]" /> {label as string}
                <ChevronRight size={14} className="ml-auto text-[#5c693d]" />
              </button>
            );
          })}
        </div>
        <p className="num mt-6 text-center text-[9px] tracking-[0.25em] text-[#5c693d]/60">
          FRESHMART © 2026 · GROWN WITH CARE
        </p>
      </section>
    </div>
  );
}
