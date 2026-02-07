import React, { useState, useEffect } from 'react';
import { X, ShoppingBag, Send, ArrowLeft, Trash2, MapPin, User, CreditCard, Banknote, FileText, ChevronLeft, QrCode, CheckCircle, Loader2, Phone } from 'lucide-react';
import { Product, CartItem } from '../types';
import { ProductDetailModal } from './ProductDetailModal';
import { createOrder } from '../services/orderService';

interface OrderModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

type CheckoutStep = 'cart' | 'checkout';
type PaymentMethod = 'pix' | 'dinheiro' | 'cartao';

export const OrderModal: React.FC<OrderModalProps> = ({ isOpen, onClose, products }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [activeTab, setActiveTab] = useState<'todos' | 'paes' | 'salgados' | 'doces'>('todos');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // Checkout State
  const [checkoutStep, setCheckoutStep] = useState<CheckoutStep>('cart');
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    phone: '',
    address: '',
    paymentMethod: 'pix' as PaymentMethod,
    observation: ''
  });

  // Success State
  const [isOrderPlaced, setIsOrderPlaced] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Animation States
  const [shouldRender, setShouldRender] = useState(false);
  const [isClosing, setIsClosing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      setIsClosing(false);
    } else {
      if (shouldRender) {
        setIsClosing(true);
        const timer = setTimeout(() => {
          setShouldRender(false);
          setIsClosing(false);
        }, 550); // Matches ~0.6s animation duration
        return () => clearTimeout(timer);
      }
    }
  }, [isOpen, shouldRender]);

  const handleProductClick = (product: Product) => {
    setSelectedProduct(product);
  };

  const addToCart = (product: Product, quantity: number) => {
    setCart(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, quantity: item.quantity + quantity } : item
        );
      }
      return [...prev, { ...product, quantity }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart(prev => prev.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId: number, delta: number) => {
    setCart(prev => prev.map(item => {
      if (item.id === productId) {
        return { ...item, quantity: Math.max(1, item.quantity + delta) };
      }
      return item;
    }));
  };

  const cartTotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const handleOpenCart = () => {
    setIsCartOpen(true);
    setCheckoutStep('cart');
  };

  const handleDirectCheckout = () => {
    setIsCartOpen(true);
    setCheckoutStep('checkout');
  };

  const handleConfirmOrder = async () => {
    if (cart.length === 0 || !customerInfo.name || !customerInfo.address || !customerInfo.phone) return;

    setIsSubmitting(true);

    try {
      const result = await createOrder({
        customerName: customerInfo.name,
        customerPhone: customerInfo.phone,
        customerAddress: customerInfo.address,
        items: cart,
        notes: customerInfo.observation || undefined,
        paymentMethod: customerInfo.paymentMethod
      });

      if (result.success) {
        setIsOrderPlaced(true);
      } else {
        alert(`Erro ao criar pedido: ${result.error}`);
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('Erro ao criar pedido. Por favor, tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const cleanUp = () => {
    setCart([]);
    setCustomerInfo({
      name: '',
      phone: '',
      address: '',
      paymentMethod: 'pix',
      observation: ''
    });
    setIsOrderPlaced(false);
    setIsCartOpen(false);
    onClose();
  };

  const filteredProducts = activeTab === 'todos'
    ? products
    : products.filter(p => p.category === activeTab);

  const tabs = [
    { id: 'todos', label: 'Todos' },
    { id: 'paes', label: 'Pães' },
    { id: 'salgados', label: 'Salgados' },
    { id: 'doces', label: 'Doces' },
  ];

  if (!shouldRender) return null;

  return (
    <div className={`fixed inset-0 z-50 bg-stone-900 flex flex-col ${isClosing ? 'animate-slide-down' : 'animate-slide-up'}`}>

      {/* 
        HEADER
      */}
      <div className="bg-stone-900 px-4 py-3 border-b border-white/5 flex items-center justify-between z-10 sticky top-0">
        <div className="flex items-center gap-3">
          <button onClick={onClose} className="p-2 -ml-2 text-white/70 hover:text-white hover:bg-white/10 rounded-full transition">
            <ArrowLeft size={24} />
          </button>
          <h2 className="font-serif font-bold text-xl text-white">Cardápio</h2>
        </div>

        <button
          onClick={handleOpenCart}
          className="relative p-2 bg-white/5 rounded-full hover:bg-brand-orange/20 transition group"
        >
          <ShoppingBag size={24} className="text-white group-hover:text-brand-orange transition-colors" />
          {cartCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-brand-orange text-white text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-stone-900">
              {cartCount}
            </span>
          )}
        </button>
      </div>

      {/* 
        CATEGORIES TABS
      */}
      <div className="bg-stone-900 px-4 pb-4 pt-2 overflow-x-auto border-b border-white/5">
        <div className="flex gap-2">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeTab === tab.id
                ? 'bg-brand-orange text-white shadow-lg shadow-orange-900/40'
                : 'bg-white/5 text-white/50 hover:bg-white/10 hover:text-white'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 
        PRODUCT GRID
      */}
      <div className="flex-1 overflow-y-auto p-4 bg-stone-800">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pb-20">
          {filteredProducts.map(product => (
            <div
              key={product.id}
              onClick={() => handleProductClick(product)}
              className="bg-[#1F1F1F] border border-white/5 p-3 rounded-2xl shadow-lg hover:shadow-xl transition cursor-pointer active:scale-[0.98] flex gap-4 group"
            >
              <div className="h-24 w-24 flex-shrink-0 rounded-xl overflow-hidden bg-stone-700 relative">
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>

              <div className="flex flex-col justify-between flex-1 py-1">
                <div>
                  <h3 className="font-serif font-bold text-lg text-white leading-tight">{product.name}</h3>
                  <p className="text-white/40 text-xs mt-1 line-clamp-2 leading-relaxed">{product.description}</p>
                </div>
                <div className="flex justify-between items-end mt-2">
                  <span className="font-bold text-brand-orange text-lg">R$ {product.price.toFixed(2)}</span>
                  <div className="bg-white/10 text-white text-[10px] uppercase tracking-wider px-3 py-1.5 rounded-full font-bold group-hover:bg-brand-orange group-hover:text-white transition-colors">
                    Adicionar
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 
        FLOATING CTA BUTTON (VISIBLE WHEN CART > 0)
      */}
      {cart.length > 0 && (
        <div className="absolute bottom-6 w-full flex justify-center z-30 animate-slide-up pointer-events-none">
          <button
            onClick={handleDirectCheckout}
            className="pointer-events-auto bg-brand-orange text-white pl-6 pr-2 py-2 rounded-full shadow-xl shadow-orange-900/50 flex items-center gap-3 font-bold hover:bg-orange-600 transition active:scale-95 border border-white/10"
          >
            <span className="text-sm uppercase tracking-wider">Finalizar Pedido</span>
            <span className="bg-white/20 px-3 py-1.5 rounded-full text-sm font-bold min-w-[80px] text-center backdrop-blur-sm">
              R$ {cartTotal.toFixed(2)}
            </span>
          </button>
        </div>
      )}

      {/* 
        PRODUCT DETAIL MODAL 
      */}
      <ProductDetailModal
        isOpen={!!selectedProduct}
        product={selectedProduct}
        onClose={() => setSelectedProduct(null)}
        onAddToCart={addToCart}
      />

      {/* 
        CART / CHECKOUT DRAWER
      */}
      {isCartOpen && (
        <div className="fixed inset-0 z-[70] flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm animate-fadeIn"
            onClick={() => setIsCartOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative w-full max-w-md h-full bg-stone-900 shadow-2xl flex flex-col animate-slide-up md:animate-slide-left border-l border-white/10">

            {/* Drawer Header */}
            <div className="p-5 bg-stone-900 border-b border-white/10 text-white flex justify-between items-center flex-shrink-0">
              <div className="flex items-center gap-3">
                {checkoutStep === 'checkout' ? (
                  <button onClick={() => setCheckoutStep('cart')} className="p-1 -ml-1 hover:bg-white/10 rounded-full transition">
                    <ChevronLeft size={24} />
                  </button>
                ) : (
                  <ShoppingBag size={20} className="text-brand-orange" />
                )}
                <h2 className="font-serif font-bold text-xl">
                  {checkoutStep === 'cart' ? 'Seu Carrinho' : 'Finalizar Pedido'}
                </h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="text-white/50 hover:text-white transition">
                <X size={24} />
              </button>
            </div>

            {/* 
              STEP 1: CART LIST
            */}
            {checkoutStep === 'cart' && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-stone-800">
                  {cart.length === 0 ? (
                    <div className="h-full flex flex-col items-center justify-center text-white/20">
                      <ShoppingBag size={64} className="mb-4 opacity-20" />
                      <p className="text-lg font-medium">Seu carrinho está vazio</p>
                      <button
                        onClick={() => setIsCartOpen(false)}
                        className="mt-4 text-brand-orange font-bold text-sm hover:underline"
                      >
                        Voltar ao cardápio
                      </button>
                    </div>
                  ) : (
                    cart.map(item => (
                      <div key={item.id} className="bg-[#1F1F1F] border border-white/5 p-4 rounded-xl shadow-sm flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                          <div className="flex gap-3">
                            <img src={item.images[0]} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-stone-700" />
                            <div>
                              <p className="font-bold text-white">{item.name}</p>
                              <p className="text-sm text-white/50">R$ {item.price.toFixed(2)} un</p>
                            </div>
                          </div>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-white/20 hover:text-red-500 transition"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>

                        <div className="flex justify-between items-center border-t border-white/5 pt-3">
                          <div className="flex items-center bg-white/5 rounded-lg border border-white/5">
                            <button
                              onClick={() => updateQuantity(item.id, -1)}
                              className="px-3 py-1 text-white hover:bg-white/10 rounded-l-lg transition"
                            >
                              -
                            </button>
                            <span className="w-8 text-center text-sm font-bold text-white">{item.quantity}</span>
                            <button
                              onClick={() => updateQuantity(item.id, 1)}
                              className="px-3 py-1 text-white hover:bg-white/10 rounded-r-lg transition"
                            >
                              +
                            </button>
                          </div>
                          <span className="font-bold text-brand-orange">R$ {(item.price * item.quantity).toFixed(2)}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="p-6 bg-stone-900 border-t border-white/10 flex-shrink-0">
                  <div className="flex justify-between items-center mb-6">
                    <span className="text-white/50 text-lg">Total do Pedido</span>
                    <span className="text-3xl font-serif font-bold text-white">R$ {cartTotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={() => setCheckoutStep('checkout')}
                    disabled={cart.length === 0}
                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${cart.length > 0
                      ? 'bg-brand-orange hover:bg-orange-600 text-white shadow-lg shadow-orange-900/20 active:scale-[0.98]'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                      }`}
                  >
                    Continuar para Entrega
                    <ChevronLeft size={20} className="rotate-180" />
                  </button>
                </div>
              </>
            )}

            {/* 
              STEP 2: CHECKOUT FORM
            */}
            {checkoutStep === 'checkout' && (
              <>
                <div className="flex-1 overflow-y-auto p-4 space-y-6 bg-stone-800">

                  {/* Name Input */}
                  <div className="space-y-2">
                    <label className="text-sm text-white/70 font-bold uppercase tracking-wide flex items-center gap-2">
                      <User size={16} />
                      Nome Completo
                    </label>
                    <input
                      type="text"
                      value={customerInfo.name}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, name: e.target.value })}
                      placeholder="Digite seu nome..."
                      className="w-full bg-[#1F1F1F] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-orange transition"
                    />
                  </div>

                  {/* Phone Input */}
                  <div className="space-y-2">
                    <label className="text-sm text-white/70 font-bold uppercase tracking-wide flex items-center gap-2">
                      <Phone size={16} />
                      Telefone / WhatsApp
                    </label>
                    <input
                      type="tel"
                      value={customerInfo.phone}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, phone: e.target.value })}
                      placeholder="(11) 99999-9999"
                      className="w-full bg-[#1F1F1F] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-orange transition"
                    />
                  </div>

                  {/* Address Input */}
                  <div className="space-y-2">
                    <label className="text-sm text-white/70 font-bold uppercase tracking-wide flex items-center gap-2">
                      <MapPin size={16} />
                      Endereço de Entrega
                    </label>
                    <textarea
                      value={customerInfo.address}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, address: e.target.value })}
                      placeholder="Rua, Número, Bairro e Complemento..."
                      rows={3}
                      className="w-full bg-[#1F1F1F] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-orange transition resize-none"
                    />
                  </div>

                  {/* Payment Method */}
                  <div className="space-y-3">
                    <label className="text-sm text-white/70 font-bold uppercase tracking-wide flex items-center gap-2">
                      <CreditCard size={16} />
                      Forma de Pagamento
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      <button
                        onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'pix' })}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition gap-2 ${customerInfo.paymentMethod === 'pix'
                          ? 'bg-brand-orange/20 border-brand-orange text-brand-orange'
                          : 'bg-[#1F1F1F] border-white/10 text-white/50 hover:bg-white/5'
                          }`}
                      >
                        <QrCode size={20} />
                        <span className="text-xs font-bold">PIX</span>
                      </button>
                      <button
                        onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'cartao' })}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition gap-2 ${customerInfo.paymentMethod === 'cartao'
                          ? 'bg-brand-orange/20 border-brand-orange text-brand-orange'
                          : 'bg-[#1F1F1F] border-white/10 text-white/50 hover:bg-white/5'
                          }`}
                      >
                        <CreditCard size={20} />
                        <span className="text-xs font-bold">Cartão</span>
                      </button>
                      <button
                        onClick={() => setCustomerInfo({ ...customerInfo, paymentMethod: 'dinheiro' })}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border transition gap-2 ${customerInfo.paymentMethod === 'dinheiro'
                          ? 'bg-brand-orange/20 border-brand-orange text-brand-orange'
                          : 'bg-[#1F1F1F] border-white/10 text-white/50 hover:bg-white/5'
                          }`}
                      >
                        <Banknote size={20} />
                        <span className="text-xs font-bold">Dinheiro</span>
                      </button>
                    </div>
                  </div>

                  {/* Observations */}
                  <div className="space-y-2">
                    <label className="text-sm text-white/70 font-bold uppercase tracking-wide flex items-center gap-2">
                      <FileText size={16} />
                      Observações (Opcional)
                    </label>
                    <textarea
                      value={customerInfo.observation}
                      onChange={(e) => setCustomerInfo({ ...customerInfo, observation: e.target.value })}
                      placeholder="Ex: Campainha quebrada, portão amarelo"
                      rows={2}
                      className="w-full bg-[#1F1F1F] border border-white/10 rounded-xl p-4 text-white focus:outline-none focus:border-brand-orange transition resize-none"
                    />
                  </div>

                </div>

                <div className="p-6 bg-stone-900 border-t border-white/10 flex-shrink-0">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-white/50">Total a pagar</span>
                    <span className="text-2xl font-bold text-white">R$ {cartTotal.toFixed(2)}</span>
                  </div>
                  <button
                    onClick={handleConfirmOrder}
                    disabled={!customerInfo.name || !customerInfo.address || !customerInfo.phone || isSubmitting}
                    className={`w-full py-4 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${customerInfo.name && customerInfo.address && customerInfo.phone && !isSubmitting
                      ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-900/20 active:scale-[0.98]'
                      : 'bg-white/10 text-white/30 cursor-not-allowed'
                      }`}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 size={20} className="animate-spin" />
                        Enviando...
                      </>
                    ) : (
                      <>
                        <CheckCircle size={20} />
                        Confirmar Pedido
                      </>
                    )}
                  </button>
                  {(!customerInfo.name || !customerInfo.address || !customerInfo.phone) && (
                    <p className="text-center text-red-400 text-xs mt-3">Preencha nome, telefone e endereço para continuar</p>
                  )}
                </div>
              </>
            )}

          </div>
        </div>
      )}

      {/* 
        SUCCESS MODAL OVERLAY
      */}
      {isOrderPlaced && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-stone-900 border border-white/10 p-8 rounded-3xl max-w-sm w-full flex flex-col items-center text-center shadow-2xl animate-slide-up relative overflow-hidden">

            {/* Decorative Background Glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-32 bg-green-500/20 blur-[50px] rounded-full pointer-events-none"></div>

            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6 relative z-10">
              <CheckCircle size={40} className="text-green-500" />
            </div>

            <h3 className="font-serif font-bold text-2xl text-white mb-2 relative z-10">Pedido Confirmado!</h3>
            <p className="text-white/60 mb-8 relative z-10">
              Obrigado, {customerInfo.name.split(' ')[0]}! <br />
              Dentro de alguns instantes o seu pedido será entregue.
            </p>

            <div className="flex flex-col gap-3 w-full relative z-10">
              <button
                onClick={cleanUp}
                className="w-full bg-white/10 hover:bg-white/20 text-white py-3 rounded-xl font-bold transition flex items-center justify-center gap-2"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};