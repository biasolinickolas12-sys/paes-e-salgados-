import { supabase } from '../lib/supabase';
import { CartItem } from '../types';

interface CreateOrderParams {
    customerName: string;
    customerPhone: string;
    customerAddress?: string;
    items: CartItem[];
    notes?: string;
    paymentMethod?: string;
}

export async function createOrder(params: CreateOrderParams) {
    try {
        const { customerName, customerPhone, customerAddress, items, notes, paymentMethod } = params;

        // Calculate total
        const totalAmount = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

        // Insert order
        const { data: order, error: orderError } = await supabase
            .from('orders')
            .insert({
                customer_name: customerName,
                customer_phone: customerPhone,
                customer_address: customerAddress,
                total_amount: totalAmount,
                notes,
                payment_method: paymentMethod,
                status: 'pending'
            } as any)
            .select()
            .single();

        if (orderError) throw orderError;
        if (!order) throw new Error('Failed to create order');

        // Insert order items
        const orderItems = items.map(item => ({
            order_id: order.id,
            product_id: item.id,
            product_name: item.name,
            product_price: item.price,
            quantity: item.quantity,
            subtotal: item.price * item.quantity
        }));

        const { error: itemsError } = await supabase
            .from('order_items')
            .insert(orderItems as any);

        if (itemsError) throw itemsError;

        return { success: true, orderId: order.id };
    } catch (err) {
        console.error('Error creating order:', err);
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Erro ao criar pedido'
        };
    }
}

export async function getOrders() {
    try {
        const { data, error } = await supabase
            .from('orders')
            .select(`
        *,
        order_items (*)
      `)
            .order('created_at', { ascending: false });

        if (error) throw error;

        return { success: true, data };
    } catch (err) {
        console.error('Error fetching orders:', err);
        return {
            success: false,
            error: err instanceof Error ? err.message : 'Erro ao buscar pedidos'
        };
    }
}
