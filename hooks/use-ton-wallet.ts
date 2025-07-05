import { useTonAddress, useTonConnectUI, useTonWallet } from '@tonconnect/ui-react';
import { useCallback } from 'react';

export function useTonWalletConnect() {
  const wallet = useTonWallet();
  const [tonConnectUI] = useTonConnectUI();
  const userFriendlyAddress = useTonAddress();

  const isConnected = !!wallet;

  const connect = useCallback(() => {
    tonConnectUI.openModal();
  }, [tonConnectUI]);

  const disconnect = useCallback(() => {
    tonConnectUI.disconnect();
  }, [tonConnectUI]);

  return {
    wallet,
    tonConnectUI,
    userFriendlyAddress,
    isConnected,
    connect,
    disconnect
  };
} 