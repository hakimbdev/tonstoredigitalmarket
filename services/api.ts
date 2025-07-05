import { Asset, Transaction } from '@/app/types';

// In-memory database for demo purposes
let assets: Asset[] = [
  {
    id: 1,
    name: "Digital Asset #1",
    description: "A unique digital collectible on TON",
    image_url: null,
    price: 45.75,
    owner_address: "EQDrjaLahLkMB-hMCmkzOyBuHJ139ZUYmPHu6RRBKnbdLIYI",
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 2,
    name: "Digital Asset #2",
    description: "An exclusive NFT with special privileges",
    image_url: null,
    price: 120.50,
    owner_address: "EQDrjaLahLkMB-hMCmkzOyBuHJ139ZUYmPHu6RRBKnbdLIYI",
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 3,
    name: "Digital Asset #3",
    description: "Limited edition digital artwork",
    image_url: null,
    price: 75.25,
    owner_address: "EQDrjaLahLkMB-hMCmkzOyBuHJ139ZUYmPHu6RRBKnbdLIYI",
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 4,
    name: "Digital Asset #4",
    description: "Rare collectible with utility features",
    image_url: null,
    price: 200.00,
    owner_address: "EQDrjaLahLkMB-hMCmkzOyBuHJ139ZUYmPHu6RRBKnbdLIYI",
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 5,
    name: "Digital Asset #5",
    description: "Premium TON blockchain asset",
    image_url: null,
    price: 150.25,
    owner_address: "EQDrjaLahLkMB-hMCmkzOyBuHJ139ZUYmPHu6RRBKnbdLIYI",
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 6,
    name: "Digital Asset #6",
    description: "Exclusive membership token",
    image_url: null,
    price: 95.80,
    owner_address: "EQDrjaLahLkMB-hMCmkzOyBuHJ139ZUYmPHu6RRBKnbdLIYI",
    status: 'active',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

// Auction assets (separate from regular assets)
let auctionAssets: Asset[] = [
  {
    id: 1001,
    name: "Premium Domain #1",
    description: "Exclusive digital domain on TON",
    image_url: null,
    price: 788.45,
    owner_address: "EQDrjaLahLkMB-hMCmkzOyBuHJ139ZUYmPHu6RRBKnbdLIYI",
    status: 'auction',
    auction_end_time: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: 1002,
    name: "Premium Domain #2",
    description: "Exclusive digital domain on TON",
    image_url: null,
    price: 955.20,
    owner_address: "EQDrjaLahLkMB-hMCmkzOyBuHJ139ZUYmPHu6RRBKnbdLIYI",
    status: 'auction',
    auction_end_time: new Date(Date.now() + 86400000).toISOString(), // 1 day from now
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  }
];

let transactions: Transaction[] = [];
let nextTransactionId = 1;

export const api = {
  async getAssets(): Promise<Asset[]> {
    return [...assets];
  },

  async getAuctionAssets(): Promise<Asset[]> {
    return [...auctionAssets];
  },

  async getAsset(id: number): Promise<Asset> {
    const asset = assets.find(a => a.id === id) || auctionAssets.find(a => a.id === id);
    if (!asset) {
      throw new Error('Asset not found');
    }
    return {...asset};
  },

  async placeBid(assetId: number, bidderAddress: string, amount: number): Promise<Transaction> {
    // Find the asset
    let asset: Asset | undefined;
    let isAuction = false;
    
    asset = assets.find(a => a.id === assetId);
    if (!asset) {
      asset = auctionAssets.find(a => a.id === assetId);
      if (asset) isAuction = true;
    }
    
    if (!asset) {
      throw new Error('Asset not found');
    }

    // Check if bid is higher than current price
    if (amount <= asset.price) {
      throw new Error('Bid amount must be higher than current price');
    }

    // Update asset price
    asset.price = amount;
    asset.updated_at = new Date().toISOString();
    
    // If it's an auction asset, update in the auction array
    if (isAuction) {
      auctionAssets = auctionAssets.map(a => a.id === assetId ? asset! : a);
    } else {
      assets = assets.map(a => a.id === assetId ? asset! : a);
    }

    // Create transaction record
    const transaction: Transaction = {
      id: nextTransactionId++,
      asset_id: assetId,
      transaction_hash: `0x${Math.random().toString(16).substring(2, 42)}`,
      from_address: bidderAddress,
      to_address: asset.owner_address,
      amount: amount,
      type: 'bid',
      status: 'pending',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Store transaction
    transactions.push(transaction);

    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500));

    // Return transaction
    return {...transaction};
  },

  async createAsset(data: {
    name: string;
    description: string;
    price: number;
    ownerAddress: string;
    imageUrl?: string;
    metadata?: Record<string, any>;
    isAuction?: boolean;
    auctionEndTime?: Date;
  }): Promise<Asset> {
    // Generate new ID (simple increment for demo)
    const id = data.isAuction 
      ? Math.max(...auctionAssets.map(a => a.id), 1000) + 1
      : Math.max(...assets.map(a => a.id)) + 1;
    
    // Create new asset
    const asset: Asset = {
      id,
      name: data.name,
      description: data.description,
      image_url: data.imageUrl || null,
      price: data.price,
      owner_address: data.ownerAddress,
      status: data.isAuction ? 'auction' : 'active',
      auction_end_time: data.isAuction && data.auctionEndTime ? data.auctionEndTime.toISOString() : undefined,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    // Store asset
    if (data.isAuction) {
      auctionAssets.push(asset);
    } else {
      assets.push(asset);
    }

    // Simulate async operation
    await new Promise(resolve => setTimeout(resolve, 500));
    
    return {...asset};
  },

  async getTransactions(assetId?: number): Promise<Transaction[]> {
    let result = [...transactions];
    if (assetId !== undefined) {
      result = result.filter(t => t.asset_id === assetId);
    }
    return result;
  }
}; 