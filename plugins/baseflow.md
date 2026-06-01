# BaseFlow Custom Plugin Spec (Base MCP)

> [!IMPORTANT]
> ## STOP — COMPLETE ONBOARDING BEFORE USING THIS PLUGIN
>
> Before executing any billing or payout actions on BaseFlow, you MUST complete the Base MCP onboarding flow:
> 1. Call `get_wallets` (Detection)
> 2. Present wallet status and standard Web3 disclaimer (Onboarding)
>
> The freelancer's recipient address and client's funding address are only verified during detection.

BaseFlow is a zero-friction, AI-driven B2B invoicing and settlement coprocessor for Web3 freelancers. It registers invoices in a ledger and generates standardized USDC payment payloads to be executed via Base MCP's `send_calls`.

**Supported Chain:** Base mainnet (`8453` / `0x2105`).
**Stablecoin Standard:** Bridged/Native USDC on Base (`0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913`).

---

## Read Endpoints

### 1. Fetch Freelancer Invoices
List or search the Supabase billing history ledger.
```
GET https://<your-supabase-id>.supabase.co/rest/v1/invoices?select=*
```
* **Headers:** `apikey: <anon_public_key>`, `Authorization: Bearer <anon_public_key>`

### 2. Verify Invoice Payment Status
Check if a specific invoice has been reconciled on the Base blockchain explorer.
```
POST http://localhost:3000/api/verify-payment
```
* **Payload JSON:** `{ "invoiceId": "<invoice-uuid>" }`
* **Response JSON:**
  ```json
  {
    "success": true,
    "message": "Base network payment verified successfully!",
    "txHash": "0x...",
    "invoice": { "status": "Paid" }
  }
  ```

---

## Prepare Endpoint

### 1. Generate Invoice and Payout Calldata
Registers a new invoice in Supabase and returns the standard ERC-20 `transfer(address,uint256)` unsigned calldata payload for execution.
```
POST http://localhost:3000/api/chat
```
* **Parameters:** `clientName` (string), `amountUsdc` (number), `walletAddress` (string)
* **Response Envelope:**
  ```json
  {
    "success": true,
    "invoiceId": "inv_uuid_...",
    "clientName": "Acme Corp",
    "amountUsdc": 500,
    "walletAddress": "0x32A292b1236C8b387AF585E2e6b72018861B1B48",
    "eip681Uri": "ethereum:0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913@8453/transfer?address=0x32A292...&uint256=500000000",
    "payLink": "https://keys.coinbase.com/pay?amount=500&asset=USDC&address=0x32A292...",
    "transactionPayload": {
      "to": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      "chainId": 8453,
      "data": "0xa9059cbb00000000000000000000000032a292b1236c8b387af585e2e6b72018861b1b48000000000000000000000000000000000000000000000000000000001dcd6500",
      "value": "0"
    }
  }
  ```

---

## send_calls Mapping

To execute the USDC payment settlement, parse the returned `transactionPayload` from the prepare response and map it directly to Base MCP's standard `send_calls` tool format:

```json
{
  "chain": "base",
  "calls": [
    {
      "to": "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
      "value": "0x0",
      "data": "0xa9059cbb00000000000000000000000032a292b1236c8b387af585e2e6b72018861b1b48000000000000000000000000000000000000000000000000000000001dcd6500"
    }
  ]
}
```

---

## Orchestration Pattern

```
1. get_wallets -> Extract active funding address.
2. Fetch GET /rest/v1/invoices -> Check historical ledger balances.
3. Call createInvoiceAndPaymentPayload tool -> Returns transactionPayload.
4. Call send_calls(chain="base", calls=[transactionPayload]) to initiate the payment.
5. User confirms -> Transaction hash executed.
6. Call POST /api/verify-payment -> Verifies transaction hash and reconciles status to Paid.
```
