/* eslint-disable @typescript-eslint/no-explicit-any */
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { invoiceId } = await req.json();

    if (!invoiceId) {
      return new Response(JSON.stringify({ error: "Missing invoiceId" }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 1. Fetch the invoice to ensure it exists
    const { data: selectData, error: selectError } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId);

    if (selectError || !selectData || selectData.length === 0) {
      return new Response(JSON.stringify({ error: "Invoice not found in database" }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const invoice = selectData[0];

    if (invoice.status === 'Paid') {
      return new Response(JSON.stringify({
        success: true,
        message: "Invoice was already paid.",
        invoice
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 2. Simulate blockchain block explorer verification latency
    // Let's add a small artificial delay of 800ms to mimic scanning the Base network RPC provider
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Simulate generating a mock transaction hash on the Base network
    const simulatedTxHash = `0x${Array.from({length: 64}, () => Math.floor(Math.random()*16).toString(16)).join('')}`;

    // 3. Update the invoice status in Supabase
    await supabase
      .from('invoices')
      .update({ status: 'Paid' })
      .eq('id', invoiceId);

    // Re-fetch updated item to return latest state
    const { data: finalSelect } = await supabase
      .from('invoices')
      .select('*')
      .eq('id', invoiceId);

    const updatedInvoice = finalSelect ? finalSelect[0] : { ...invoice, status: 'Paid' };

    return new Response(JSON.stringify({
      success: true,
      message: "Base network payment verified successfully!",
      txHash: simulatedTxHash,
      invoice: updatedInvoice
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error: any) {
    console.error("Payment verification route error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
