"use client";

import { useState } from 'react';
import { useTonWallet } from '@tonconnect/ui-react';
import { WalletConnectButton } from '@/components/wallet-connect-button';
import { Button } from '@/components/ui/button';
import { formatTonAmount } from '@/lib/ton-utils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Diamond, ExternalLink } from 'lucide-react';

export function TonWalletInterface() {
  const wallet = useTonWallet();
  const [showTransactions, setShowTransactions] = useState(false);

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Diamond className="h-5 w-5 text-primary" />
          TON Wallet
        </CardTitle>
        <CardDescription>Connect your wallet to interact with the TON blockchain</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-center">
          <WalletConnectButton />
        </div>

        {wallet && (
          <div className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="rounded-lg border p-3">
                <div className="text-sm text-muted-foreground">Network</div>
                <div className="font-medium">{wallet.account.chain}</div>
              </div>
              <div className="rounded-lg border p-3">
                <div className="text-sm text-muted-foreground">Device</div>
                <div className="font-medium">{wallet.device.appName || "Wallet"}</div>
              </div>
            </div>

            <div className="rounded-lg border p-3">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">Wallet Address</div>
                <a 
                  href={`https://tonviewer.com/${wallet.account.address}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="inline-flex items-center text-xs text-blue-600 hover:underline"
                >
                  View on Explorer
                  <ExternalLink className="ml-1 h-3 w-3" />
                </a>
              </div>
              <div className="font-medium break-all">
                {wallet.account.address.slice(0, 10)}...{wallet.account.address.slice(-10)}
              </div>
            </div>
          </div>
        )}
      </CardContent>
      {wallet && (
        <CardFooter className="justify-center">
          <Button
            variant="outline"
            onClick={() => setShowTransactions(!showTransactions)}
          >
            {showTransactions ? 'Hide Transaction Form' : 'Make a Transaction'}
          </Button>
        </CardFooter>
      )}
    </Card>
  );
} 