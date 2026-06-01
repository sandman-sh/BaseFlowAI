"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @next/next/no-img-element */

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useChat } from "@ai-sdk/react";
import { 
  ArrowLeft, 
  Bot, 
  User, 
  Coins, 
  CheckCircle2, 
  Clock, 
  ExternalLink, 
  Copy, 
  Check, 
  RefreshCw, 
  FileSpreadsheet, 
  Search 
} from "lucide-react";
import { supabase } from "@/lib/supabase";

interface Invoice {
  id: string;
  client_name: string;
  amount_usdc: number;
  wallet_address: string;
  status: 'Pending' | 'Paid';
  created_at: string;
}

export default function AppDashboard() {
  // DB Ledger State
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loadingLedger, setLoadingLedger] = useState(true);
  const [filterStatus, setFilterStatus] = useState<'All' | 'Pending' | 'Paid'>('All');
  const [searchQuery, setSearchQuery] = useState("");
  
  // UI States
  const [input, setInput] = useState("");
  const [verifyingInvoiceId, setVerifyingInvoiceId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [verifiedTxHash, setVerifiedTxHash] = useState<{ [key: string]: string }>({});

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Vercel AI SDK useChat Hook
  const { messages, sendMessage, status, setMessages } = useChat({
    onFinish: () => {
      // Refresh the ledger after AI agent generates the invoice
      fetchInvoices();
    }
  });

  const chatLoading = status === "submitted" || status === "streaming";

  // Fetch invoices from Supabase
  const fetchInvoices = async () => {
    try {
      setLoadingLedger(true);
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error("Error fetching ledger:", error);
      } else {
        setInvoices(data || []);
      }
    } catch (err) {
      console.error("Ledger fetch exception:", err);
    } finally {
      setLoadingLedger(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  // Scroll to chat end when new messages arrive
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle Clipboard Copy
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Simulate Payment Verification
  const verifyPayment = async (invoiceId: string) => {
    try {
      setVerifyingInvoiceId(invoiceId);
      
      const res = await fetch("/api/verify-payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ invoiceId })
      });

      const data = await res.json();
      
      if (data.success) {
        setVerifiedTxHash(prev => ({ ...prev, [invoiceId]: data.txHash }));
        // Refresh local ledger
        fetchInvoices();
        
        // Also pro-actively update any corresponding status in chat log messages to keep visual consistency
        setMessages(prevMessages => 
          prevMessages.map(msg => {
            if (msg.parts) {
              return {
                ...msg,
                parts: msg.parts.map((part: any) => {
                  if (part.type === 'tool-createInvoiceAndPaymentPayload' && part.output?.invoiceId === invoiceId) {
                    return {
                      ...part,
                      output: {
                        ...part.output,
                        status: 'Paid'
                      }
                    };
                  }
                  return part;
                })
              };
            }
            return msg;
          })
        );
      } else {
        alert(data.error || "Verification failed");
      }
    } catch (err) {
      console.error("Verification error:", err);
      alert("Error contacting the payment verification API.");
    } finally {
      setVerifyingInvoiceId(null);
    }
  };

  // Calculation Metrics
  const totalInvoiced = invoices.reduce((sum, inv) => sum + Number(inv.amount_usdc), 0);
  const pendingInvoiced = invoices.filter(inv => inv.status === 'Pending').reduce((sum, inv) => sum + Number(inv.amount_usdc), 0);
  const paidInvoiced = invoices.filter(inv => inv.status === 'Paid').reduce((sum, inv) => sum + Number(inv.amount_usdc), 0);

  // Filter & Search Invoices
  const filteredInvoices = invoices.filter(inv => {
    const matchesFilter = filterStatus === 'All' || inv.status === filterStatus;
    const matchesSearch = inv.client_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          inv.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Custom form submission handler for Vercel AI SDK v5/v6 input pattern
  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || chatLoading) return;
    sendMessage({ text: input });
    setInput("");
  };

  // Prefill helper triggers for LLM chat
  const handleQuickPrompt = (promptText: string) => {
    sendMessage({ text: promptText });
  };

  return (
    <div className="min-h-screen flex flex-col bg-brutalGray selection:bg-brand-blue selection:text-white pb-12 font-sans">
      
      {/* Header Bar */}
      <header className="sticky top-0 z-50 bg-white border-b-4 border-black px-4 lg:px-8 py-3.5 shadow-brutalSm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Link href="/" className="neo-btn neo-btn-secondary p-1.5 border-2 shadow-[2px_2px_0px_#000] hover:translate-x-0 hover:translate-y-0 hover:shadow-none">
              <ArrowLeft className="w-4 h-4" />
            </Link>
            <span className="font-black text-xl uppercase tracking-tighter">
              BASE<span className="text-brand-blue">FLOW</span> CORE
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            {/* Blinking Live status */}
            <div className="flex items-center gap-2 bg-black text-white px-3 py-1 text-xs font-bold border-2 border-black font-mono">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00E676] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00E676]"></span>
              </span>
              BASE RPC: OPERATIONAL
            </div>
            
            <button 
              onClick={fetchInvoices} 
              className="neo-btn neo-btn-secondary p-2 border-2 shadow-[2px_2px_0px_#000] text-xs hover:translate-x-0 hover:translate-y-0"
              title="Refresh ledger"
            >
              <RefreshCw className={`w-4 h-4 ${loadingLedger ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>
      </header>

      {/* Main Operations Grid */}
      <main className="max-w-7xl mx-auto w-full px-4 lg:px-8 mt-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: AI Agent Operations (7 Cols) */}
        <section className="lg:col-span-7 flex flex-col gap-6">
          <div className="neo-card bg-white p-6 relative overflow-hidden flex flex-col min-h-[580px] max-h-[750px] shadow-brutal">
            
            {/* Console Header */}
            <div className="flex items-center justify-between border-b-4 border-black pb-4 mb-4">
              <div className="flex items-center gap-2.5">
                <div className="bg-brand-blue text-white p-1.5 border-2 border-black shadow-[2px_2px_0px_#000]">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h2 className="text-lg font-black uppercase leading-none">AI Agent Console</h2>
                  <span className="text-xs font-mono font-bold text-gray-500">Autonomous Financial Coprocessor</span>
                </div>
              </div>
              
              {/* Agent Status Badge */}
              <div className="bg-brand-blueLight text-brand-blue text-xs font-bold px-2 py-1 border-2 border-black uppercase flex items-center gap-1.5 shadow-[2px_2px_0px_#000]">
                <span className="h-2 w-2 rounded-full bg-brand-blue animate-pulse"></span>
                Online
              </div>
            </div>

            {/* Chat Messages Panel */}
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 mb-4 min-h-[300px] max-h-[500px] no-scrollbar">
              {messages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-8 bg-brutalGray border-2 border-dashed border-gray-400">
                  <Bot className="w-12 h-12 text-brand-blue mb-3 stroke-[2]" />
                  <h3 className="font-black text-lg uppercase mb-1">Coprocessor Awaiting Prompts</h3>
                  <p className="text-sm font-medium text-gray-600 max-w-sm mb-6">
                    Prompt me to automatically generate USDC invoices, sync rows in Supabase, and build Base wallet payloads!
                  </p>
                  
                  {/* Prompt Suggestions */}
                  <div className="flex flex-col gap-2.5 w-full max-w-md">
                    <button 
                      onClick={() => handleQuickPrompt("Create an invoice of 500 USDC for Acme Corp")}
                      className="neo-btn neo-btn-secondary text-xs p-2.5 text-left border-2 shadow-[2px_2px_0px_#000] hover:translate-x-0 hover:translate-y-0"
                    >
                      🚀 {"\"Create an invoice of 500 USDC for Acme Corp\""}
                    </button>
                    <button 
                      onClick={() => handleQuickPrompt("Bill Stark Enterprises 1250 USDC for smart contract audit")}
                      className="neo-btn neo-btn-secondary text-xs p-2.5 text-left border-2 shadow-[2px_2px_0px_#000] hover:translate-x-0 hover:translate-y-0"
                    >
                      🧪 {"\"Bill Stark Enterprises 1250 USDC for contract audit\""}
                    </button>
                  </div>
                </div>
              ) : (
                messages.map((message) => (
                  <div key={message.id} className="flex flex-col gap-2">
                    
                    {/* Standard Message Bubble */}
                    <div className={`flex gap-3 max-w-[85%] ${message.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'}`}>
                      <div className={`p-1.5 border-2 border-black shadow-[2px_2px_0px_#000] h-fit ${message.role === 'user' ? 'bg-black text-white' : 'bg-brand-blue text-white'}`}>
                        {message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </div>

                      <div className={`p-4 border-2 border-black shadow-[3px_3px_0px_#000] font-semibold text-sm ${message.role === 'user' ? 'bg-white text-black' : 'bg-brand-blueLight text-black'}`}>
                        <p className="whitespace-pre-wrap">
                          {message.parts
                            ?.filter((part: any) => part.type === "text")
                            ?.map((part: any) => part.text)
                            ?.join("") || ""}
                        </p>
                      </div>
                    </div>

                    {/* Render tool invocations inside the chat log! */}
                    {message.parts?.map((part: any) => {
                      if (part.type === 'tool-createInvoiceAndPaymentPayload') {
                        const result = part.output;
                        const toolCallId = part.toolCallId;
                        
                        if (result && result.success) {
                          const isPending = result.status === 'Pending';
                          const txHash = verifiedTxHash[result.invoiceId];

                          return (
                          <div key={toolCallId} className="ml-10 self-start max-w-[85%] relative">
                            {/* Accent backdrop for tool widget */}
                            <div className="absolute inset-0 bg-black translate-x-2 translate-y-2"></div>
                            
                            <div className="relative bg-white border-4 border-black p-5 flex flex-col gap-4">
                              {/* Card Header */}
                              <div className="flex items-center justify-between border-b-2 border-black pb-2.5">
                                <div className="flex items-center gap-1.5">
                                  <Coins className="w-5 h-5 text-brand-blue stroke-[2.5]" />
                                  <span className="font-black text-sm uppercase text-black">USDC PAYMENT REQUEST</span>
                                </div>
                                <span className={`text-xs font-black uppercase px-2 py-0.5 border-2 border-black shadow-[2px_2px_0px_#000] ${
                                  !isPending ? 'bg-[#00E676] text-black' : 'bg-brutalYellow text-black'
                                }`}>
                                  {result.status}
                                </span>
                              </div>

                              {/* Details Rows */}
                              <div className="grid grid-cols-2 gap-4 text-xs font-semibold">
                                <div>
                                  <span className="text-gray-500 uppercase block mb-0.5">Invoice ID</span>
                                  <span className="font-mono text-black break-all">{result.invoiceId}</span>
                                </div>
                                <div>
                                  <span className="text-gray-500 uppercase block mb-0.5">Amount</span>
                                  <span className="font-black text-base text-black">{Number(result.amountUsdc).toFixed(2)} USDC</span>
                                </div>
                                <div className="col-span-2">
                                  <span className="text-gray-500 uppercase block mb-0.5">Client</span>
                                  <span className="font-bold text-black text-sm uppercase">{result.clientName}</span>
                                </div>
                                <div className="col-span-2">
                                  <span className="text-gray-500 uppercase block mb-0.5">Recipient Wallet</span>
                                  <span className="font-mono text-black text-2xs break-all bg-gray-100 p-1 border border-black block">{result.walletAddress}</span>
                                </div>
                              </div>

                              {/* QR Code and Actions */}
                              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-brutalGray p-3 border-2 border-black">
                                <div className="flex flex-col items-center sm:items-start gap-1">
                                  <span className="text-[10px] uppercase font-bold text-gray-500">Scan payload</span>
                                  {/* Using QR Server API to generate a fully live QR code from EIP-681 URI */}
                                  <img 
                                    src={`https://api.qrserver.com/v1/create-qr-code/?size=110x110&data=${encodeURIComponent(result.eip681Uri)}`} 
                                    alt="Payment QR Code"
                                    className="w-28 h-28 border-2 border-black bg-white p-1"
                                  />
                                </div>

                                <div className="flex-1 flex flex-col gap-2 w-full">
                                  <a 
                                    href={result.payLink} 
                                    target="_blank" 
                                    rel="noopener noreferrer" 
                                    className="neo-btn neo-btn-secondary text-[11px] py-2 px-3 border-2 shadow-[2px_2px_0px_#000] w-full justify-center"
                                  >
                                    Coinbase Pay
                                    <ExternalLink className="w-3.5 h-3.5" />
                                  </a>
                                  
                                  <button 
                                    onClick={() => copyToClipboard(result.eip681Uri, toolCallId)}
                                    className="neo-btn neo-btn-secondary text-[11px] py-2 px-3 border-2 shadow-[2px_2px_0px_#000] w-full justify-center"
                                  >
                                    {copiedId === toolCallId ? 'Copied URI' : 'Copy Pay URI'}
                                    {copiedId === toolCallId ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                              </div>

                              {/* Webhook Simulated Clear Action */}
                              {isPending ? (
                                <button
                                  onClick={() => verifyPayment(result.invoiceId)}
                                  disabled={verifyingInvoiceId === result.invoiceId}
                                  className="neo-btn neo-btn-warning text-xs py-2.5 border-2 w-full justify-center shadow-[2px_2px_0px_#000]"
                                >
                                  {verifyingInvoiceId === result.invoiceId ? (
                                    <>
                                      <RefreshCw className="w-4 h-4 animate-spin" />
                                      Verifying Onchain...
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2 className="w-4 h-4" />
                                      Simulate Base Verification (Hook)
                                    </>
                                  )}
                                </button>
                              ) : (
                                <div className="bg-[#E5FDF4] text-[#008A52] p-2.5 border-2 border-[#00E676] text-xs font-bold text-center flex flex-col gap-1 items-center justify-center font-mono">
                                  <span className="flex items-center gap-1.5 uppercase font-bold text-[11px]">
                                    <CheckCircle2 className="w-4 h-4" /> cleared on base network
                                  </span>
                                  {txHash && (
                                    <span className="text-[10px] break-all font-mono opacity-80">
                                      Tx: {txHash.substring(0, 16)}...
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                          </div>
                        );
                      }
                    }
                    return null;
                  })}
                  </div>
                ))
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Input Submission Panel */}
            <form onSubmit={handleFormSubmit} className="mt-auto border-t-4 border-black pt-4">
              <div className="flex gap-3">
                <input 
                  type="text" 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  disabled={chatLoading}
                  placeholder="e.g. Create an invoice for 450 USDC for Acme"
                  className="neo-input flex-1 font-semibold placeholder:text-gray-400"
                />
                <button 
                  type="submit" 
                  disabled={chatLoading || !input.trim()}
                  className="neo-btn"
                >
                  Send
                </button>
              </div>
            </form>
          </div>
        </section>

        {/* Right Column: Database Ledger & Analytics (5 Cols) */}
        <section className="lg:col-span-5 flex flex-col gap-6">
          
          {/* Analytics Summary Panels */}
          <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 gap-4">
            
            {/* Total Invoiced */}
            <div className="neo-card bg-white p-4 relative shadow-brutalSm">
              <span className="text-gray-500 text-2xs uppercase font-extrabold block mb-0.5">Total Invoiced</span>
              <span className="text-2xl font-black text-black font-mono">
                {totalInvoiced.toFixed(2)} <span className="text-xs font-bold text-gray-500">USDC</span>
              </span>
              <div className="absolute right-4 top-4 bg-brand-blueLight p-1 border border-black shadow-[1px_1px_0px_#000]">
                <FileSpreadsheet className="w-4 h-4 text-brand-blue" />
              </div>
            </div>

            {/* Pending Invoiced */}
            <div className="neo-card bg-white p-4 relative shadow-brutalSm">
              <span className="text-gray-500 text-2xs uppercase font-extrabold block mb-0.5">Pending Settlement</span>
              <span className="text-2xl font-black text-brand-blue font-mono">
                {pendingInvoiced.toFixed(2)} <span className="text-xs font-bold text-gray-500">USDC</span>
              </span>
              <div className="absolute right-4 top-4 bg-brutalYellow p-1 border border-black shadow-[1px_1px_0px_#000]">
                <Clock className="w-4 h-4 text-black" />
              </div>
            </div>

            {/* Paid Invoiced */}
            <div className="neo-card bg-white p-4 relative shadow-brutalSm">
              <span className="text-gray-500 text-2xs uppercase font-extrabold block mb-0.5">Cleared Payments</span>
              <span className="text-2xl font-black text-[#00E676] font-mono">
                {paidInvoiced.toFixed(2)} <span className="text-xs font-bold text-gray-500">USDC</span>
              </span>
              <div className="absolute right-4 top-4 bg-[#E5FDF4] p-1 border border-[#00E676] shadow-[1px_1px_0px_#000]">
                <CheckCircle2 className="w-4 h-4 text-[#008A52]" />
              </div>
            </div>
          </div>

          {/* Database Ledger Table */}
          <div className="neo-card bg-white p-6 shadow-brutal flex flex-col min-h-[460px]">
            <div className="flex flex-col gap-4 border-b-4 border-black pb-4 mb-4">
              <h2 className="text-lg font-black uppercase leading-none">Supabase Ledger</h2>
              
              {/* Filters */}
              <div className="flex flex-wrap gap-2.5 font-bold text-xs uppercase">
                <button 
                  onClick={() => setFilterStatus('All')}
                  className={`border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_#000] active:shadow-none hover:-translate-y-0.5 transition-all ${
                    filterStatus === 'All' ? 'bg-black text-white' : 'bg-white text-black'
                  }`}
                >
                  All
                </button>
                <button 
                  onClick={() => setFilterStatus('Pending')}
                  className={`border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_#000] active:shadow-none hover:-translate-y-0.5 transition-all ${
                    filterStatus === 'Pending' ? 'bg-brutalYellow text-black' : 'bg-white text-black'
                  }`}
                >
                  Pending
                </button>
                <button 
                  onClick={() => setFilterStatus('Paid')}
                  className={`border-2 border-black px-2.5 py-1 shadow-[2px_2px_0px_#000] active:shadow-none hover:-translate-y-0.5 transition-all ${
                    filterStatus === 'Paid' ? 'bg-[#00E676] text-black' : 'bg-white text-black'
                  }`}
                >
                  Paid
                </button>
              </div>

              {/* Search bar */}
              <div className="relative">
                <input 
                  type="text"
                  placeholder="Search client or invoice ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="neo-input w-full text-xs py-2 px-3 pl-8 shadow-brutalSm border-2"
                />
                <Search className="w-4 h-4 text-gray-500 absolute left-2.5 top-2.5" />
              </div>
            </div>

            {/* Ledger List */}
            <div className="flex-1 overflow-y-auto space-y-3 pr-1 max-h-[300px] no-scrollbar">
              {loadingLedger ? (
                <div className="flex items-center justify-center p-8 text-xs font-bold text-gray-500 gap-2">
                  <RefreshCw className="w-4 h-4 animate-spin text-brand-blue" />
                  FETCHING SUPABASE ROWS...
                </div>
              ) : filteredInvoices.length === 0 ? (
                <div className="text-center p-8 border-2 border-dashed border-gray-400 bg-brutalGray text-xs font-bold text-gray-500 uppercase">
                  No invoices registered
                </div>
              ) : (
                filteredInvoices.map((inv) => {
                  const isPending = inv.status === 'Pending';
                  return (
                    <div 
                      key={inv.id} 
                      className={`border-2 border-black p-3.5 shadow-brutalSm flex flex-col gap-2 relative transition-all ${
                        isPending ? 'bg-white' : 'bg-[#E5FDF4]'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-[10px] uppercase font-bold text-gray-500">Client</p>
                          <p className="font-extrabold text-sm text-black uppercase">{inv.client_name}</p>
                        </div>
                        <span className={`text-[10px] font-black uppercase px-2 py-0.5 border border-black shadow-[1.5px_1.5px_0px_#000] ${
                          isPending ? 'bg-brutalYellow text-black' : 'bg-[#00E676] text-black'
                        }`}>
                          {inv.status}
                        </span>
                      </div>

                      <div className="flex justify-between items-end border-t border-dashed border-gray-300 pt-2 text-xs font-semibold">
                        <div>
                          <p className="text-[9px] uppercase font-bold text-gray-500">Amount</p>
                          <p className="font-black text-black text-sm font-mono">{Number(inv.amount_usdc).toFixed(2)} USDC</p>
                        </div>
                        
                        {isPending && (
                          <button
                            onClick={() => verifyPayment(inv.id)}
                            disabled={verifyingInvoiceId === inv.id}
                            className="neo-btn neo-btn-warning text-[10px] py-1 px-2 border-2 shadow-[1.5px_1.5px_0px_#000] hover:translate-x-0 hover:translate-y-0"
                          >
                            {verifyingInvoiceId === inv.id ? (
                              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                            ) : (
                              'Verify Hook'
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
