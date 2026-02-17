import { BrowserProvider, Contract, FallbackProvider, JsonRpcProvider } from 'ethers';
import ABI from '../abi/ArtworkRegistry.json';
import { ethers } from 'ethers';

// Define multiple RPC endpoints
const RPC_ENDPOINTS = [
  'https://eth-sepolia.g.alchemy.com/v2/jJp3G0knsw5fJnFgFo-qr',
  'https://rpc.sepolia.org',
  'https://sepolia.gateway.tenderly.co',
  'https://ethereum-sepolia.publicnode.com',
].filter(url => url && !url.includes('undefined'));

// OPTION 1: Use Alchemy provider directly (RECOMMENDED)
export const getContract = async () => {
  try {
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner(); // ✅ Already connected, no need to reconnect
    
    const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
    const contractABI = await import('../abi/ArtworkRegistry.json').then(m => m.default);
    
    const contract = new ethers.Contract(contractAddress, contractABI, signer);
    return contract;
  } catch (error) {
    console.error('Error getting contract:', error);
    throw error;
  }
};
