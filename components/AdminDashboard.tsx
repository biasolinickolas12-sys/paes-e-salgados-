import React, { useState } from 'react';
import { LogOut, Calendar, TrendingUp, CheckCircle, Clock, Truck, Trash2, Archive, DollarSign, X, ChevronRight, Store, Lock, ShoppingBag, Edit2, Save, Users, MapPin, Phone, FileText, Copy, Bell, BellOff, Volume2, Sparkles } from 'lucide-react';
import { Product, Order } from '../types';
import { useOrders } from '../hooks/useOrders';
import { useCustomers } from '../hooks/useCustomers';
import { useEffect, useRef } from 'react';

interface AdminDashboardProps {
  onLogout: () => void;
  isStoreOpen: boolean;
  onToggleStore: () => void;
  products: Product[];
  onUpdateProductPrice: (id: number, newPrice: number) => void;
  bannerSettings: {
    active: boolean;
    text: string;
    price: number;
    discount: number;
  };
  onUpdateBanner: (settings: { active: boolean; text: string; price: number; discount: number }) => void;
}



const NOTIFICATION_SOUND_URL = '/notification.mp3';

// Helper para formatar itens do pedido
const formatOrderItems = (order: Order): string[] => {
  if (!order.order_items || order.order_items.length === 0) return [];
  return order.order_items.map(item => `${item.quantity}x ${item.product_name}`);
};

const copyOrderToClipboard = (order: Order) => {
  const items = formatOrderItems(order);
  const text = `*NOVO PEDIDO - #${order.id}*
👤 Cliente: ${order.customer_name}
📱 Telefone: ${order.customer_phone}
📍 Endereço: ${order.customer_address || 'Retirada / Não informado'}

🛒 *ITENS:*
${items.map(i => `- ${i}`).join('\n')}

💰 *TOTAL:* R$ ${Number(order.total_amount).toFixed(2)}
💳 *Pagamento:* ${order.payment_method || 'Não informado'}
${order.notes ? `📝 *Obs:* ${order.notes}` : ''}
`;

  navigator.clipboard.writeText(text).then(() => {
    alert('Pedido copiado!');
  });
};

interface OrderCardProps {
  order: Order;
  actions: React.ReactNode;
}

const OrderCard: React.FC<OrderCardProps> = ({ order, actions }) => {
  const items = formatOrderItems(order);

  return (
    <div className="bg-[#1F1F1F] border border-white/5 p-4 rounded-xl mb-3 shadow-md">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 mr-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-brand-orange font-bold text-sm">#{order.id}</span>
            <span className="text-white/60 text-xs bg-white/5 px-2 py-0.5 rounded font-mono">
              {new Date(order.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <h4 className="text-white font-bold text-lg leading-tight">{order.customer_name}</h4>

          <div className="flex flex-col gap-1 mt-2 text-sm text-white/60">
            <div className="flex items-center gap-2">
              <Phone size={14} className="text-brand-orange shrink-0" />
              <span className="text-white/80">{order.customer_phone}</span>
            </div>
            {order.customer_address && (
              <div className="flex items-start gap-2">
                <MapPin size={14} className="text-brand-orange shrink-0 mt-0.5" />
                <span className="line-clamp-2 text-white/80">{order.customer_address}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white/5 p-3 rounded-lg mb-3 border border-white/5">
        <p className="text-white/90 text-sm font-medium line-clamp-3">{items.join(', ')}</p>
        {order.notes && (
          <div className="mt-2 text-xs text-yellow-500/90 border-t border-white/10 pt-2 flex gap-2">
            <FileText size={12} className="shrink-0 mt-0.5" />
            <span className="italic">"{order.notes}"</span>
          </div>
        )}
      </div>

      <div className="flex justify-between items-end pt-2 border-t border-white/5">
        <div className="flex flex-col">
          <span className="text-[10px] text-white/40 uppercase font-bold tracking-wider mb-0.5">pagamento via</span>
          <span className="text-white/80 text-xs font-bold uppercase bg-white/5 px-2 py-1 rounded border border-white/5 self-start">
            {order.payment_method || 'Não inf.'}
          </span>
          <span className="text-white font-bold text-xl mt-2">R$ {Number(order.total_amount).toFixed(2)}</span>
        </div>
        <div className="flex gap-2 mb-1">
          {actions}
          <button
            onClick={() => copyOrderToClipboard(order)}
            className="bg-stone-700 text-white p-2 rounded hover:bg-stone-600 transition"
            title="Copiar Pedido"
          >
            <Copy size={16} />
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente para editar preço de produto individual
const ProductEditCard: React.FC<{ product: Product; onUpdate: (id: number, price: number) => void }> = ({ product, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [price, setPrice] = useState(product.price.toString());

  const handleSave = () => {
    const numPrice = parseFloat(price.replace(',', '.'));
    if (!isNaN(numPrice)) {
      onUpdate(product.id, numPrice);
      setIsEditing(false);
    }
  };

  return (
    <div className="bg-[#1F1F1F] border border-white/5 p-4 rounded-xl flex items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <img src={product.images[0]} alt={product.name} className="w-12 h-12 rounded-lg object-cover bg-stone-700" />
        <div>
          <h4 className="text-white font-bold">{product.name}</h4>
          <span className="text-white/40 text-xs capitalize">{product.category}</span>
        </div>
      </div>

      <div className="flex items-center gap-2">
        {isEditing ? (
          <div className="flex items-center gap-2">
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50 text-sm">R$</span>
              <input
                type="text"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="w-24 bg-white/5 border border-brand-orange rounded-lg py-1 pl-8 pr-2 text-white text-sm focus:outline-none"
                autoFocus
              />
            </div>
            <button
              onClick={handleSave}
              className="bg-brand-orange hover:bg-orange-600 p-1.5 rounded-lg text-white transition"
            >
              <Save size={16} />
            </button>
            <button
              onClick={() => {
                setIsEditing(false);
                setPrice(product.price.toString());
              }}
              className="bg-white/10 hover:bg-white/20 p-1.5 rounded-lg text-white transition"
            >
              <X size={16} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <span className="text-white font-bold">R$ {product.price.toFixed(2)}</span>
            <button
              onClick={() => setIsEditing(true)}
              className="text-white/30 hover:text-brand-orange transition p-1"
            >
              <Edit2 size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};


export const AdminDashboard: React.FC<AdminDashboardProps> = ({
  onLogout,
  isStoreOpen,
  onToggleStore,
  products,
  onUpdateProductPrice,
  bannerSettings,
  onUpdateBanner
}) => {
  const { orders, loading: ordersLoading, updateOrderStatus, deleteOrder } = useOrders();
  const { customers, loading: customersLoading } = useCustomers();
  const [view, setView] = useState<'dashboard' | 'history' | 'catalog' | 'clients'>('dashboard');
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [expandedSection, setExpandedSection] = useState<'in-progress' | 'delivery' | 'completed' | null>(null);
  const [notification, setNotification] = useState<{ id: number; customer: string } | null>(null);
  const [isSoundEnabled, setIsSoundEnabled] = useState(false);
  const prevOrdersCount = useRef(orders.length);
  const [localBanner, setLocalBanner] = useState(bannerSettings);
  const [isSavingBanner, setIsSavingBanner] = useState(false);

  // Sincroniza o estado local quando os dados chegam do banco
  useEffect(() => {
    setLocalBanner(bannerSettings);
  }, [bannerSettings]);

  const playNotificationSound = (isTest = false) => {
    if (!isSoundEnabled && !isTest) return;

    const tryPlay = (url: string, isFallback = false) => {
      console.log(`Tentando tocar som: ${url} (Teste: ${isTest})`);
      const audio = new Audio(url);
      audio.volume = 1.0;

      return audio.play()
        .then(() => console.log(`Som (${url}) reproduzido com sucesso!`))
        .catch(err => {
          console.error(`ERRO AO TOCAR SOM (${url}):`, err);
          if (!isFallback) {
            console.log('Tentando som de reserva...');
            return tryPlay('/notification_test.mp3', true);
          }
          if (isTest) {
            alert(`Erro ao tocar som: ${err.message}\nVerifique se os arquivos (/notification.mp3 ou /notification_test.mp3) foram commitados na pasta public.`);
          }
        });
    };

    tryPlay(NOTIFICATION_SOUND_URL);
  };


  useEffect(() => {
    // Detect new orders
    if (orders.length > prevOrdersCount.current) {
      const newOrder = orders[0]; // Orders are sorted by date descending
      if (newOrder && newOrder.status === 'pending') {
        setNotification({ id: newOrder.id, customer: newOrder.customer_name });
        playNotificationSound();

        // Auto-hide notification after 5 seconds
        const timer = setTimeout(() => {
          setNotification(null);
        }, 5000);
        return () => clearTimeout(timer);
      }
    }
    prevOrdersCount.current = orders.length;
  }, [orders]);

  // Cálculos de Faturamento
  const currentMonth = new Date().toLocaleString('pt-BR', { month: 'long' });
  const monthlyRevenue = orders
    .filter(o => o.status === 'delivered')
    .reduce((acc, curr) => Number(acc) + Number(curr.total_amount), 0);

  // Agrupamento por dia para o calendário
  const getDailyRevenue = () => {
    const dailyMap: Record<string, { total: number, count: number }> = {};

    orders.forEach(order => {
      if (['delivered'].includes(order.status)) {
        const dateObj = new Date(order.created_at);
        // Formato DD/MM
        const dayKey = dateObj.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });

        if (!dailyMap[dayKey]) {
          dailyMap[dayKey] = { total: 0, count: 0 };
        }
        dailyMap[dayKey].total += Number(order.total_amount);
        dailyMap[dayKey].count += 1;
      }
    });

    // Converter para array e ordenar (mais recente primeiro)
    return Object.entries(dailyMap).sort((a, b) => {
      // Hack simples para ordenar DD/MM invertendo para comparação
      const [dayA, monthA] = a[0].split('/');
      const [dayB, monthB] = b[0].split('/');
      return (Number(monthB) * 31 + Number(dayB)) - (Number(monthA) * 31 + Number(dayA));
    });
  };

  const dailyData = getDailyRevenue();

  const pendingOrders = orders.filter(o => o.status === 'pending');
  const confirmedOrders = orders.filter(o => o.status === 'confirmed');
  // Usando 'preparing' para representar "Saiu para Entrega" visualmente
  const outForDeliveryOrders = orders.filter(o => o.status === 'preparing');
  // 'delivered' e 'cancelled' vão para o histórico final
  const historyOrders = orders.filter(o => ['delivered', 'cancelled'].includes(o.status));

  const handleStatusChange = async (id: number, newStatus: Order['status']) => {
    await updateOrderStatus(id, newStatus);
  };

  const handleDelete = async (id: number) => {
    if (confirm('Tem certeza que deseja apagar este registro do histórico?')) {
      await deleteOrder(id);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] bg-stone-900 overflow-hidden flex flex-col animate-fadeIn">

      {/* HEADER */}
      <header className="bg-stone-900 border-b border-white/10 p-4 flex justify-between items-center z-10 shadow-lg gap-4">
        <div className="flex items-center gap-3 flex-1 overflow-hidden">
          <div className="w-10 h-10 bg-brand-orange/20 rounded-full flex items-center justify-center border border-brand-orange flex-shrink-0">
            <span className="text-brand-orange font-bold">CP</span>
          </div>
          <div className="min-w-0">
            <h1 className="text-white font-serif font-bold text-lg leading-none truncate">Célia Pães</h1>
            <span className="text-white/40 text-xs uppercase tracking-wider">Painel Admin</span>
          </div>
        </div>

        {/* CONTROLS */}
        <div className="flex items-center gap-2">


          {/* SOUND TOGGLE */}
          <button
            onClick={() => {
              setIsSoundEnabled(!isSoundEnabled);
              // Tocar um som curto para confirmar a ativação e satisfazer o navegador
              if (!isSoundEnabled) {
                const audio = new Audio(NOTIFICATION_SOUND_URL);
                audio.volume = 0.2; // Feedback suave ao ativar
                audio.play().catch(() => { });
              }
            }}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${isSoundEnabled
              ? 'bg-yellow-500/10 border-yellow-500/50 text-yellow-500 hover:bg-yellow-500/20'
              : 'bg-stone-700 border-white/10 text-white/30 hover:bg-stone-600'
              }`}
            title={isSoundEnabled ? "Som Ativado" : "Som Desativado (Clique para ativar)"}
          >
            {isSoundEnabled ? <Volume2 size={18} /> : <BellOff size={18} />}
            <span className="text-xs font-bold uppercase hidden md:inline">
              {isSoundEnabled ? 'Som ON' : 'Som OFF'}
            </span>
          </button>

          {/* TEST SOUND BUTTON (ONLY IF ON) */}
          {isSoundEnabled && (
            <button
              onClick={() => playNotificationSound(true)}
              className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-white/50 hover:bg-white/10 text-xs font-bold transition-all"
              title="Testar Som"
            >
              TESTAR
            </button>
          )}

          {/* STORE TOGGLE */}
          <button
            onClick={onToggleStore}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg border transition-all ${isStoreOpen
              ? 'bg-green-500/10 border-green-500/50 text-green-400 hover:bg-green-500/20'
              : 'bg-red-500/10 border-red-500/50 text-red-400 hover:bg-red-500/20'
              }`}
            title={isStoreOpen ? "Loja Aberta (Clique para fechar)" : "Loja Fechada (Clique para abrir)"}
          >
            {isStoreOpen ? <Store size={18} /> : <Lock size={18} />}
            <span className="text-xs font-bold uppercase hidden md:inline">
              {isStoreOpen ? 'Aberta' : 'Fechada'}
            </span>
            {/* Mobile Indicator Dot */}
            <div className={`w-2 h-2 rounded-full ${isStoreOpen ? 'bg-green-500' : 'bg-red-500'} md:hidden`}></div>
          </button>

          <button
            onClick={onLogout}
            className="p-2 text-white/50 hover:text-red-400 transition bg-white/5 rounded-lg border border-transparent hover:border-white/10"
            title="Sair"
          >
            <LogOut size={20} />
          </button>
        </div>
      </header>

      {/* SUB-HEADER / TABS */}
      <div className="px-4 py-3 bg-stone-800 border-b border-white/5 flex gap-2 overflow-x-auto">
        <button
          onClick={() => setView('dashboard')}
          className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition whitespace-nowrap ${view === 'dashboard' ? 'bg-brand-orange text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
        >
          <TrendingUp size={16} />
          Visão Geral
        </button>
        <button
          onClick={() => setView('catalog')}
          className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition whitespace-nowrap ${view === 'catalog' ? 'bg-brand-orange text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
        >
          <ShoppingBag size={16} />
          Cardápio/Preços
        </button>
        <button
          onClick={() => setView('history')}
          className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition whitespace-nowrap ${view === 'history' ? 'bg-brand-orange text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
        >
          <Archive size={16} />
          Histórico
        </button>
        <button
          onClick={() => setView('clients')}
          className={`px-4 py-2 rounded-lg text-sm font-bold flex items-center gap-2 transition whitespace-nowrap ${view === 'clients' ? 'bg-brand-orange text-white' : 'bg-white/5 text-white/50 hover:bg-white/10'
            }`}
        >
          <Users size={16} />
          Clientes
        </button>
      </div>

      {/* CONTENT */}
      <div className={`flex-1 overflow-y-auto bg-stone-900 ${view === 'clients' ? 'p-2 md:p-6' : 'p-4 md:p-6'}`}>

        {view === 'dashboard' && (
          <div className="space-y-6">

            {/* FATURAMENTO CARD (CLICKABLE) */}
            <div
              onClick={() => setIsCalendarOpen(true)}
              className="group bg-gradient-to-br from-stone-800 to-stone-900 border border-white/10 p-6 rounded-2xl shadow-xl relative overflow-hidden cursor-pointer hover:border-brand-orange/50 transition-all active:scale-[0.99]"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <DollarSign size={100} className="text-green-500" />
              </div>

              {/* Visual hint that it's clickable */}
              <div className="absolute top-4 right-4 text-white/30 group-hover:text-white transition">
                <ChevronRight size={24} />
              </div>

              <div className="relative z-10">
                <div className="flex items-center gap-2 text-green-400 mb-2">
                  <Calendar size={18} />
                  <span className="uppercase text-xs font-bold tracking-widest">{currentMonth}</span>
                </div>
                <h2 className="text-white/60 text-sm group-hover:text-white transition-colors">Faturamento Confirmado</h2>
                <p className="text-4xl font-serif font-bold text-white mt-1">R$ {monthlyRevenue.toFixed(2)}</p>
                <p className="text-xs text-white/30 mt-2 font-mono">Clique para ver detalhes diários</p>
              </div>
            </div>

            {/* SEÇÕES COLAPSÁVEIS */}
            <div className="space-y-4">

              {/* EM ANDAMENTO */}
              <div className="bg-[#1F1F1F] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300">
                <button
                  onClick={() => setExpandedSection(prev => prev === 'in-progress' ? null : 'in-progress')}
                  className={`w-full p-5 flex items-center justify-between transition-colors ${expandedSection === 'in-progress' ? 'bg-white/5' : 'hover:bg-white/5'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${expandedSection === 'in-progress' ? 'bg-yellow-500 text-stone-900' : 'bg-yellow-500/10 text-yellow-500'}`}>
                      <Clock size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-lg text-white">Em Andamento</h3>
                      <p className="text-white/40 text-sm">{pendingOrders.length + confirmedOrders.length} pedidos em fila</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className={`text-white/30 transition-transform duration-300 ${expandedSection === 'in-progress' ? 'rotate-90' : ''}`} />
                </button>

                {expandedSection === 'in-progress' && (
                  <div className="p-4 border-t border-white/5 space-y-4">
                    {/* Novos Pedidos */}
                    {pendingOrders.map(order => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        actions={
                          <div className="flex gap-2">
                            <button
                              onClick={() => handleStatusChange(order.id, 'confirmed')}
                              className="bg-green-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-green-500 transition"
                            >
                              Confirmar
                            </button>
                            <button
                              onClick={() => handleDelete(order.id)}
                              className="bg-red-600/20 text-red-500 border border-red-500/30 px-3 py-1 rounded text-xs font-bold hover:bg-red-600 hover:text-white transition"
                            >
                              Recusar
                            </button>
                          </div>
                        }
                      />
                    ))}

                    {/* Confirmados */}
                    {confirmedOrders.map(order => (
                      <div key={order.id} className="relative">
                        <div className="absolute -left-3 top-4 w-1 h-8 bg-yellow-500 rounded-r"></div>
                        <OrderCard
                          order={order}
                          actions={
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleStatusChange(order.id, 'preparing')}
                                className="bg-blue-600 text-white px-3 py-1 rounded text-xs font-bold hover:bg-blue-500 transition flex items-center gap-1"
                              >
                                <Truck size={12} /> Despachar
                              </button>
                              <button
                                onClick={() => handleDelete(order.id)}
                                className="bg-red-600/20 text-red-500 border border-red-500/30 px-3 py-1 rounded text-xs font-bold hover:bg-red-600 hover:text-white transition"
                              >
                                Recusar
                              </button>
                            </div>
                          }
                        />
                      </div>
                    ))}

                    {pendingOrders.length === 0 && confirmedOrders.length === 0 && (
                      <p className="text-white/20 text-center py-8 italic">Nenhum pedido em andamento</p>
                    )}
                  </div>
                )}
              </div>

              {/* SAIU P/ ENTREGA */}
              <div className="bg-[#1F1F1F] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300">
                <button
                  onClick={() => setExpandedSection(prev => prev === 'delivery' ? null : 'delivery')}
                  className={`w-full p-5 flex items-center justify-between transition-colors ${expandedSection === 'delivery' ? 'bg-white/5' : 'hover:bg-white/5'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${expandedSection === 'delivery' ? 'bg-blue-500 text-white' : 'bg-blue-500/10 text-blue-500'}`}>
                      <Truck size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-lg text-white">Saiu p/ Entrega</h3>
                      <p className="text-white/40 text-sm">{outForDeliveryOrders.length} pedidos em rota</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className={`text-white/30 transition-transform duration-300 ${expandedSection === 'delivery' ? 'rotate-90' : ''}`} />
                </button>

                {expandedSection === 'delivery' && (
                  <div className="p-4 border-t border-white/5 space-y-4">
                    {outForDeliveryOrders.map(order => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        actions={
                          <button
                            onClick={() => handleStatusChange(order.id, 'delivered')}
                            className="bg-white/10 text-white px-3 py-1 rounded text-xs font-bold hover:bg-white/20 transition flex items-center gap-1"
                          >
                            <CheckCircle size={12} /> Concluir
                          </button>
                        }
                      />
                    ))}
                    {outForDeliveryOrders.length === 0 && (
                      <p className="text-white/20 text-center py-8 italic">Nenhum pedido em rota de entrega</p>
                    )}
                  </div>
                )}
              </div>

              {/* CONCLUÍDOS RECENTES */}
              <div className="bg-[#1F1F1F] border border-white/5 rounded-2xl overflow-hidden transition-all duration-300">
                <button
                  onClick={() => setExpandedSection(prev => prev === 'completed' ? null : 'completed')}
                  className={`w-full p-5 flex items-center justify-between transition-colors ${expandedSection === 'completed' ? 'bg-white/5' : 'hover:bg-white/5'
                    }`}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-3 rounded-xl ${expandedSection === 'completed' ? 'bg-green-500 text-stone-900' : 'bg-green-500/10 text-green-500'}`}>
                      <CheckCircle size={24} />
                    </div>
                    <div className="text-left">
                      <h3 className="font-bold text-lg text-white">Concluídos (Hoje)</h3>
                      <p className="text-white/40 text-sm">{historyOrders.length} pedidos finalizados</p>
                    </div>
                  </div>
                  <ChevronRight size={20} className={`text-white/30 transition-transform duration-300 ${expandedSection === 'completed' ? 'rotate-90' : ''}`} />
                </button>

                {expandedSection === 'completed' && (
                  <div className="p-4 border-t border-white/5 space-y-4">
                    {historyOrders.slice(0, 5).map(order => (
                      <OrderCard
                        key={order.id}
                        order={order}
                        actions={<span className="text-xs text-green-500 font-bold">Finalizado</span>}
                      />
                    ))}
                    <div className="text-center pt-2">
                      <button
                        onClick={() => setView('history')}
                        className="text-brand-orange text-sm font-bold hover:underline"
                      >
                        Ver histórico completo
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {view === 'catalog' && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Banner Promocional Management */}
            <div className="bg-[#1F1F1F] border border-white/5 rounded-2xl overflow-hidden shadow-xl">
              <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/5">
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-brand-orange/20 rounded-lg text-brand-orange">
                    <Sparkles size={24} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">Banner Promocional</h3>
                    <p className="text-white/40 text-xs">Exibido na página inicial do site</p>
                  </div>
                </div>
                <button
                  onClick={async () => {
                    setIsSavingBanner(true);
                    await onUpdateBanner({ ...localBanner, active: !localBanner.active });
                    setIsSavingBanner(false);
                  }}
                  disabled={isSavingBanner}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl border transition-all ${localBanner.active
                    ? 'bg-green-500/10 border-green-500/50 text-green-400'
                    : 'bg-stone-700 border-white/10 text-white/30'
                    } ${isSavingBanner ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="text-xs font-bold uppercase">{localBanner.active ? 'Ativado' : 'Desativado'}</span>
                  <div className={`w-3 h-3 rounded-full ${localBanner.active ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-stone-500'}`}></div>
                </button>
              </div>

              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2 block">Texto do Banner</label>
                    <input
                      type="text"
                      value={localBanner.text}
                      onChange={(e) => setLocalBanner({ ...localBanner, text: e.target.value })}
                      placeholder="Ex: Oferta Especial: Pão de Queijo Recheado"
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange transition"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2 block">Preço (R$)</label>
                    <input
                      type="number"
                      step="0.01"
                      value={localBanner.price}
                      onChange={(e) => setLocalBanner({ ...localBanner, price: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange transition"
                    />
                  </div>
                  <div>
                    <label className="text-white/40 text-xs font-bold uppercase tracking-wider mb-2 block">Desconto (%)</label>
                    <input
                      type="number"
                      value={localBanner.discount}
                      onChange={(e) => setLocalBanner({ ...localBanner, discount: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-brand-orange transition"
                    />
                  </div>
                </div>
              </div>

              {/* Save Button */}
              <div className="px-6 pb-6 flex justify-end">
                <button
                  onClick={async () => {
                    setIsSavingBanner(true);
                    await onUpdateBanner(localBanner);
                    setIsSavingBanner(false);
                    alert('Configurações do banner salvas!');
                  }}
                  disabled={isSavingBanner}
                  className="bg-brand-orange text-white px-6 py-2 rounded-xl font-bold text-sm hover:bg-orange-600 transition flex items-center gap-2 shadow-lg shadow-brand-orange/20 disabled:opacity-50"
                >
                  {isSavingBanner ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save size={16} />
                      Salvar Alterações
                    </>
                  )}
                </button>
              </div>

              {/* Banner Preview */}
              <div className="px-6 pb-6 mt-2">
                <p className="text-white/20 text-[10px] font-bold uppercase tracking-widest mb-3">Prévia do Banner</p>
                <div className={`rounded-xl overflow-hidden pointer-events-none opacity-80 border border-white/5`}>
                  <div className="w-full bg-brand-orange text-white py-2 px-4 flex items-center justify-center gap-4 text-xs">
                    <Sparkles size={12} className="text-yellow-300" />
                    <span className="font-bold uppercase">{localBanner.text || 'Texto do Banner'}</span>
                    <div className="flex items-center gap-2 bg-black/10 px-2 py-0.5 rounded-full">
                      <span className="opacity-50 line-through">R$ {(localBanner.price || 0).toFixed(2)}</span>
                      <span className="font-black">R$ {((localBanner.price || 0) * (1 - (localBanner.discount || 0) / 100)).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="max-w-4xl mx-auto">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl text-white font-bold flex items-center gap-2">
                  <ShoppingBag className="text-brand-orange" /> Gestão de Preços
                </h2>
                <span className="text-white/40 text-sm">{products.length} produtos</span>
              </div>

              <div className="space-y-3">
                {products.map(product => (
                  <ProductEditCard
                    key={product.id}
                    product={product}
                    onUpdate={onUpdateProductPrice}
                  />
                ))}
              </div>
            </div>
          </div>
        )}

        {view === 'history' && (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl text-white font-bold flex items-center gap-2">
                <Archive className="text-brand-orange" /> Histórico de Pedidos
              </h2>
              <span className="text-white/40 text-sm">{historyOrders.length} registros</span>
            </div>

            <div className="bg-[#1F1F1F] rounded-2xl overflow-hidden border border-white/5">
              {historyOrders.length === 0 ? (
                <div className="p-8 text-center text-white/30">
                  <Archive size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Nenhum pedido no histórico ainda.</p>
                </div>
              ) : (
                <table className="w-full text-left text-sm text-white/70">
                  <thead className="bg-white/5 text-white font-bold uppercase text-xs">
                    <tr>
                      <th className="p-4">ID</th>
                      <th className="p-4">Data</th>
                      <th className="p-4">Cliente</th>
                      <th className="p-4">Total</th>
                      <th className="p-4 text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {historyOrders.map(order => (
                      <tr key={order.id} className="hover:bg-white/5 transition">
                        <td className="p-4 font-mono text-brand-orange">{order.id}</td>
                        <td className="p-4">{new Date(order.created_at).toLocaleDateString()}</td>
                        <td className="p-4 font-bold text-white">{order.customer_name}</td>
                        <td className="p-4">R$ {Number(order.total_amount).toFixed(2)}</td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => handleDelete(order.id)}
                            className="text-red-400 hover:text-red-300 hover:bg-red-500/10 p-2 rounded transition"
                            title="Apagar Registro"
                          >
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        )}

        {view === 'clients' && (
          <div className="max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-3 md:mb-6 px-1">
              <h2 className="text-lg md:text-xl text-white font-bold flex items-center gap-2">
                <Users className="text-brand-orange" size={20} />
                Base de Clientes
              </h2>
              <span className="text-white/40 text-xs md:text-sm bg-white/5 px-2 py-1 rounded-full">{customers.length} clientes</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
              {customers.map(customer => (
                <div key={customer.id} className="bg-[#1F1F1F] border border-white/5 p-4 md:p-5 rounded-xl flex items-start gap-3 md:gap-4 hover:border-brand-orange/30 transition group">
                  <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center shrink-0 group-hover:bg-brand-orange/20 group-hover:text-brand-orange transition">
                    <span className="font-bold text-lg">{customer.name.charAt(0).toUpperCase()}</span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-start">
                      <h3 className="text-white font-bold text-lg truncate pr-2">{customer.name}</h3>
                      <span className="text-xs bg-brand-orange/20 text-brand-orange px-2 py-0.5 rounded-full whitespace-nowrap">
                        {customer.total_orders} pedido(s)
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      <div className="flex items-center gap-2 text-white/40 text-sm">
                        <Phone size={14} />
                        <span>{customer.phone}</span>
                      </div>
                      <div className="flex items-start gap-2 text-white/40 text-sm">
                        <MapPin size={14} className="mt-0.5 shrink-0" />
                        <span className="line-clamp-2">{customer.address || "Endereço não informado"}</span>
                      </div>
                    </div>

                    <div className="mt-4 pt-3 border-t border-white/5 flex justify-between items-center">
                      <span className="text-xs text-white/30">
                        Último pedido: {new Date(customer.last_order_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              ))}

              {customers.length === 0 && (
                <div className="col-span-full py-12 text-center text-white/30">
                  <Users size={48} className="mx-auto mb-4 opacity-20" />
                  <p>Nenhum cliente registrado ainda.</p>
                </div>
              )}
            </div>
          </div>
        )}

      </div>

      {/* 
        CALENDAR / DAILY REVENUE MODAL 
      */}
      {isCalendarOpen && (
        <div className="fixed inset-0 z-[80] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fadeIn">
          <div className="bg-stone-900 border border-white/10 w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden flex flex-col relative animate-slide-up max-h-[80vh]">

            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 flex justify-between items-center bg-stone-900 sticky top-0 z-10">
              <div className="flex items-center gap-2">
                <Calendar className="text-brand-orange" size={20} />
                <h3 className="font-serif font-bold text-white text-lg">Receita por Dia</h3>
              </div>
              <button
                onClick={() => setIsCalendarOpen(false)}
                className="text-white/50 hover:text-white transition"
              >
                <X size={20} />
              </button>
            </div>

            {/* Daily List */}
            <div className="overflow-y-auto p-2">
              {dailyData.length === 0 ? (
                <div className="p-8 text-center text-white/30">
                  <p>Nenhuma receita registrada neste período.</p>
                </div>
              ) : (
                <div className="space-y-2">
                  {dailyData.map(([date, data]) => (
                    <div key={date} className="bg-[#1F1F1F] border border-white/5 p-4 rounded-xl flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="bg-white/5 w-10 h-10 rounded-lg flex flex-col items-center justify-center border border-white/5">
                          <span className="text-[10px] uppercase text-white/40 font-bold">{date.split('/')[1]}</span>
                          <span className="text-lg font-bold text-white leading-none">{date.split('/')[0]}</span>
                        </div>
                        <div className="flex flex-col">
                          <span className="text-white font-bold">Dia {date}</span>
                          <span className="text-xs text-white/40">{data.count} pedido(s)</span>
                        </div>
                      </div>
                      <span className="text-green-400 font-bold text-lg">R$ {data.total.toFixed(2)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer Summary */}
            <div className="p-4 bg-stone-800 border-t border-white/10">
              <div className="flex justify-between items-center">
                <span className="text-white/60 text-sm">Total do Mês</span>
                <span className="text-white font-bold text-xl">R$ {monthlyRevenue.toFixed(2)}</span>
              </div>
            </div>

          </div>
        </div>
      )}
      {/* 
        NEW ORDER NOTIFICATION TOAST
      */}
      {notification && (
        <div
          className="fixed top-6 right-6 z-[100] bg-brand-orange text-white p-4 rounded-2xl shadow-2xl flex items-center gap-4 animate-slide-left border border-white/20 cursor-pointer hover:scale-105 transition-transform"
          onClick={() => {
            setNotification(null);
            setView('dashboard');
            setExpandedSection('in-progress');
          }}
        >
          <div className="bg-white/20 p-2 rounded-xl">
            <Bell size={24} className="animate-bounce" />
          </div>
          <div>
            <p className="font-bold text-sm uppercase tracking-wider">Novo Pedido!</p>
            <p className="text-white/90 text-sm">#{notification.id} - {notification.customer}</p>
          </div>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setNotification(null);
            }}
            className="ml-2 p-1 hover:bg-white/10 rounded-full transition"
          >
            <X size={18} />
          </button>
        </div>
      )}

    </div>
  );
};