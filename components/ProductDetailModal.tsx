import React, { useState } from 'react';
import { X, Minus, Plus, ChevronLeft, ChevronRight, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

interface ProductDetailModalProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToCart: (product: Product, quantity: number) => void;
}

export const ProductDetailModal: React.FC<ProductDetailModalProps> = ({ 
  product, 
  isOpen, 
  onClose, 
  onAddToCart 
}) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  if (!isOpen || !product) return null;

  const handleNextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % product.images.length);
  };

  const handlePrevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + product.images.length) % product.images.length);
  };

  const handleConfirm = () => {
    onAddToCart(product, quantity);
    setQuantity(1);
    setCurrentImageIndex(0);
    onClose();
  };

  const handleClose = () => {
    setQuantity(1);
    setCurrentImageIndex(0);
    onClose();
  }

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#1F1F1F] border border-white/10 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden flex flex-col relative animate-slide-up">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 bg-black/40 hover:bg-black/60 text-white p-2 rounded-full backdrop-blur-md transition border border-white/10"
        >
          <X size={20} />
        </button>

        {/* Carousel Section */}
        <div className="relative h-72 w-full bg-stone-900">
          <img 
            src={product.images[currentImageIndex]} 
            alt={product.name} 
            className="w-full h-full object-cover"
          />
          
          <div className="absolute inset-0 bg-gradient-to-t from-[#1F1F1F] to-transparent opacity-20 pointer-events-none"></div>

          {product.images.length > 1 && (
            <>
              <button 
                onClick={handlePrevImage}
                className="absolute left-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition border border-white/10"
              >
                <ChevronLeft size={20} />
              </button>
              <button 
                onClick={handleNextImage}
                className="absolute right-4 top-1/2 -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition border border-white/10"
              >
                <ChevronRight size={20} />
              </button>
              
              {/* Dots */}
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {product.images.map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 rounded-full transition-all shadow-sm ${idx === currentImageIndex ? 'bg-brand-orange w-6' : 'bg-white/40 w-1.5'}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>

        {/* Content Section */}
        <div className="p-6 flex flex-col gap-5">
          <div>
            <div className="flex justify-between items-start gap-4">
                <h2 className="text-2xl font-serif font-bold text-white leading-tight">{product.name}</h2>
                <span className="bg-brand-orange/20 text-brand-orange px-3 py-1 rounded-full text-lg font-bold whitespace-nowrap border border-brand-orange/20">
                    R$ {product.price.toFixed(2)}
                </span>
            </div>
            <p className="text-white/60 mt-3 leading-relaxed text-sm">
              {product.description}
            </p>
          </div>

          <div className="h-px bg-white/5 my-1" />

          {/* Quantity and Add Button */}
          <div className="flex items-center gap-4">
            <div className="flex items-center bg-white/5 border border-white/5 rounded-xl p-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-3 text-white/70 hover:text-white transition active:scale-90"
              >
                <Minus size={18} />
              </button>
              <span className="w-8 text-center font-bold text-lg text-white">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="p-3 text-white/70 hover:text-white transition active:scale-90"
              >
                <Plus size={18} />
              </button>
            </div>

            <button 
              onClick={handleConfirm}
              className="flex-1 bg-brand-orange hover:bg-orange-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-orange-900/40 flex items-center justify-center gap-2 transition active:scale-[0.98]"
            >
              <ShoppingBag size={20} />
              <span>Adicionar - R$ {(product.price * quantity).toFixed(2)}</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};