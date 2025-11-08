import { createContext, useContext, useState, useEffect } from 'react';
import { useWallet } from './WalletContext';
import { getUserProfile, createOrUpdateProfile, getTransactions } from '../utils/supabase';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const { address, connected } = useWallet();
  const [profile, setProfile] = useState(null);
  const [ownedAssets, setOwnedAssets] = useState([]);
  const [listedAssets, setListedAssets] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch user profile
  const fetchProfile = async () => {
    if (!address) return;
    
    try {
      setLoading(true);
      const userProfile = await getUserProfile(address);
      setProfile(userProfile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update profile
  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      const updated = await createOrUpdateProfile({
        ...profileData,
        wallet_address: address,
      });
      setProfile(updated);
      return updated;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Fetch transactions
  const fetchTransactions = async () => {
    if (!address) return;
    
    try {
      const txs = await getTransactions(address);
      setTransactions(txs || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  };

  // Refresh all user data
  const refreshUserData = async () => {
    await Promise.all([fetchProfile(), fetchTransactions()]);
  };

  // Effect to load user data when wallet connects
  useEffect(() => {
    if (connected && address) {
      refreshUserData();
    } else {
      setProfile(null);
      setOwnedAssets([]);
      setListedAssets([]);
      setTransactions([]);
    }
  }, [connected, address]);

  const value = {
    profile,
    ownedAssets,
    listedAssets,
    transactions,
    loading,
    updateProfile,
    refreshUserData,
    setOwnedAssets,
    setListedAssets,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};
