import { createContext, useContext, useState, useEffect } from 'react';
import { connectWallet, disconnectWallet, onAccountsChanged, onChainChanged, removeListeners } from '../utils/wallet';

const WalletContext = createContext();

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
};

export const WalletProvider = ({ children }) => {
  const [walletState, setWalletState] = useState({
    provider: null,
    signer: null,
    address: null,
    balance: null,
    chainId: null,
    connected: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Connect wallet
  const connect = async () => {
    try {
      setLoading(true);
      setError(null);
      const wallet = await connectWallet();
      setWalletState(wallet);
    } catch (err) {
      setError(err.message);
      console.error('Connection error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Disconnect wallet
  const disconnect = () => {
    setWalletState(disconnectWallet());
    setError(null);
  };

  // Handle account changes
  const handleAccountsChanged = (accounts) => {
    if (accounts.length === 0) {
      disconnect();
    } else {
      connect();
    }
  };

  // Handle chain changes
  const handleChainChanged = () => {
    connect();
  };

  // Set up event listeners
  useEffect(() => {
    onAccountsChanged(handleAccountsChanged);
    onChainChanged(handleChainChanged);

    return () => {
      removeListeners();
    };
  }, []);

  const value = {
    ...walletState,
    loading,
    error,
    connect,
    disconnect,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
};
