import { Product } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Empada de Frango",
    description: "Massa podre que desmancha na boca, com recheio cremoso de frango temperado e azeitonas.",
    price: 8.00,
    images: [
      "https://images.unsplash.com/photo-1626100130638-517a80b08055?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1571212502280-9a3b8364b73b?q=80&w=600&auto=format&fit=crop"
    ],
    category: 'salgados'
  },
  {
    id: 2,
    name: "Pão Caseiro",
    description: "Receita tradicional de família. Pão macio, fresquinho, perfeito para acompanhar o café.",
    price: 15.00,
    images: [
      "https://images.unsplash.com/photo-1509440159596-0249088772ff?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?q=80&w=600&auto=format&fit=crop"
    ],
    category: 'paes'
  },
  {
    id: 3,
    name: "Pão Doce",
    description: "Pãozinho doce coberto com creme suave e coco ralado. Fofinho e saboroso.",
    price: 12.00,
    images: [
      "https://images.unsplash.com/photo-1623334044303-241021148842?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=600&auto=format&fit=crop"
    ],
    category: 'paes'
  },
  {
    id: 4,
    name: "Rosca de Creme",
    description: "Rosca trançada artesanalmente, recheada e coberta com nosso creme de confeiteiro especial.",
    price: 22.00,
    images: [
      "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?q=80&w=600&auto=format&fit=crop"
    ],
    category: 'doces'
  },
  {
    id: 5,
    name: "Rosca de Doce de Leite",
    description: "Massa leve recheada com doce de leite cremoso. Uma explosão de sabor.",
    price: 24.00,
    images: [
      "https://images.unsplash.com/photo-1563890250-936d5fe06873?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1563890250-936d5fe06873?q=80&w=600&auto=format&fit=crop"
    ],
    category: 'doces'
  },
  {
    id: 6,
    name: "Rosca de Goiabada",
    description: "O clássico que não pode faltar. Rosca macia com recheio generoso de goiabada derretida.",
    price: 20.00,
    images: [
      "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1517433670267-08bbd4be890f?q=80&w=600&auto=format&fit=crop"
    ],
    category: 'doces'
  },
  {
    id: 7,
    name: "Bolo de Goiabada",
    description: "Bolo fofinho de fubá com pedaços de goiabada. Ideal para o lanche da tarde.",
    price: 18.00,
    images: [
      "https://images.unsplash.com/photo-1557925923-9599580468e2?q=80&w=600&auto=format&fit=crop",
      "https://images.unsplash.com/photo-1557925923-9599580468e2?q=80&w=600&auto=format&fit=crop"
    ],
    category: 'doces'
  }
];