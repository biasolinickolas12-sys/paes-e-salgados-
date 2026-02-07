export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: 'paes' | 'salgados' | 'doces';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface Order {
  id: number;
  customer_name: string;
  customer_phone: string;
  customer_address: string | null;
  total_amount: number;
  status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled';
  payment_method?: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number | null;
  product_name: string;
  product_price: number;
  quantity: number;
  subtotal: number;
}