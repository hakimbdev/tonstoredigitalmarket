"use client";

import { Product } from "@/app/types";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useTonWallet, useTonConnectUI } from "@tonconnect/ui-react";
import { Star, Gem, AtSign, Phone } from "lucide-react";
import { useEffect, useState } from "react";
import { useToast } from "@/components/ui/use-toast";

const typeIcons: { [key in Product['type']]: React.ReactNode } = {
    stars: <Star className="w-5 h-5 text-yellow-500" />,
    premium: <Gem className="w-5 h-5 text-purple-500" />,
    username: <AtSign className="w-5 h-5 text-blue-500" />,
    number: <Phone className="w-5 h-5 text-green-500" />,
};

function getProductValue(product: Product) {
    switch (product.type) {
        case 'stars':
            return `${product.value?.toLocaleString()} Stars`;
        case 'premium':
            return `${product.extra_data?.duration_months} Month(s)`;
        case 'username':
            return product.extra_data?.username;
        case 'number':
            return 'Virtual Number';
        default:
            return 'N/A';
    }
}

function hasPurchased(productId: string): boolean {
  if (typeof window === 'undefined') return false;
  const purchased = localStorage.getItem('purchased_products');
  if (!purchased) return false;
  try {
    const arr = JSON.parse(purchased);
    return Array.isArray(arr) && arr.includes(productId);
  } catch {
    return false;
  }
}

export function ProductCard({ product, onPurchase, purchased }: { product: Product, onPurchase: (product: Product) => void, purchased: boolean }) {
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handlePurchase = async () => {
    if (!wallet) {
      toast({ title: "Wallet not connected", description: "Connect your wallet to purchase.", variant: "destructive" });
      tonConnectUI.openModal();
      return;
    }
    try {
      setIsLoading(true);
      // Convert TON to nanoTON (1 TON = 1e9 nanoTON)
      const amountNano = BigInt(Math.floor(product.price * 1e9));
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes from now
        messages: [
          {
            address: product.recipient || "UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABC_b", // fallback if not present
            amount: amountNano.toString(),
            payload: '',
          },
        ],
      };
      const result = await tonConnectUI.sendTransaction(transaction);
      toast({
        title: "Purchase Transaction Sent",
        description: result && result.boc ? `Transaction sent! BOC: ${result.boc}` : `Transaction sent to ${product.recipient?.slice(0, 6) || ''}...${product.recipient?.slice(-4) || ''}`,
      });
      if (onPurchase) onPurchase(product);
    } catch (error) {
      toast({
        title: "Purchase Failed",
        description: error instanceof Error ? error.message : "Unknown error",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="text-lg">{product.name}</CardTitle>
          {typeIcons[product.type]}
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-2xl font-bold text-center my-4">{getProductValue(product)}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-stretch">
        <div className="text-center text-3xl font-bold mb-4">
            {purchased ? (
              <>${product.price.toFixed(2)}</>
            ) : (
              <span className="text-gray-400">Unlock price with TON</span>
            )}
        </div>
        <Button onClick={handlePurchase} disabled={isLoading || purchased}>
            {wallet ? (purchased ? 'Purchased' : (isLoading ? 'Processing...' : 'Purchase')) : 'Connect Wallet to Purchase'}
        </Button>
      </CardFooter>
    </Card>
  );
} 