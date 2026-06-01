# ⚡ BaseFlow

> **Zero-Friction B2B Financial Operations & Billing Coprocessor for Web3 Freelancers on the Base Network**

BaseFlow is a premium, high-performance financial coprocessor designed specifically for Web3 freelancers and agency operators. It leverages state-of-the-art AI agentic workflows to parse natural language prompts, automatically sync invoice ledgers in a cloud-hosted Supabase PostgreSQL database, and instantly formulate standardized USDC payment payloads EIP-681 compliant for atomic on-chain execution on the Base Network.

---

## 🚀 Key Features

* **🤖 AI agentic Billing Engine:** Prompt in plain English (e.g., *"Create an invoice of 500 USDC for Acme Corp"*) to generate billing schemas, trigger ledger writes, and build transaction payloads.
* **💾 Supabase Live Ledger:** Complete, permanent record-keeping with real-time state synchronization, automated tracking, and full analytics.
* **🔵 Base Mainnet USDC Native:** Hardcoded for USDC on Base (`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`) utilizing Chain ID `8453`.
* **🔗 EIP-681 Compliant Payment Payloads:** Generates secure transaction request URIs scannable via any Web3 client.
* **💳 Coinbase Pay Integration:** Direct checkout URLs configured for zero-friction checkout with Coinbase Smart Account.
* **🔄 Simulated On-Chain Webhook Reconciliation:** Verify payments in real-time, fetching chain-state updates and transitioning invoice status from `Pending` to `Paid`.
* **🎨 High-Contrast Neo-Brutalist UI:** A breathtaking dashboard design loaded with premium micro-animations, infinite horizontal scrolling marquee tickers, and interactive cursor simulations.

---

## 🛠️ Technology Stack

* **Frontend Framework:** Next.js 14 (App Router, Tailwind CSS, Lucide icons)
* **AI Integration:** Vercel AI SDK Core & OpenRouter (Model: `meta-llama/llama-3.3-70b-instruct`)
* **Database Ledger:** Supabase (PostgreSQL Client with enabled RLS & selective Select/Insert/Update policies)
* **Blockchain Layer:** Base mainnet RPC with EIP-681 payload mapping and standard ERC-20 USDC interactions.

---

## 📂 Architecture & Directory Structure

```
├── plugins/
│   └── baseflow.md          # Official Base MCP Custom Plugin Specification
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── chat/        # Vercel AI SDK streamText & Tool mapping POST route
│   │   │   └── verify-payment # Payment verification & database reconciliation POST route
│   │   ├── app/             # Main Neo-brutalist Dashboard UI
│   │   ├── icon.svg         # Premium vector lightning bolt brand favicon
│   │   ├── globals.css      # Custom animations, float behaviors, marquee tickers & scrollbars
│   │   ├── layout.tsx       # Metadata registry and app entrypoint
│   │   └── page.tsx         # Responsive animated landing page
│   └── lib/
│       └── supabase.ts      # Supabase Client & mock memory-based fallback database
├── schema.sql               # Live PostgreSQL DDL database migrations
├── .env.example             # Version-controlled configuration template
└── .env.local               # Private local environment credentials (gitignored)
```

---

## ⚙️ Getting Started & Integration

### 1. Database Setup
Create an invoices table in your **Supabase PostgreSQL database** using the provided [`schema.sql`](file:///e:/project/base/schema.sql) file:
```sql
CREATE TABLE IF NOT EXISTS invoices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_name TEXT NOT NULL,
  amount_usdc NUMERIC NOT NULL CHECK (amount_usdc > 0),
  wallet_address TEXT NOT NULL,
  status TEXT DEFAULT 'Pending' CHECK (status IN ('Pending', 'Paid')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON invoices FOR SELECT USING (true);
CREATE POLICY "Allow public insert access" ON invoices FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access" ON invoices FOR UPDATE USING (true);
```

### 2. Configure Environment Credentials
Open your [`.env.local`](file:///e:/project/base/.env.local) file and configure the live keys:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://<your-supabase-project-id>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-public-key>

# OpenRouter API Key
OPENROUTER_API_KEY=sk-or-v1-...

# Default Freelancer Wallet Address (Base Network)
NEXT_PUBLIC_WALLET_ADDRESS=0x32A292b1236C8b387AF585E2e6b72018861B1B48
```

*Note: If credentials are left blank, the application automatically boots into offline demo mode, utilizing a stateful memory-based Mock database and a mock streaming LLM response stream.*

### 3. Run the Development Server
Install dependencies and launch the server in your local terminal:

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) on your web browser to interact with the responsive landing page, view your premium vector favicon, or navigate to [/app](http://localhost:3000/app) to launch your live coprocessor!
