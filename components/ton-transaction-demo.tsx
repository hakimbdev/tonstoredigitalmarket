"use client";

import { useTonWallet, useTonConnectUI, useTonAddress } from "@tonconnect/ui-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";

export function TonTransactionDemo() {
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const userFriendlyAddress = useTonAddress();
  const { toast } = useToast();
  const [amount, setAmount] = useState("1.0");
  const [recipient, setRecipient] = useState("EQDrjaLahLkMB-hMCmkzOyBuHJ139ZUYmPHu6RRBKnbdLIYI");
  const [isLoading, setIsLoading] = useState(false);

  const handleSendTransaction = async () => {
    if (!wallet) {
      toast({
        title: "Wallet not connected",
        description: "Please connect your wallet to send transactions",
        variant: "destructive",
      });
      tonConnectUI.openModal();
      return;
    }

    try {
      setIsLoading(true);
      
      // In a real app, this would be a real transaction
      // For this demo, we'll just simulate a delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate a successful transaction
      toast({
        title: "Transaction sent",
        description: `${amount} TON sent to ${recipient.slice(0, 6)}...${recipient.slice(-4)}`,
      });
    } catch (error) {
      toast({
        title: "Transaction failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Send TON</CardTitle>
        <CardDescription>
          Send TON to another wallet address. This is a demo, no real transactions will be made.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {!wallet ? (
          <div className="p-4 text-center">
            <p className="mb-4">Connect your wallet to continue</p>
            <Button onClick={() => tonConnectUI.openModal()}>Connect Wallet</Button>
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="wallet">Your wallet</Label>
              <Input 
                id="wallet" 
                value={userFriendlyAddress} 
                readOnly 
                className="bg-muted"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="recipient">Recipient</Label>
              <Input 
                id="recipient" 
                value={recipient} 
                onChange={(e) => setRecipient(e.target.value)} 
                placeholder="Recipient TON address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="amount">Amount (TON)</Label>
              <Input 
                id="amount" 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                placeholder="Amount to send (TON)"
                min="0.01" 
                step="0.1"
              />
            </div>
          </>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          className="w-full" 
          onClick={handleSendTransaction} 
          disabled={!wallet || isLoading}
        >
          {isLoading ? "Sending..." : "Send TON"}
        </Button>
      </CardFooter>
    </Card>
  );
} 