/* eslint-disable @typescript-eslint/no-explicit-any */
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

// Fallback Mock Database for offline/demo development without Supabase keys configured
class MockSupabaseClient {
  private invoices: any[] = [];

  constructor() {
    // Populate some initial dummy data for demo purposes
    this.invoices = [
      {
        id: 'invoice_mock_1',
        client_name: 'Acme Corp',
        amount_usdc: 500,
        wallet_address: '0x32A292b1236C8b387AF585E2e6b72018861B1B48',
        status: 'Pending',
        created_at: new Date(Date.now() - 3600000).toISOString()
      },
      {
        id: 'invoice_mock_2',
        client_name: 'Stark Enterprises',
        amount_usdc: 1200,
        wallet_address: '0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045',
        status: 'Paid',
        created_at: new Date(Date.now() - 7200000).toISOString()
      }
    ];
    console.warn("⚠️ Supabase credentials missing. Using offline memory-based mock database fallback.");
  }

  from(table: string) {
    if (table !== 'invoices') {
      throw new Error(`Unsupported table ${table} in mock client`);
    }

    return {
      select: () => ({
        order: (col: string, { ascending = false } = {}) => {
          const sorted = [...this.invoices].sort((a, b) => {
            const timeA = new Date(a[col]).getTime();
            const timeB = new Date(b[col]).getTime();
            return ascending ? timeA - timeB : timeB - timeA;
          });
          return Promise.resolve({ data: sorted, error: null });
        },
        eq: (col: string, val: any) => {
          const item = this.invoices.find(inv => inv[col] === val);
          return Promise.resolve({ data: item ? [item] : [], error: null });
        }
      }),
      insert: (values: any[]) => {
        const newItems = values.map(val => ({
          id: val.id || `inv_${Math.random().toString(36).substr(2, 9)}`,
          client_name: val.client_name,
          amount_usdc: val.amount_usdc,
          wallet_address: val.wallet_address || '0x32A292b1236C8b387AF585E2e6b72018861B1B48',
          status: val.status || 'Pending',
          created_at: val.created_at || new Date().toISOString()
        }));
        this.invoices.unshift(...newItems);
        return Promise.resolve({ data: newItems, error: null });
      },
      update: (values: any) => {
        return {
          eq: (col: string, val: any) => {
            const updated: any[] = [];
            this.invoices = this.invoices.map(inv => {
              if (inv[col] === val) {
                const item = { ...inv, ...values };
                updated.push(item);
                return item;
              }
              return inv;
            });
            return Promise.resolve({ data: updated, error: null });
          }
        };
      }
    };
  }
}

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : (new MockSupabaseClient() as any);

