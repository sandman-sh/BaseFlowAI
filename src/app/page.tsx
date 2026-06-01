import Link from "next/link";
import { ArrowRight, Bot, Coins, ShieldCheck, Zap, ChevronRight } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col selection:bg-brand-blue selection:text-white">
      {/* Header/Navbar */}
      <header className="sticky top-0 z-50 bg-white border-b-4 border-black px-4 lg:px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-brand-blue text-white p-2 border-2 border-black shadow-[2px_2px_0px_#000] font-black text-xl uppercase tracking-tighter select-none transition-transform group-hover:scale-110 group-hover:-rotate-6 duration-200">
              BF
            </div>
            <span className="font-black text-2xl tracking-tight uppercase">
              Base<span className="text-brand-blue transition-colors duration-200 group-hover:text-black">Flow</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 font-extrabold text-sm uppercase">
            <a href="#features" className="hover:text-brand-blue transition-all duration-150 hover:-translate-y-0.5">Features</a>
            <a href="#workflow" className="hover:text-brand-blue transition-all duration-150 hover:-translate-y-0.5">Workflow</a>
            <a href="#preview" className="hover:text-brand-blue transition-all duration-150 hover:-translate-y-0.5">Live Preview</a>
          </nav>

          <div>
            <Link href="/app" className="neo-btn hover-rotate-clockwise transition-all duration-200">
              Launch App
              <ArrowRight className="w-5 h-5 transition-transform duration-200 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 px-4 lg:px-8 bg-brutalGray overflow-hidden">
        {/* Background Grid Pattern is defined globally in globals.css */}
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Text Column */}
          <div className="lg:col-span-7 flex flex-col items-start gap-6">
            <div className="badge-rainbow text-white border-2 border-black font-extrabold text-xs lg:text-sm px-3 py-1.5 uppercase tracking-wider shadow-[3px_3px_0px_#000] animate-pulse-subtle">
              ⚡ Zero-Friction B2B Financial Ops
            </div>

            <h1 className="text-5xl lg:text-7xl font-black leading-none uppercase text-black tracking-tight animate-pulse-subtle">
              Run Your Freelance Business <span className="text-white bg-black px-3 py-1 inline-block -rotate-1 hover:rotate-1 hover:scale-105 transition-all duration-300 cursor-default shadow-[4px_4px_0px_#0052FF]">On Base</span>
            </h1>

            <p className="text-lg lg:text-xl font-medium text-gray-800 max-w-xl leading-relaxed">
              Generate instant invoices, craft secure Base network USDC payment links, and reconcile payments automatically using our AI-driven financial agent.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link href="/app" className="neo-btn text-lg py-4 px-8 hover-rotate-clockwise transition-transform duration-200">
                Launch Agent
                <Bot className="w-6 h-6 animate-pulse" />
              </Link>
              <a href="#features" className="neo-btn neo-btn-secondary text-lg py-4 px-8 hover-rotate-counter transition-transform duration-200">
                Learn More
                <ChevronRight className="w-6 h-6" />
              </a>
            </div>

            {/* Quick stats badges */}
            <div className="flex flex-wrap gap-4 mt-8 pt-8 border-t-2 border-dashed border-gray-400 w-full">
              <div className="flex items-center gap-2 hover:scale-105 transition-transform">
                <span className="font-black text-2xl text-brand-blue">0%</span>
                <span className="text-xs uppercase font-extrabold text-gray-600">Slippage & Hassle</span>
              </div>
              <div className="h-8 w-0.5 bg-gray-400 hidden sm:block"></div>
              <div className="flex items-center gap-2 hover:scale-105 transition-transform">
                <span className="font-black text-2xl text-brand-blue">100%</span>
                <span className="text-xs uppercase font-extrabold text-gray-600">USDC On Base</span>
              </div>
              <div className="h-8 w-0.5 bg-gray-400 hidden sm:block"></div>
              <div className="flex items-center gap-2 hover:scale-105 transition-transform">
                <span className="font-black text-2xl text-brand-blue">AI</span>
                <span className="text-xs uppercase font-extrabold text-gray-600">Automated Billing</span>
              </div>
            </div>
          </div>

          {/* Right Hero Card Column */}
          <div className="lg:col-span-5 relative animate-float">
            <div className="absolute inset-0 bg-brand-blue translate-x-4 translate-y-4 border-4 border-black animate-border-draw"></div>
            <div className="relative neo-card p-6 lg:p-8 bg-white flex flex-col gap-6">
              <div className="flex items-center justify-between border-b-4 border-black pb-4">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-500 border border-black animate-pulse"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500 border border-black animate-pulse delay-1"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500 border border-black animate-pulse delay-2"></div>
                </div>
                <span className="text-xs font-mono font-bold bg-black text-white px-2 py-0.5 animate-pulse-subtle">agent-console v1.0.4</span>
              </div>

              {/* Chat simulation */}
              <div className="flex flex-col gap-4 text-sm font-semibold">
                <div className="bg-gray-100 border-2 border-black p-3 self-end max-w-[85%] rounded-none shadow-[2px_2px_0px_#000] hover:scale-[1.02] transition-transform">
                  <p className="text-xs uppercase font-bold text-gray-500 mb-1">Freelancer</p>
                  <p className="font-mono">Create an invoice for 500 USDC for client Acme Corp<span className="animate-blink text-brand-blue font-black">_</span></p>
                </div>

                <div className="bg-brand-blueLight border-2 border-black p-3 self-start max-w-[85%] rounded-none shadow-[2px_2px_0px_#000] text-black hover:scale-[1.02] transition-transform">
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="w-2.5 h-2.5 rounded-full bg-brand-blue animate-ping"></span>
                    <p className="text-xs uppercase font-bold text-brand-blue">BaseFlow Agent (Active)</p>
                  </div>
                  <p className="mb-2">Parsed details! {"I've created invoice"} <span className="underline font-mono font-bold">#BF-742</span> in the database and formulated a Base USDC payment payload.</p>
                  
                  {/* Embedded invoice preview widget */}
                  <div className="bg-white border-2 border-black p-3 mt-2 flex flex-col gap-2 shadow-[2px_2px_0px_#000] hover:shadow-[4px_4px_0px_#000] transition-all hover:-translate-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-extrabold uppercase text-xs text-brand-blue">USDC ON BASE</span>
                      <span className="bg-brutalYellow text-xs font-bold px-1.5 py-0.5 border border-black uppercase animate-bounce-subtle">Pending</span>
                    </div>
                    <div>
                      <p className="text-xs text-gray-500 uppercase">Client</p>
                      <p className="font-black text-base text-black">Acme Corp</p>
                    </div>
                    <div className="flex justify-between items-end border-t border-gray-200 pt-2">
                      <div>
                        <p className="text-xs text-gray-500 uppercase">Amount</p>
                        <p className="font-black text-lg text-black">500.00 USDC</p>
                      </div>
                      <div className="bg-black text-white text-xs px-2 py-1 font-mono uppercase animate-pulse">
                        Pay Link Generated
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Infinite Scrolling Ticker / Marquee Section */}
      <div className="bg-black text-white border-y-4 border-black py-4 overflow-hidden select-none relative z-10">
        <div className="flex whitespace-nowrap animate-marquee">
          <div className="flex gap-12 font-black uppercase text-lg md:text-xl tracking-widest">
            <span>⚡ Powered by Base network</span>
            <span className="text-brutalYellow">★</span>
            <span>100% USDC stablecoin standard</span>
            <span className="text-[#00E676]">★</span>
            <span>Real-time AI Financial agent</span>
            <span className="text-brand-blue">★</span>
            <span>zero-friction invoice settlement</span>
            <span className="text-brutalYellow">★</span>
            <span>EIP-681 standard payload</span>
            <span className="text-[#00E676]">★</span>
            
            {/* Duplicate for infinite loop scroll */}
            <span>⚡ Powered by Base network</span>
            <span className="text-brutalYellow">★</span>
            <span>100% USDC stablecoin standard</span>
            <span className="text-[#00E676]">★</span>
            <span>Real-time AI Financial agent</span>
            <span className="text-brand-blue">★</span>
            <span>zero-friction invoice settlement</span>
            <span className="text-brutalYellow">★</span>
            <span>EIP-681 standard payload</span>
            <span className="text-[#00E676]">★</span>
          </div>
        </div>
      </div>

      {/* Value Pillars Section */}
      <section id="features" className="py-20 lg:py-28 px-4 lg:px-8 bg-white border-t-4 border-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center gap-4">
            <span className="bg-brutalYellow border-2 border-black font-extrabold text-xs uppercase px-3 py-1 shadow-[2px_2px_0px_#000] animate-pulse-subtle">
              Uncompromising Features
            </span>
            <h2 className="text-4xl lg:text-5xl font-black uppercase text-black">
              Zero Clutter. All Performance.
            </h2>
            <p className="font-medium text-gray-700">
              Traditional billing is broken for Web3 freelancers. We built BaseFlow to bypass the manual setup and bring native intelligence to blockchain invoicing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Pillar 1 */}
            <div className="neo-card p-8 bg-white flex flex-col gap-4 neo-card-hover group hover-rotate-counter transition-all duration-300">
              <div className="bg-brand-blue text-white p-3 border-2 border-black shadow-[3px_3px_0px_#000] w-fit transition-transform group-hover:rotate-12 duration-300">
                <Bot className="w-8 h-8 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-2xl font-black uppercase group-hover:text-brand-blue transition-colors">AI Agentic Engine</h3>
              <p className="text-gray-700 font-medium leading-relaxed">
                Just prompt in plain text. The AI handles the parsing, updates Supabase in real-time, and generates precise Base transaction schemas.
              </p>
            </div>

            {/* Pillar 2 */}
            <div className="neo-card p-8 bg-white flex flex-col gap-4 neo-card-hover group hover-rotate-clockwise transition-all duration-300">
              <div className="bg-brutalYellow text-black p-3 border-2 border-black shadow-[3px_3px_0px_#000] w-fit transition-transform group-hover:-rotate-12 duration-300">
                <Coins className="w-8 h-8 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-2xl font-black uppercase group-hover:text-brand-blue transition-colors">Native Base Wallet</h3>
              <p className="text-gray-700 font-medium leading-relaxed">
                Leverages the Base MCP standard for smart account interaction, creating standardized payment payloads to safely request and settle USDC.
              </p>
            </div>

            {/* Pillar 3 */}
            <div className="neo-card p-8 bg-white flex flex-col gap-4 neo-card-hover group hover-rotate-counter transition-all duration-300">
              <div className="bg-[#00E676] text-black p-3 border-2 border-black shadow-[3px_3px_0px_#000] w-fit transition-transform group-hover:rotate-12 duration-300">
                <ShieldCheck className="w-8 h-8 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-2xl font-black uppercase group-hover:text-brand-blue transition-colors">Automated Reconciliation</h3>
              <p className="text-gray-700 font-medium leading-relaxed">
                Simulate chain state checks or receive mock payment webhook hits to instantly flip invoice statuses from Pending to Paid.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section id="workflow" className="py-20 lg:py-28 px-4 lg:px-8 bg-brutalGray border-t-4 border-black">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 flex flex-col items-center gap-4">
            <span className="bg-brand-blue text-white border-2 border-black font-extrabold text-xs uppercase px-3 py-1 shadow-[2px_2px_0px_#000] animate-pulse-subtle">
              The Lifecycle
            </span>
            <h2 className="text-4xl lg:text-5xl font-black uppercase text-black">
              How BaseFlow Streamlines You
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
            {/* Step 1 */}
            <div className="neo-card p-6 bg-white flex flex-col gap-4 hover-rotate-counter transition-all duration-300 group cursor-default">
              <div className="bg-black text-white w-10 h-10 flex items-center justify-center font-black text-xl border-2 border-black shadow-[2px_2px_0px_#0052FF] transition-transform group-hover:scale-110">
                1
              </div>
              <h4 className="text-xl font-bold uppercase mt-2 group-hover:text-brand-blue transition-colors">Natural Prompt</h4>
              <p className="text-sm font-medium text-gray-700">
                 Freelancer inputs a plain-text billing request: <span className="font-mono bg-brutalGray p-2 border-2 border-black text-xs block mt-2 font-bold leading-normal">{'"Create invoice of 300 USDC for Acme"'}</span>
              </p>
            </div>

            {/* Step 2 */}
            <div className="neo-card p-6 bg-white flex flex-col gap-4 hover-rotate-clockwise transition-all duration-300 group cursor-default">
              <div className="bg-black text-white w-10 h-10 flex items-center justify-center font-black text-xl border-2 border-black shadow-[2px_2px_0px_#0052FF] transition-transform group-hover:scale-110">
                2
              </div>
              <h4 className="text-xl font-bold uppercase mt-2 group-hover:text-brand-blue transition-colors">Supabase Sync</h4>
              <p className="text-sm font-medium text-gray-700 leading-relaxed">
                The agent parses inputs automatically and registers a custom row in your secure ledger with a <span className="underline font-bold">Pending</span> state.
              </p>
            </div>

            {/* Step 3 */}
            <div className="neo-card p-6 bg-white flex flex-col gap-4 hover-rotate-counter transition-all duration-300 group cursor-default">
              <div className="bg-black text-white w-10 h-10 flex items-center justify-center font-black text-xl border-2 border-black shadow-[2px_2px_0px_#0052FF] transition-transform group-hover:scale-110">
                3
              </div>
              <h4 className="text-xl font-bold uppercase mt-2 group-hover:text-brand-blue transition-colors">Payload Build</h4>
              <p className="text-sm font-medium text-gray-700 leading-relaxed">
                Baseflow AI constructs EIP-681 payload URLs and renders clean payment widgets with QR codes instantly for client routing.
              </p>
            </div>

            {/* Step 4 */}
            <div className="neo-card p-6 bg-white flex flex-col gap-4 hover-rotate-clockwise transition-all duration-300 group cursor-default">
              <div className="bg-black text-white w-10 h-10 flex items-center justify-center font-black text-xl border-2 border-black shadow-[2px_2px_0px_#0052FF] transition-transform group-hover:scale-110">
                4
              </div>
              <h4 className="text-xl font-bold uppercase mt-2 group-hover:text-brand-blue transition-colors">Auto-Reconcile</h4>
              <p className="text-sm font-medium text-gray-700 leading-relaxed">
                A simple trigger verifies the payment transaction on Base network RPCs, automatically updating the status to <span className="text-[#00E676] font-black uppercase">Paid</span>.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action Banner */}
      <section className="py-16 lg:py-24 px-4 lg:px-8 bg-brand-blue text-white border-t-4 border-black relative overflow-hidden">
        {/* Decorative rotating grid lines in bg */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#002EB8_1px,transparent_1px),linear-gradient(to_bottom,#002EB8_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30"></div>
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center gap-6 relative z-10 animate-pulse-subtle">
          <h2 className="text-4xl lg:text-6xl font-black uppercase tracking-tight leading-none">
            Stop Chasing Payments.<br /><span className="text-brutalYellow">Activate BaseFlow.</span>
          </h2>
          <p className="text-lg lg:text-xl font-medium text-brand-blueLight max-w-xl">
            Get your zero-friction, production-grade Web3 B2B financial dashboard running on Base mainnet in seconds.
          </p>
          <div className="pt-4">
            <Link href="/app" className="neo-btn neo-btn-secondary text-lg py-4 px-8 shadow-[4px_4px_0px_#000] hover:shadow-[7px_7px_0px_#000] hover-rotate-clockwise transition-all duration-200 group">
              Get Started Now
              <Zap className="w-6 h-6 fill-current text-brutalYellow transition-transform group-hover:scale-125 duration-200 group-hover:rotate-12" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-12 px-4 lg:px-8 border-t-4 border-black mt-auto">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="bg-white text-black p-2 border-2 border-black font-black text-xl uppercase tracking-tighter select-none">
              BF
            </div>
            <span className="font-black text-2xl tracking-tight uppercase">
              Base<span className="text-brand-blue">Flow</span>
            </span>
          </div>

          <p className="text-sm text-gray-400 font-mono">
            &copy; 2026 BaseFlow. Built for the Base Agentic Hackathon. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
