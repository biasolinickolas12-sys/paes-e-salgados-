import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product } from '../types';

export function useProducts() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchProducts();
    }, []);

    async function fetchProducts() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('products')
                .select('*')
                .order('id', { ascending: true });

            if (error) throw error;

            setProducts(data || []);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Erro ao carregar produtos');
            console.error('Error fetching products:', err);
        } finally {
            setLoading(false);
        }
    }

    async function updateProductPrice(id: number, newPrice: number) {
        try {
            const { error } = await supabase
                .from('products')
                .update({
                    price: newPrice,
                    updated_at: new Date().toISOString()
                } as any)
                .eq('id', id);

            if (error) throw error;

            // Update local state
            setProducts(prev =>
                prev.map(product =>
                    product.id === id ? { ...product, price: newPrice } : product
                )
            );

            return { success: true };
        } catch (err) {
            console.error('Error updating product price:', err);
            return { success: false, error: err instanceof Error ? err.message : 'Erro ao atualizar preço' };
        }
    }

    return {
        products,
        loading,
        error,
        updateProductPrice,
        refetch: fetchProducts
    };
}
