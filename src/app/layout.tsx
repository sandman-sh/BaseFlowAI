import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BaseFlow | Zero-Friction Financial Ops for Web3 Freelancers",
  description: "Generate instant invoices, formulate secure Base network USDC payment links, and track payment status in real-time with an intelligent AI coprocessor.",
  keywords: ["Base network", "Crypto invoice", "Web3 freelancer", "USDC payments", "AI agent", "Financial operations", "Supabase ledger"],
  authors: [{ name: "BaseFlow Team" }],
  viewport: "width=device-width, initial-scale=1",
  icons: {
    icon: "/icon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
