import { BrowserProvider, Contract } from 'ethers';
import ABI from '../abi/ArtworkRegistry.json';

export const getContract = async () => {
  const provider = new BrowserProvider(window.ethereum);
  const signer = await provider.getSigner();

  return new Contract(
    import.meta.env.VITE_CONTRACT_ADDRESS,
    ABI,
    signer
  );
};
