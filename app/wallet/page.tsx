"use client";

import Link from "next/link";
import { ArrowLeft, Wallet } from "lucide-react";
import { useTonWallet, useTonAddress } from "@tonconnect/ui-react";
import { Button } from "@/components/ui/button";
import { TonTransactionDemo } from "@/components/ton-transaction-demo";
import { api } from "@/services/api";
import { AxiosInstance } from 'axios';
const axios = AxiosInstance.create();
import { useEffect, useState } from "react";
import { Transaction } from "@/app/types";

const TONCENTER_API = "https://toncenter.com/api/v2";

async function getTonBalance(address: string): Promise<number> {
  const res = await axios.get(`${TONCENTER_API}/getAddressBalance`, {
    params: { address }
  });
  return Number(res.data.result) / 1e9;
}

async function getTonTransactions(address: string): Promise<any[]> {
  const res = await axios.get(`${TONCENTER_API}/getTransactions`, {
    params: { address, limit: 10 }
  });
  return res.data.result;
}

export default function WalletPage() {
  const wallet = useTonWallet();
  const userFriendlyAddress = useTonAddress();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [balance, setBalance] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWalletData = async () => {
      if (!wallet) {
        setTransactions([]);
        setBalance(null);
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const [txs, bal] = await Promise.all([
          getTonTransactions(wallet.account.address),
          getTonBalance(wallet.account.address)
        ]);
        setTransactions(txs);
        setBalance(bal);
      } catch (error) {
        console.error("Failed to fetch wallet data:", error);
        setTransactions([]);
        setBalance(null);
      } finally {
        setLoading(false);
      }
    };
    fetchWalletData();
  }, [wallet]);

  return (
    <div className="container py-10 space-y-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">TON Wallet Demo</h1>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="p-6 border rounded-lg bg-card shadow-sm">
            <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
              <Wallet className="h-5 w-5" />
              Wallet Information
            </h2>
            {wallet ? (
              <div className="space-y-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Address</p>
                  <p className="font-mono break-all">{userFriendlyAddress}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Connection</p>
                  <p className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-green-500"></span>
                    Connected to {wallet.device.appName || "TON Wallet"}
                  </p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Network</p>
                  <p>{wallet.account.chain === "-239" ? "Mainnet" : "Testnet"}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Balance</p>
                  <p>{balance !== null ? `${balance} TON` : "-"}</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground">Please connect your wallet</p>
            )}
          </div>

          <div className="p-6 border rounded-lg bg-card shadow-sm">
            <h2 className="text-xl font-medium mb-4">Recent Transactions</h2>
            {loading ? (
              <p>Loading...</p>
            ) : !wallet ? (
              <p className="text-muted-foreground">Connect your wallet to view transactions</p>
            ) : transactions.length === 0 ? (
              <p className="text-muted-foreground">No transactions found</p>
            ) : (
              <div className="space-y-3">
                {transactions.map((tx) => (
                  <div key={tx.transaction_id || tx.utime} className="p-3 border rounded-md flex justify-between">
                    <div>
                      <p className="font-medium">{tx.in_msg?.value ? 'Received' : 'Sent'}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date((tx.utime || 0) * 1000).toLocaleString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">{tx.in_msg?.value ? Number(tx.in_msg.value) / 1e9 : 0} TON</p>
                      <p className="text-sm text-muted-foreground">{tx.in_msg?.source || '-'}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
        <div className="space-y-6">
          <TonTransactionDemo />
          <div className="p-6 border rounded-lg bg-card shadow-sm">
            <h2 className="text-xl font-medium mb-4">About TON Integration</h2>
            <p className="text-muted-foreground mb-4">
              This demo showcases how to integrate TON Connect into your application. It allows users to:
            </p>
            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
              <li>Connect their TON wallet</li>
              <li>View wallet information</li>
              <li>Send TON transactions</li>
              <li>View transaction history</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
} 