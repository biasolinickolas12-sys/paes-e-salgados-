import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Customer {
    id: string;
    name: string;
    phone: string;
    address: string | null;
    last_order_at: string;
    total_orders: number;
    created_at: string;
}

export function useCustomers() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchCustomers();
    }, []);

    async function fetchCustomers() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('customers')
                .select('*')
                .order('last_order_at', { ascending: false });

            if (error) throw error;

            setCustomers(data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar clientes');
            console.error('Error fetching customers:', err);
        } finally {
            setLoading(false);
        }
    }

    return {
        customers,
        loading,
        error,
        refetch: fetchCustomers
    };
}
