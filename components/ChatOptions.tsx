import React from 'react';
import { MessageSquare, ShoppingBag, ArrowLeft, Wheat } from 'lucide-react';

interface ChatOptionsProps {
  onBack: () => void;
  onSelectCatalog: () => void;
}

export const ChatOptions: React.FC<ChatOptionsProps> = ({ onBack, onSelectCatalog }) => {

  const handleDescribeOrder = () => {
    // Redirecionamento direto para o link fornecido
    window.open('https://wa.me/5511998093678?text=Ol%C3%A1%2C%20vou%20descrever%20qual%20%C3%A9%20minha%20encomenda%20%3A', '_blank');
  };

  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-stone-900 animate-fadeIn">
      {/* 
        HEADER DO CHAT 
      */}
      <div className="flex-none flex items-center gap-4 p-4 bg-stone-900 border-b border-white/5 shadow-md z-10">
        <button onClick={onBack} className="p-2 -ml-2 text-white/70 hover:text-white transition">
          <ArrowLeft size={24} />
        </button>

        <div className="relative">
          <div className="w-10 h-10 rounded-full bg-brand-orange/20 border border-brand-orange flex items-center justify-center overflow-hidden">
            <Wheat className="text-brand-orange" size={20} />
          </div>
          <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-stone-900 rounded-full"></div>
        </div>

        <div className="flex flex-col justify-center">
          <span className="font-serif font-bold text-white text-base tracking-wide leading-tight">CÉLIA PÃES E SALGADOS</span>
          <span className="text-[10px] text-green-400 font-sans tracking-wider uppercase">Online agora</span>
        </div>
      </div>

      {/* 
        CONTEÚDO
      */}
      <div className="flex-1 relative flex flex-col items-center p-6 overflow-y-auto bg-stone-800">
        {/* Background Pattern Overlay */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>

        {/* 
            ALTERAÇÃO: 
            - Removido 'my-auto' para que o conteúdo não fique centralizado verticalmente na tela toda.
            - Adicionado 'mt-4' para dar um pequeno respiro do topo.
            - Aumentado 'gap-6' para 'gap-12' para afastar a mensagem dos botões.
        */}
        <div className="w-full max-w-sm flex flex-col gap-12 mt-4 relative z-10 pb-10">

          {/* Bot Message Block */}
          <div className="flex gap-3 animate-fade-in-up opacity-0" style={{ animationDelay: '0.1s' }}>
            <div className="w-8 h-8 rounded-full bg-brand-orange flex-shrink-0 flex items-center justify-center mt-1 shadow-sm">
              <span className="font-hand font-bold text-white text-sm">C</span>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <div className="bg-white text-stone-800 p-5 rounded-2xl rounded-tl-none shadow-lg relative">
                <p className="text-base font-sans leading-relaxed">
                  Olá! Que alegria ter você aqui. ❤️
                  <br /><br />
                  Encomende já suas delícias. Como você prefere fazer seu pedido hoje?
                </p>
                <span className="text-[10px] text-gray-400 absolute bottom-2 right-4">
                  {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          </div>

          {/* Action Buttons Block */}
          <div className="flex flex-col gap-4 animate-fade-in-up opacity-0" style={{ animationDelay: '0.4s' }}>

            <button
              onClick={handleDescribeOrder}
              className="w-full bg-[#1F1F1F] hover:bg-[#2A2A2A] text-white border border-white/10 p-5 rounded-xl flex items-center justify-center gap-4 transition-all active:scale-[0.98] group shadow-md hover:shadow-xl hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-full bg-white/5 flex items-center justify-center group-hover:bg-brand-orange/10 transition-colors">
                <MessageSquare size={24} className="text-brand-orange" />
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="font-bold text-lg text-white">Descrever minha encomenda</span>
                <span className="text-xs text-white/50">Para pedidos personalizados</span>
              </div>
            </button>

            <button
              onClick={onSelectCatalog}
              className="w-full bg-brand-orange hover:bg-orange-600 text-white p-5 rounded-xl flex items-center justify-center gap-4 shadow-lg shadow-orange-900/20 transition-all active:scale-[0.98] group hover:shadow-orange-900/40 hover:-translate-y-1"
            >
              <div className="w-12 h-12 rounded-full bg-white/20 flex items-center justify-center">
                <ShoppingBag size={24} className="text-white" />
              </div>
              <div className="flex flex-col items-start text-left">
                <span className="font-bold text-lg">Selecionar meus pedidos</span>
                <span className="text-xs text-white/80">Escolher do cardápio</span>
              </div>
            </button>

            <div className="mt-2 text-center">
              <p className="text-white/20 text-[10px] uppercase tracking-[0.2em] font-bold">Atendimento Artesanal</p>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};