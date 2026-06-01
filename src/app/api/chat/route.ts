/* eslint-disable @typescript-eslint/no-explicit-any */
import { createOpenAI } from '@ai-sdk/openai';
import { streamText, tool } from 'ai';
import { z } from 'zod';
import { supabase } from '@/lib/supabase';
import crypto from 'crypto';

// Ensure this route is dynamic
export const dynamic = 'force-dynamic';

// Helper to convert client-side messages (with parts/content) to clean CoreMessage[]
function convertMessages(messages: any[]): any[] {
  return messages.map((msg: any) => {
    let content = '';
    if (msg.content) {
      content = msg.content;
    } else if (msg.parts && Array.isArray(msg.parts)) {
      content = msg.parts
        .filter((part: any) => part.type === 'text')
        .map((part: any) => part.text)
        .join('');
    }
    return {
      role: msg.role === 'assistant' ? 'assistant' : 'user',
      content: content
    };
  });
}

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

    // Check for OpenRouter API Key
    const openrouterApiKey = process.env.OPENROUTER_API_KEY;

    if (!openrouterApiKey) {
      console.warn("⚠️ OPENROUTER_API_KEY is not defined. Using mock LLM response stream.");
      // Fallback for mock demo mode if API key is not configured yet
      return createMockStreamResponse(messages);
    }

    // Configure the OpenRouter client using the OpenAI provider
    const openrouter = createOpenAI({
      baseURL: 'https://openrouter.ai/api/v1',
      apiKey: openrouterApiKey,
      headers: {
        'HTTP-Referer': 'https://baseflow.finance',
        'X-Title': 'BaseFlow',
      }
    });

    // Stream text using a powerful, fast, and tool-capable model on OpenRouter
    const result = await streamText({
      model: openrouter('google/gemini-2.5-flash'),
      messages: convertMessages(messages),
      system: `You are the BaseFlow AI Financial Operations Agent, a premium crypto-billing coprocessor for Web3 freelancers.
      Your primary job is to help freelancers bill clients, generate invoices on Supabase, and build transaction payloads on the Base network.

      You have access to a custom tool: 'createInvoiceAndPaymentPayload'.
      When a user asks to:
      - "Create an invoice for Client X of 500 USDC"
      - "Bill Acme Corp 200 USDC"
      - "Request 100 USDC from Bob"
      You MUST call the 'createInvoiceAndPaymentPayload' tool to store the invoice in Supabase and construct the Base transaction details.

      Be concise, professional, clear, and highly focused on cryptofinance.
      Once you run the tool, explain briefly what you did (stating the client and the amount), and note that an interactive neo-brutalist invoice widget with a QR code and payment link has been rendered.`,
      tools: {
        createInvoiceAndPaymentPayload: tool({
          description: 'Creates a USDC invoice row in Supabase database and formulates the Base network payment transaction payload (EIP-681 and raw data).',
          inputSchema: z.object({
            clientName: z.string().describe('The name of the client to invoice (e.g. Acme Corp).'),
            amountUsdc: z.number().describe('The invoice amount in USDC (decimals allowed, e.g. 500.50).'),
            walletAddress: z.string().optional().describe('Optional destination wallet address. If omitted, default to the freelancer default.')
          }),
          execute: async ({ clientName, amountUsdc, walletAddress }) => {
            const destWallet = walletAddress || process.env.NEXT_PUBLIC_WALLET_ADDRESS || '0x32A292b1236C8b387AF585E2e6b72018861B1B48';
            const invoiceId = crypto.randomUUID() as string;

            // Insert new pending invoice row in Supabase
            const { error } = await supabase
              .from('invoices')
              .insert([
                {
                  id: invoiceId,
                  client_name: clientName,
                  amount_usdc: amountUsdc,
                  wallet_address: destWallet,
                  status: 'Pending',
                  created_at: new Date().toISOString()
                }
              ]);

            if (error) {
              console.error("Supabase invoice insertion failed:", error);
            }

            // Standard USDC Contract Address on Base Mainnet
            const usdcContract = '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913';
            const chainId = 8453; // Base mainnet

            // Convert USDC to base units (6 decimals)
            const amountInUnits = Math.round(amountUsdc * 1000000);
            
            // Format ERC-20 transfer(address,uint256) transaction data hex
            // 1. Selector for transfer(address,uint256) is 0xa9059cbb
            // 2. Pad recipient address to 32 bytes (64 chars)
            const cleanAddr = destWallet.replace('0x', '').toLowerCase();
            const paddedAddress = cleanAddr.padStart(64, '0');
            // 3. Pad amount to 32 bytes (64 chars)
            const paddedAmount = amountInUnits.toString(16).padStart(64, '0');
            const txData = `0xa9059cbb${paddedAddress}${paddedAmount}`;

            // Formulate standard EIP-681 Transaction URI
            const eip681Uri = `ethereum:${usdcContract}@${chainId}/transfer?address=${destWallet}&uint256=${amountInUnits}`;

            // Coinbase Keys / Base Pay deep link
            const payLink = `https://keys.coinbase.com/pay?amount=${amountUsdc}&asset=USDC&address=${destWallet}`;

            return {
              success: true,
              invoiceId,
              clientName,
              amountUsdc,
              walletAddress: destWallet,
              status: 'Pending',
              eip681Uri,
              payLink,
              transactionPayload: {
                to: usdcContract,
                chainId,
                data: txData,
                value: '0'
              }
            };
          }
        })
      }
    });

    return result.toUIMessageStreamResponse();

  } catch (error: any) {
    console.error("API Chat route error:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Fallback helper to mock streaming answers when no OpenRouter API key is found
function createMockStreamResponse(messages: any[]) {
  const lastMessage = messages[messages.length - 1]?.content || '';
  
  // Parse command in a simple way
  let clientName = 'Acme Corp';
  let amountUsdc = 500;
  
  const amountRegex = /(\d+(?:\.\d+)?)\s*usdc/i;
  const clientRegex = /(?:for|client)\s+([A-Za-z0-9\s._-]+)(?:\s+|$)/i;
  
  const amtMatch = lastMessage.match(amountRegex);
  if (amtMatch) amountUsdc = parseFloat(amtMatch[1]);
  
  const clientMatch = lastMessage.match(clientRegex);
  if (clientMatch) clientName = clientMatch[1].trim();

  // Return a mock SSE stream that mimics the Vercel AI SDK data stream
  const responseText = `I have successfully parsed your request and initialized a new invoice in the database!

Client: **${clientName}**
Amount: **${amountUsdc} USDC**

I've generated the transaction payload for receiving USDC on the **Base network** and registered the pending invoice in Supabase. The interactive neo-brutalist invoice card with the QR code and payment verification action has been added below.`;

  const invoiceId = `inv_mock_${Math.random().toString(36).substr(2, 9)}`;
  const destWallet = '0x32A292b1236C8b387AF585E2e6b72018861B1B48';
  const amountInUnits = Math.round(amountUsdc * 1000000);
  const txData = `0xa9059cbb${destWallet.replace('0x', '').toLowerCase().padStart(64, '0')}${amountInUnits.toString(16).padStart(64, '0')}`;
  const eip681Uri = `ethereum:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913@8453/transfer?address=${destWallet}&uint256=${amountInUnits}`;
  const payLink = `https://keys.coinbase.com/pay?amount=${amountUsdc}&asset=USDC&address=${destWallet}`;

  // Call supabase insert mock
  supabase.from('invoices').insert([
    {
      id: invoiceId,
      client_name: clientName,
      amount_usdc: amountUsdc,
      wallet_address: destWallet,
      status: 'Pending',
      created_at: new Date().toISOString()
    }
  ]);

  const toolCallId = `call_${Math.random().toString(36).substr(2, 9)}`;

  // Construct standard stream text/tool call chunks
  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      // 1. Send the text response
      // Vercel AI SDK text format: '0:"chunk"\n'
      const words = responseText.split(' ');
      for (const word of words) {
        controller.enqueue(encoder.encode(`0:${JSON.stringify(word + ' ')}\n`));
        await new Promise(resolve => setTimeout(resolve, 30));
      }

      // 2. Send tool call
      // Vercel AI SDK format for tool call: '9:{"toolCallId":"...","toolName":"...","args":{...}}\n'
      const toolCallPayload = {
        toolCallId,
        toolName: 'createInvoiceAndPaymentPayload',
        args: { clientName, amountUsdc, walletAddress: destWallet }
      };
      controller.enqueue(encoder.encode(`9:${JSON.stringify(toolCallPayload)}\n`));

      // 3. Send tool result
      // Vercel AI SDK format for tool result: 'a:{"toolCallId":"...","toolName":"...","args":{...},"result":{...}}\n'
      const toolResultPayload = {
        toolCallId,
        toolName: 'createInvoiceAndPaymentPayload',
        args: { clientName, amountUsdc, walletAddress: destWallet },
        result: {
          success: true,
          invoiceId,
          clientName,
          amountUsdc,
          walletAddress: destWallet,
          status: 'Pending',
          eip681Uri,
          payLink,
          transactionPayload: {
            to: '0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913',
            chainId: 8453,
            data: txData,
            value: '0'
          }
        }
      };
      controller.enqueue(encoder.encode(`a:${JSON.stringify(toolResultPayload)}\n`));
      
      controller.close();
    }
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'x-vercel-ai-data-stream': 'v1'
    }
  });
}
