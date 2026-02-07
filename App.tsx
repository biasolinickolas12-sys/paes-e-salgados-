import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { OrderModal } from './components/OrderModal';
import { ChatOptions } from './components/ChatOptions';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AdminDashboard } from './components/AdminDashboard';
import { Clock, X, CalendarClock } from 'lucide-react';
import { useProducts } from './hooks/useProducts';
import { useStoreSettings } from './hooks/useStoreSettings';

type ViewState = 'hero' | 'chat';

const App: React.FC = () => {
  const [view, setView] = useState<ViewState>('hero');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClosedMessageOpen, setIsClosedMessageOpen] = useState(false);

  // Admin States
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);

  // Supabase Hooks
  const { products, loading: productsLoading, updateProductPrice } = useProducts();
  const { isStoreOpen, openingHours, toggleStoreStatus } = useStoreSettings();

  const handleOrderClick = () => {
    if (!isStoreOpen) {
      setIsClosedMessageOpen(true);
      return;
    }
    setView('chat');
  };

  const handleBackToHero = () => {
    setView('hero');
  };

  const handleOpenCatalog = () => {
    setIsModalOpen(true);
  };

  const handleAdminLoginSuccess = () => {
    setIsLoginModalOpen(false);
    setIsAdminLoggedIn(true);
  };

  const handleAdminLogout = () => {
    setIsAdminLoggedIn(false);
    setView('hero');
  };

  const handleUpdateProductPrice = async (id: number, newPrice: number) => {
    await updateProductPrice(id, newPrice);
  };

  const handleToggleStore = async () => {
    await toggleStoreStatus();
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-stone-900 font-sans">

      {/* 
        RENDERIZAÇÃO CONDICIONAL DAS TELAS
      */}

      {view === 'hero' && !isAdminLoggedIn && (
        <div className="animate-fadeIn w-full h-full">
          <Hero
            onOrderClick={handleOrderClick}
            onAdminClick={() => setIsLoginModalOpen(true)}
          />
        </div>
      )}

      {view === 'chat' && !isAdminLoggedIn && (
        <div className="animate-fadeIn w-full h-full">
          <ChatOptions
            onBack={handleBackToHero}
            onSelectCatalog={handleOpenCatalog}
          />
        </div>
      )}

      {/* 
        MODAL DE PEDIDO (CARDÁPIO)
      */}
      <OrderModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        products={products}
      />

      {/* 
        ADMIN MODALS & DASHBOARD
      */}
      <AdminLoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onLoginSuccess={handleAdminLoginSuccess}
      />

      {isAdminLoggedIn && (
        <AdminDashboard
          onLogout={handleAdminLogout}
          isStoreOpen={isStoreOpen}
          onToggleStore={handleToggleStore}
          products={products}
          onUpdateProductPrice={handleUpdateProductPrice}
        />
      )}

      {/* 
        MODAL DE LOJA FECHADA
      */}
      {isClosedMessageOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-stone-900 border border-white/10 p-8 rounded-3xl max-w-sm w-full flex flex-col items-center text-center shadow-2xl animate-slide-up relative overflow-hidden">

            <button
              onClick={() => setIsClosedMessageOpen(false)}
              className="absolute top-4 right-4 text-white/30 hover:text-white transition"
            >
              <X size={24} />
            </button>

            {/* Decorative Icon */}
            <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mb-6 border border-red-500/20">
              <Clock size={40} className="text-red-400" />
            </div>

            <h3 className="font-serif font-bold text-2xl text-white mb-2">Loja Fechada</h3>
            <p className="text-white/60 mb-6 leading-relaxed">
              No momento não estamos aceitando pedidos. <br />
              Por favor, retorne durante nosso horário de funcionamento.
            </p>

            <div className="bg-white/5 rounded-xl p-4 w-full mb-6 flex items-center gap-3 text-left">
              <CalendarClock className="text-brand-orange flex-shrink-0" size={20} />
              <div>
                <p className="text-white text-sm font-bold">Horário de Atendimento</p>
                <p className="text-white/40 text-xs">{openingHours}</p>
              </div>
            </div>

            <button
              onClick={() => setIsClosedMessageOpen(false)}
              className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold transition"
            >
              Entendi
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

export default App;