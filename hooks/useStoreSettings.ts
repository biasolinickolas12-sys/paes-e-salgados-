import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export function useStoreSettings() {
    const [isStoreOpen, setIsStoreOpen] = useState(true);
    const [openingHours, setOpeningHours] = useState('Terça a Domingo das 14h às 22h');
    const [bannerSettings, setBannerSettings] = useState({
        active: false,
        text: '',
        price: 0,
        discount: 0
    });
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
                const settings = data as any;
                setIsStoreOpen(settings.is_open);
                setOpeningHours(settings.opening_hours || 'Terça a Domingo das 14h às 22h');
                setBannerSettings({
                    active: settings.banner_active || false,
                    text: settings.banner_text || '',
                    price: Number(settings.banner_price) || 0,
                    discount: settings.banner_discount || 0
                });
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

    async function updateBannerSettings(settings: { active: boolean; text: string; price: number; discount: number }) {
        try {
            const { error } = await supabase
                .from('store_settings')
                .update({
                    banner_active: settings.active,
                    banner_text: settings.text,
                    banner_price: settings.price,
                    banner_discount: settings.discount,
                    updated_at: new Date().toISOString()
                } as any)
                .eq('id', 1);

            if (error) throw error;

            setBannerSettings(settings);
            return { success: true };
        } catch (err) {
            console.error('Error updating banner settings:', err);
            return { success: false, error: err instanceof Error ? err.message : 'Erro ao atualizar banner' };
        }
    }

    return {
        isStoreOpen,
        openingHours,
        bannerSettings,
        loading,
        toggleStoreStatus,
        updateBannerSettings,
        refetch: fetchSettings
    };
}
