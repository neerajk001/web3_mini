// Create this new file for IPFS utilities

export const getIPFSUrl = (cid) => {
  if (!cid) return '';
  
  if (cid.startsWith('http')) return cid;

  // ipfs.io is reliable for image display (no CORS enforcement on <img> tags)
  return `https://ipfs.io/ipfs/${cid.replace('ipfs://', '')}`;
};

// CORS-safe gateways first — gateway.pinata.cloud blocks cross-origin fetch()
export const IPFS_GATEWAYS = [
  'https://ipfs.io/ipfs/',
  // 'https://dweb.link/ipfs/',
  // 'https://w3s.link/ipfs/',
  'https://gateway.pinata.cloud/ipfs/',
];

// Fetch JSON from IPFS with fallback to multiple gateways
export const fetchFromIPFS = async (cid) => {
  if (!cid) throw new Error('CID is required');
  const normalizedCID = cid.replace('ipfs://', '');

  for (const gateway of IPFS_GATEWAYS) {
    try {
      const url = `${gateway}${normalizedCID}`;
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

