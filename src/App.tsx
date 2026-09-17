import { StoreProvider, useStore } from './store';
import HomePage from './pages/Home';
import GroupBuyPage from './pages/GroupBuy';
import CartPage from './pages/Cart';
import MinePage from './pages/Mine';
import TabBar from './components/TabBar';
import Sheets from './sheets';
import { Toaster } from './components/ui/sonner';

function Shell() {
  const { tab, sheet } = useStore();
  return (
    <>
      {/* 桌面端：手机外壳；移动端：全屏 */}
      <div className="flex min-h-screen items-center justify-center bg-[#20261a] py-0 sm:py-8">
        <div className="relative flex h-[100dvh] w-full max-w-[420px] flex-col overflow-hidden bg-[#f7ffe4] sm:h-[860px] sm:rounded-[44px] sm:border-4 sm:border-[#11150b] sm:shadow-[0_30px_80px_rgba(0,0,0,0.55)]">
          {/* 顶部刘海（桌面外壳装饰） */}
          <div className="pointer-events-none absolute left-1/2 top-2 z-50 hidden h-6 w-28 -translate-x-1/2 rounded-full bg-[#11150b] sm:block" />
          <main className="no-scrollbar relative flex-1 overflow-y-auto">
            {tab === 'home' && <HomePage />}
            {tab === 'group' && <GroupBuyPage />}
            {tab === 'cart' && <CartPage />}
            {tab === 'mine' && <MinePage />}
          </main>
          <TabBar />
          <Sheets sheet={sheet} />
        </div>
      </div>
      <Toaster position="top-center" toastOptions={{ style: { background: '#1f2611', color: '#f7ffe4', border: '1px solid #c4c800' } }} />
    </>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
