"use client";

import Link from 'next/link';
import { Header } from "@/components/header";
import { WalletConnectButton } from "@/components/wallet-connect-button";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { api } from "@/app/services/api";
import { Product, ProductType } from "@/app/types";
import { useEffect, useState } from "react";
import { useTonWallet, useTonConnectUI } from '@tonconnect/ui-react';
import { useToast } from "@/components/ui/use-toast";
import { toNano } from '@ton/core';

// Sample data - will be replaced by API calls
const sampleProducts: Product[] = [
    { id: '1', name: 'Telegram Stars (50)', type: 'stars', price: 2, value: 50, created_at: "2023-01-01", updated_at: "2023-01-01" },
    { id: '2', name: 'Telegram Stars (100)', type: 'stars', price: 3.5, value: 100, created_at: "2023-01-01", updated_at: "2023-01-01" },
    { id: '3', name: 'Telegram Stars (150)', type: 'stars', price: 5, value: 150, created_at: "2023-01-01", updated_at: "2023-01-01" },
    { id: '4', name: 'Premium Account', type: 'premium', price: 5, extra_data: { duration_months: 1 }, created_at: "2023-01-01", updated_at: "2023-01-01" },
    { id: '5', name: 'Rare Username', type: 'username', price: 50, extra_data: { username: '@ton_god' }, created_at: "2023-01-01", updated_at: "2023-01-01" },
    { id: '6', name: 'Virtual Number', type: 'number', price: 15, created_at: "2023-01-01", updated_at: "2023-01-01" },
];

function ProductSection({ title, type, products, onPurchase, purchasedProductIds }: { title: string; type: ProductType, products: Product[], onPurchase: (product: Product) => void, purchasedProductIds: string[] }) {
    const filteredProducts = products.filter(p => p.type === type);
    return (
        <section className="py-12">
            <h2 className="text-3xl font-bold text-center mb-8">{title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {filteredProducts.map((product) => (
                    <ProductCard key={product.id} product={product} onPurchase={onPurchase} purchased={purchasedProductIds.includes(product.id)} />
                ))}
            </div>
        </section>
    );
}

export default function HomePage() {
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const { toast } = useToast();
  const [purchasedProductIds, setPurchasedProductIds] = useState<string[]>([]);

  // Fetch purchased products from backend
  async function fetchPurchasedProducts() {
    const userToken = localStorage.getItem('user_token');
    if (!userToken) return;
    try {
      const response = await api.getOrders(userToken);
      if ('order' in response && Array.isArray(response.order)) {
        const ids = response.order.map((order: any) => order.product_id);
        setPurchasedProductIds(ids);
      }
    } catch (e) {
      // Optionally handle error
    }
  }

  useEffect(() => {
    fetchPurchasedProducts();
  }, []);

  const recipientAddress = "UQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABC_b";

  const handlePurchase = async (product: Product) => {
    if (!wallet) {
      // Prompt user to connect wallet if not already connected
      tonConnectUI.openModal();
      return;
    }

    try {
      // Define the transaction
      const transaction = {
        validUntil: Math.floor(Date.now() / 1000) + 600, // 10 minutes from now
        messages: [
          {
            address: recipientAddress,
            amount: toNano(product.price).toString(),
          },
        ],
      };

      toast({ title: "Please confirm the transaction in your wallet." });

      // Send the transaction
      const result = await tonConnectUI.sendTransaction(transaction);

      // Assuming the transaction was successful, create the order
      // Note: `result.boc` contains the transaction data. A more robust solution
      // would wait for blockchain confirmation to get a tx hash.
      // For this demo, we'll use a placeholder hash.
      const txHash = `mock_tx_${new Date().getTime()}`;
      
      const userToken = localStorage.getItem('user_token');
      if (!userToken) {
          toast({ title: "Authentication Error", description: "You must be logged in to purchase.", variant: "destructive"});
          return;
      }

      await api.createOrder({
        user_id: "mock_user_id", // In a real app, get this from logged-in user state
        product_id: product.id,
        amount: product.price,
        transaction_id: txHash,
      }, userToken);

      toast({
        title: "Purchase Successful!",
        description: `Your order for ${product.name} has been created.`,
      });

      // Fetch updated purchased products from backend
      fetchPurchasedProducts();

    } catch (error: any) {
      toast({
        title: "Purchase Failed",
        description: error.message || "An unexpected error occurred.",
        variant: "destructive",
      });
    }
  };
  
  return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header />

        <main className="container mx-auto px-4">
          <section className="text-center py-20">
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
              Discover, Collect, and Sell Digital Assets
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg sm:text-xl text-gray-500">
              The premier marketplace for Telegram Stars, Premium accounts, and exclusive digital goods on the TON Blockchain.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Link href="#products">
                <Button size="lg">Explore Products</Button>
              </Link>
              <Link href="#about">
                <Button size="lg" variant="outline">Learn More</Button>
              </Link>
            </div>
          </section>

          <div id="products">
            <ProductSection title="Telegram Stars" type="stars" products={sampleProducts} onPurchase={handlePurchase} purchasedProductIds={purchasedProductIds}/>
            <ProductSection title="Premium Accounts" type="premium" products={sampleProducts} onPurchase={handlePurchase} purchasedProductIds={purchasedProductIds}/>
            <ProductSection title="Rare Usernames" type="username" products={sampleProducts} onPurchase={handlePurchase} purchasedProductIds={purchasedProductIds}/>
            <ProductSection title="Virtual Numbers" type="number" products={sampleProducts} onPurchase={handlePurchase} purchasedProductIds={purchasedProductIds}/>
          </div>
          
          <section id="about" className="py-20 text-center">
            <h2 className="text-3xl font-bold mb-4">About Our Marketplace</h2>
            <p className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-400">
              Our platform is a decentralized, secure, and user-friendly marketplace for exclusive digital assets and services on the TON Blockchain. We connect creators and collectors, enabling seamless transactions for everything from Telegram Stars to unique usernames. Our mission is to empower the digital economy on The Open Network.
            </p>
          </section>

        </main>

        <footer className="text-center py-8 border-t dark:border-gray-800 mt-12">
            <p>&copy; {new Date().getFullYear()} TON Digital Marketplace. All Rights Reserved.</p>
        </footer>
      </div>
  );
}

