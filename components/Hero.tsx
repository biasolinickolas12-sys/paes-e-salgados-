import React from 'react';
import { ChevronRight, Wheat, MapPin, LockKeyhole } from 'lucide-react';

interface HeroProps {
  onOrderClick: () => void;
  onAdminClick: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onOrderClick, onAdminClick }) => {
  return (
    <div className="relative h-[100dvh] w-full overflow-hidden flex flex-col items-center justify-center bg-brand-dark">
      
      {/* 
        =============================================
        ADMIN LOGIN BUTTON
        =============================================
      */}
      <button 
        onClick={onAdminClick}
        className="absolute top-6 right-6 z-50 text-white/20 hover:text-white/60 transition-colors p-2"
        aria-label="Acesso Admin"
      >
        <LockKeyhole size={20} />
      </button>

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

      {/* 
        =============================================
        CENTRAL CONTENT
        =============================================
      */}
      <div className="relative z-10 w-full max-w-lg px-6 flex flex-col items-center text-center space-y-6 md:space-y-8 animate-slide-up">
        
        {/* "Homemade" Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-lg mb-2">
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

        {/* Footer Info (Delivery Location) */}
        <div className="flex items-center justify-center gap-2 text-white/90 text-xs md:text-sm font-bold uppercase tracking-widest pt-2 drop-shadow-md">
          <MapPin size={16} className="text-orange-400" />
          <span className="drop-shadow-sm">Entregamos em São Roque e Mairinque</span>
        </div>

      </div>
    </div>
  );
};