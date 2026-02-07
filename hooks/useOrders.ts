import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

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

export function useOrders() {
    const [orders, setOrders] = useState<Order[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchOrders();
    }, []);

    async function fetchOrders() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('orders')
                .select(`
                    *,
                    order_items (*)
                `)
                .order('created_at', { ascending: false });

            if (error) throw error;

            setOrders(data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar pedidos');
            console.error('Error fetching orders:', err);
        } finally {
            setLoading(false);
        }
    }

    async function updateOrderStatus(id: number, newStatus: Order['status']) {
        try {
            const { error } = await supabase
                .from('orders')
                .update({
                    status: newStatus,
                    updated_at: new Date().toISOString()
                } as any)
                .eq('id', id);

            if (error) throw error;

            // Update local state
            setOrders(prev =>
                prev.map(order =>
                    order.id === id ? { ...order, status: newStatus } : order
                )
            );

            return { success: true };
        } catch (err) {
            console.error('Error updating order status:', err);
            return { success: false, error: err instanceof Error ? err.message : 'Erro ao atualizar status' };
        }
    }

    async function deleteOrder(id: number) {
        try {
            // First delete order items (due to foreign key constraint)
            const { error: itemsError } = await supabase
                .from('order_items')
                .delete()
                .eq('order_id', id);

            if (itemsError) throw itemsError;

            // Then delete the order
            const { error: orderError } = await supabase
                .from('orders')
                .delete()
                .eq('id', id);

            if (orderError) throw orderError;

            // Update local state
            setOrders(prev => prev.filter(order => order.id !== id));

            return { success: true };
        } catch (err) {
            console.error('Error deleting order:', err);
            return { success: false, error: err instanceof Error ? err.message : 'Erro ao deletar pedido' };
        }
    }

    return {
        orders,
        loading,
        error,
        updateOrderStatus,
        deleteOrder,
        refetch: fetchOrders
    };
}
