import { Trash2, Users } from 'lucide-react';
import { fmtPrice, productById } from '../data';
import { useStore } from '../store';
import { FreeShipBar, Pill, Price, Stepper } from '../components/bits';
import ProduceArt from '../components/ProduceArt';

export default function CartPage() {
  const { cart, setQty, clearCart, cartTotal, shipFee, openSheet } = useStore();

  return (
    <div className="flex min-h-full flex-col pb-24">
      <div className="border-b border-[#1f2611] px-4 pb-3 pt-5">
        <p className="num text-[10px] font-bold tracking-[0.22em] text-[#5c693d]">BASKET / 菜篮</p>
        <div className="mt-1 flex items-end justify-between">
          <h1 className="text-2xl font-black text-[#1f2611]">我的菜篮</h1>
          {cart.length > 0 && (
            <button onClick={clearCart} className="flex items-center gap-1 text-[11px] font-medium text-[#5c693d]">
              <Trash2 size={12} /> 清空
            </button>
          )}
        </div>
      </div>

      <div className="border-b border-[#5c693d]/40 bg-[#eef8d2] px-4 py-3">
        <FreeShipBar total={cartTotal} />
      </div>

      {cart.length === 0 ? (
        <div className="grid flex-1 place-items-center px-8 text-center">
          <div>
            <p className="text-4xl font-black text-[#1f2611]/15">EMPTY</p>
            <p className="mt-2 text-[13px] font-medium text-[#5c693d]">菜篮空空的，去挑点新鲜的？</p>
          </div>
        </div>
      ) : (
        <ul className="divide-y divide-[#5c693d]/30 px-4">
          {cart.map((l) => {
            const p = productById(l.productId);
            return (
              <li key={l.productId} className="flex items-center gap-3 py-3">
                <ProduceArt art={p.art} className="h-14 w-14 shrink-0 rounded-[9px] border border-[#5c693d]/50" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] font-bold text-[#1f2611]">{p.name}</p>
                  <p className="text-[11px] text-[#5c693d]">{p.unit} · 小计 <span className="num font-bold text-[#1f2611]">¥{fmtPrice(p.price * l.qty)}</span></p>
                </div>
                <Stepper
                  qty={l.qty}
                  onChange={(q) => setQty(l.productId, q)}
                />
              </li>
            );
          })}
        </ul>
      )}

      {/* 拼单提示条 */}
      {cart.length > 0 && (
        <button
          onClick={() => openSheet({ kind: 'team-create' })}
          className="mx-4 mt-3 flex items-center gap-2 rounded-[9px] border-2 border-dashed border-[#5c693d] bg-[#fdfff5] p-3 text-left transition-colors hover:bg-[#eef8d2]"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full border border-[#1f2611] bg-[#c4c800]">
            <Users size={15} className="text-[#1f2611]" />
          </span>
          <span className="flex-1">
            <span className="block text-[12px] font-black text-[#1f2611]">改成拼单，喊邻居一起免运费</span>
            <span className="block text-[10px] text-[#5c693d]">各付各的 · 你的份额 ¥{fmtPrice(cartTotal)}</span>
          </span>
          <Pill solid>去开团</Pill>
        </button>
      )}

      {/* 结算栏 */}
      {cart.length > 0 && (
        <div className="sticky bottom-[64px] mt-auto border-t-2 border-[#1f2611] bg-[#f7ffe4] px-4 py-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] text-[#5c693d]">
                商品 ¥{fmtPrice(cartTotal)} · 配送费 {shipFee === 0 ? '免' : `¥${shipFee}`}
              </p>
              <p className="flex items-baseline gap-1 text-[#1f2611]">
                <span className="text-[11px] font-bold">合计</span>
                <Price value={cartTotal + shipFee} size="lg" />
              </p>
            </div>
            <button
              onClick={() => openSheet({ kind: 'checkout' })}
              className="rounded-full border border-[#1f2611] bg-[#c4c800] px-7 py-3 text-[14px] font-black text-[#1f2611] shadow-[3px_3px_0_#1f2611] transition-transform active:translate-x-[1px] active:translate-y-[1px] active:shadow-none"
            >
              去结算
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
