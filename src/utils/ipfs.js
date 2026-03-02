// Create this new file for IPFS utilities

export const getIPFSUrl = (cid) => {
  if (!cid) return '';
  
  // If it's already a full URL, return it
  if (cid.startsWith('http')) return cid;
  
  // Use a reliable public gateway
  return `https://cloudflare-ipfs.com/ipfs/${cid.replace('ipfs://', '')}`;
};

// A list of public IPFS gateways to try in order
export const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  'https://dweb.link/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
  'https://cloudflare-ipfs.com/ipfs/'
];

// Fetch JSON from IPFS with fallback to multiple gateways
export const fetchFromIPFS = async (cid) => {
  if (!cid) throw new Error('CID is required');
  const normalizedCID = cid.replace('ipfs://', '');

  for (const gateway of IPFS_GATEWAYS) {
    try {
      const url = `${gateway}${normalizedCID}`;
      // Do not pass Accept headers - it forces a CORS preflight OPTIONS request
      // which fails heavily on rate-limited public gateways.
      const response = await fetch(url);

      if (response.ok) {
        return await response.json();
      }
      console.warn(`Gateway ${gateway} failed with status ${response.status}`);
    } catch (error) {
      console.warn(`Gateway ${gateway} failed with error:`, error.message);
    }
  }

  throw new Error(`Failed to fetch from IPFS for CID: ${normalizedCID}`);
};

