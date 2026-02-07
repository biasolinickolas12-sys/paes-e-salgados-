import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useStoreSettings() {
    const [isStoreOpen, setIsStoreOpen] = useState(true);
    const [openingHours, setOpeningHours] = useState('Terça a Domingo das 14h às 22h');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchSettings();
    }, []);

    async function fetchSettings() {
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('store_settings')
                .select('*')
                .limit(1)
                .single();

            if (error) throw error;

            if (data) {
                setIsStoreOpen((data as any).is_open);
                setOpeningHours((data as any).opening_hours || 'Terça a Domingo das 14h às 22h');
            }
        } catch (err) {
            console.error('Error fetching store settings:', err);
        } finally {
            setLoading(false);
        }
    }

    async function toggleStoreStatus() {
        try {
            const newStatus = !isStoreOpen;

            const { error } = await supabase
                .from('store_settings')
                .update({
                    is_open: newStatus,
                    updated_at: new Date().toISOString()
                } as any)
                .eq('id', 1);

            if (error) throw error;

            setIsStoreOpen(newStatus);
            return { success: true };
        } catch (err) {
            console.error('Error toggling store status:', err);
            return { success: false, error: err instanceof Error ? err.message : 'Erro ao atualizar status' };
        }
    }

    return {
        isStoreOpen,
        openingHours,
        loading,
        toggleStoreStatus,
        refetch: fetchSettings
    };
}
