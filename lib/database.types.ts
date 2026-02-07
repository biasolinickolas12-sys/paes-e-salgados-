export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            products: {
                Row: {
                    id: number
                    name: string
                    description: string | null
                    price: number
                    images: string[]
                    category: 'paes' | 'salgados' | 'doces'
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: number
                    name: string
                    description?: string | null
                    price: number
                    images?: string[]
                    category: 'paes' | 'salgados' | 'doces'
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: number
                    name?: string
                    description?: string | null
                    price?: number
                    images?: string[]
                    category?: 'paes' | 'salgados' | 'doces'
                    created_at?: string
                    updated_at?: string
                }
            }
            orders: {
                Row: {
                    id: number
                    customer_name: string
                    customer_phone: string
                    customer_address: string | null
                    total_amount: number
                    status: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled'
                    notes: string | null
                    created_at: string
                    updated_at: string
                }
                Insert: {
                    id?: number
                    customer_name: string
                    customer_phone: string
                    customer_address?: string | null
                    total_amount: number
                    status?: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled'
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
                Update: {
                    id?: number
                    customer_name?: string
                    customer_phone?: string
                    customer_address?: string | null
                    total_amount?: number
                    status?: 'pending' | 'confirmed' | 'preparing' | 'delivered' | 'cancelled'
                    notes?: string | null
                    created_at?: string
                    updated_at?: string
                }
            }
            order_items: {
                Row: {
                    id: number
                    order_id: number
                    product_id: number | null
                    product_name: string
                    product_price: number
                    quantity: number
                    subtotal: number
                }
                Insert: {
                    id?: number
                    order_id: number
                    product_id?: number | null
                    product_name: string
                    product_price: number
                    quantity: number
                    subtotal: number
                }
                Update: {
                    id?: number
                    order_id?: number
                    product_id?: number | null
                    product_name?: string
                    product_price?: number
                    quantity?: number
                    subtotal?: number
                }
            }
            store_settings: {
                Row: {
                    id: number
                    is_open: boolean
                    opening_hours: string | null
                    updated_at: string
                }
                Insert: {
                    id?: number
                    is_open?: boolean
                    opening_hours?: string | null
                    updated_at?: string
                }
                Update: {
                    id?: number
                    is_open?: boolean
                    opening_hours?: string | null
                    updated_at?: string
                }
            }
        }
    }
}
