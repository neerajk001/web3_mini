// Create this new file for IPFS utilities

export const getIPFSUrl = (cid) => {
  if (!cid) return '';
  
  // If it's already a full URL, return it
  if (cid.startsWith('http')) return cid;
  
  // Use multiple IPFS gateways for reliability
  // Try Cloudflare first, then fallback to Pinata
  return `https://cloudflare-ipfs.com/ipfs/${cid}`;
};

// Alternative gateways to try if one fails
export const IPFS_GATEWAYS = [
  'https://cloudflare-ipfs.com/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://ipfs.io/ipfs/',
  'https://dweb.link/ipfs/',
];

// Fetch with fallback gateways
export const fetchFromIPFS = async (cid) => {
  if (!cid) throw new Error('CID is required');

  for (const gateway of IPFS_GATEWAYS) {
    try {
      const url = `${gateway}${cid}`;
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
      });

      if (!response.ok) {
        console.warn(`Gateway ${gateway} failed with status ${response.status}`);
        continue;
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.warn(`Gateway ${gateway} failed:`, error);
      continue;
    }
  }

  throw new Error(`Failed to fetch from IPFS with CID: ${cid}`);
};