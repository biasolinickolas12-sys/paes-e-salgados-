import React from 'react';
import { ChevronRight, Wheat, MapPin, LockKeyhole } from 'lucide-react';
import { PromoBanner } from './PromoBanner';

interface HeroProps {
  onOrderClick: () => void;
  onAdminClick: () => void;
  bannerSettings: {
    active: boolean;
    text: string;
    price: number;
    discount: number;
  };
  onBannerAction: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onOrderClick,
  onAdminClick,
  bannerSettings,
  onBannerAction
}) => {
  return (
    <div className="relative h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-center bg-brand-dark">

      <div className="fixed top-0 left-0 w-full z-[100]">
        <PromoBanner
          active={bannerSettings.active}
          text={bannerSettings.text}
          price={bannerSettings.price}
          discount={bannerSettings.discount}
          onAction={onBannerAction}
        />
      </div>

      {/* 
        =============================================
        BACKGROUND IMAGE (Rustic Breads)
        =============================================
      */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1608198093002-ad4e005484ec?q=80&w=1920&auto=format&fit=crop"
          alt="Pães Caseiros Rústicos"
          className="w-full h-full object-cover opacity-60 scale-105 animate-[zoom_40s_infinite_alternate]"
        />
        {/* Vignette Overlay for focus and text readability */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
        <div className="absolute inset-0 bg-brand-dark/20 mix-blend-multiply" />
      </div>

      <div className="relative z-10 w-full max-w-lg px-6 flex flex-col items-center text-center space-y-4 md:space-y-6 animate-slide-up">

        {/* 
          =============================================
          ADMIN LOGIN BUTTON - Relocated to avoid banner overlap
          =============================================
        */}

        {/* "Homemade" Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg">
          <Wheat size={16} className="text-brand-gold" />
          <span className="text-brand-cream font-hand text-xl tracking-wider">Padaria Artesanal & Familiar</span>
        </div>

        {/* Brand Name - Centralized & Huge */}
        <div className="flex flex-col items-center justify-center space-y-2">
          <span className="font-hand text-3xl md:text-4xl text-white rotate-[-3deg] drop-shadow-lg">
            As delícias da
          </span>
          <h1 className="flex flex-col items-center">
            <span className="font-serif font-black text-7xl md:text-9xl text-white drop-shadow-[0_5px_5px_rgba(0,0,0,0.8)] leading-[0.8]">
              Célia
            </span>
            <span className="font-serif italic font-bold text-3xl md:text-5xl text-orange-400 mt-2 tracking-wide drop-shadow-lg">
              Pães & Salgados
            </span>
          </h1>
        </div>

        {/* Divider */}
        <div className="w-24 h-1 bg-orange-500 rounded-full mx-auto shadow-md" />

        {/* Description */}
        <p className="text-white text-lg md:text-xl font-sans font-normal leading-relaxed max-w-sm drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
          O sabor inconfundível feito à mão. Receitas de família entregues quentinhas na sua porta.
        </p>

        {/* 
           CTA BUTTON - Modified to be Lighter and Smaller
        */}
        <div className="pt-4 pb-8 w-full flex justify-center">
          <button
            onClick={onOrderClick}
            className="group relative w-auto px-8 py-3.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-[0_4px_20px_rgba(249,115,22,0.4)] hover:shadow-[0_6px_25px_rgba(249,115,22,0.6)] transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-3 animate-pulse-action"
          >
            {/* Removed the inner border div for a cleaner look on the smaller button */}
            <span className="font-bold text-lg uppercase tracking-wider">FAZER MEU PEDIDO</span>
            <div className="bg-white/20 p-1 rounded-full group-hover:translate-x-1 transition-transform">
              <ChevronRight size={18} className="text-white" />
            </div>
          </button>
        </div>

        <div className="flex flex-col items-center gap-4 pt-2">
          <div className="flex items-center justify-center gap-2 text-white/90 text-xs md:text-sm font-bold uppercase tracking-widest drop-shadow-md">
            <MapPin size={16} className="text-orange-400" />
            <span className="drop-shadow-sm">Entregamos em São Roque e Mairinque</span>
          </div>

          <button
            onClick={onAdminClick}
            className="text-white/10 hover:text-white/40 transition-colors p-1"
            aria-label="Acesso Admin"
          >
            <LockKeyhole size={14} />
          </button>
        </div>

      </div>
    </div>
  );
};