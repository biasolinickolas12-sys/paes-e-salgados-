import React from 'react';
import { Sparkles, X, ShoppingCart } from 'lucide-react';

interface PromoBannerProps {
    active: boolean;
    text: string;
    price: number;
    discount: number;
    onClose?: () => void;
    onAction?: () => void;
}

export const PromoBanner: React.FC<PromoBannerProps> = ({
    active,
    text,
    price,
    discount,
    onClose,
    onAction
}) => {
    if (!active) return null;

    const discountedPrice = price - (price * (discount / 100));

    return (
        <div className="w-full bg-gradient-to-r from-brand-orange via-orange-600 to-brand-orange text-white py-2 px-4 shadow-lg animate-fadeIn relative z-40">
            <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-center gap-2 md:gap-6">
                <div className="flex items-center gap-2">
                    <div className="bg-white/20 p-1 rounded-full animate-pulse">
                        <Sparkles size={16} className="text-yellow-300" />
                    </div>
                    <p className="font-bold text-sm md:text-base uppercase tracking-tight">
                        {text}
                    </p>
                </div>

                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 bg-black/20 px-3 py-1 rounded-full border border-white/10">
                        <span className="text-white/60 line-through text-xs md:text-sm">R$ {price.toFixed(2)}</span>
                        <span className="text-white font-black text-base md:text-lg">R$ {discountedPrice.toFixed(2)}</span>
                        <span className="bg-yellow-400 text-stone-900 text-[10px] font-black px-1.5 py-0.5 rounded uppercase">
                            {discount}% OFF
                        </span>
                    </div>

                    <button
                        onClick={onAction}
                        className="hidden md:flex items-center gap-2 bg-white text-brand-orange px-4 py-1 rounded-full text-xs font-bold hover:bg-stone-100 transition shadow-md active:scale-95"
                    >
                        <ShoppingCart size={14} />
                        APROVEITAR AGORA
                    </button>
                </div>

                {onClose && (
                    <button
                        onClick={onClose}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-white/50 hover:text-white transition"
                    >
                        <X size={18} />
                    </button>
                )}
            </div>

            {/* Mobile Action Button (Centered below) */}
            <button
                onClick={onAction}
                className="md:hidden mt-2 w-full flex items-center justify-center gap-2 bg-white text-brand-orange py-1 rounded-lg text-xs font-bold"
            >
                <ShoppingCart size={14} />
                APROVEITAR AGORA
            </button>
        </div>
    );
};
