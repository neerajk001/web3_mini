import { ethers } from 'ethers';
import ArtworkRegistryJSON from '../abi/ArtworkRegistry.json';

// Extract the ABI array from the JSON
const ABI = ArtworkRegistryJSON.abi;
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x...';

// For READ-ONLY operations (no wallet needed, forces correct network)
export const getContractReadOnly = () => {
  try {
    const rpcUrl = import.meta.env.VITE_RPC_URL || "http://127.0.0.1:8545";
    const provider = new ethers.JsonRpcProvider(rpcUrl);
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, provider);
    
    return contract;
  } catch (error) {
    console.error('Error getting read-only contract:', error);
    throw error;
  }
};

// For WRITE operations (needs connected wallet)
export const getContract = async () => {
  try {
    if (!window.ethereum) {
      throw new Error('MetaMask not installed');
    }

    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner(); // ✅ AWAIT THIS!
    const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);
    
    return contract;
  } catch (error) {
    console.error('Error getting contract:', error);
    throw error;
  }
};
