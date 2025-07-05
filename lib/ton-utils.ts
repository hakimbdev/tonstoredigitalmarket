import { SendTransactionResponse, TonConnectUI } from '@tonconnect/ui-react';

// Format TON amount with proper decimals
export function formatTonAmount(amount: number | string): string {
  const num = typeof amount === 'string' ? parseFloat(amount) : amount;
  return num.toFixed(2);
}

// Send a TON transaction using TON Connect
export async function sendTransaction(
  tonConnectUI: TonConnectUI | null, 
  to: string, 
  amount: string, 
  comment?: string
): Promise<{ success: boolean; response?: SendTransactionResponse; error?: string }> {
  if (!tonConnectUI) {
    return { success: false, error: 'Wallet not connected' };
  }

  try {
    // Convert TON to nanoTON (1 TON = 10^9 nanoTON)
    const amountNano = BigInt(Math.floor(parseFloat(amount) * 1e9));
    
    const transaction = {
      validUntil: Math.floor(Date.now() / 1000) + 300, // 5 minutes from now
      messages: [
        {
          address: to,
          amount: amountNano.toString(),
          payload: comment ? btoa(comment) : '',
        },
      ],
    };

    const response = await tonConnectUI.sendTransaction(transaction);
    return { success: true, response };
  } catch (error) {
    console.error('Transaction error:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error during transaction' 
    };
  }
} 