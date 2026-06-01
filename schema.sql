-- SQL Schema for Supabase PostgreSQL Database

-- Create invoices table
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  amount_usdc NUMERIC NOT NULL CHECK (amount_usdc > 0),
  wallet_address TEXT NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Paid')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS)
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

-- Create policy to allow all access for demo purposes (or public anon read/write)
CREATE POLICY "Allow public read access" ON invoices FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON invoices FOR UPDATE USING (true);
