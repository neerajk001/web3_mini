import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AssetCard from '../components/AssetCard';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { fetchFromIPFS } from '../utils/ipfs';
import { ethers } from 'ethers';
import { getContractReadOnly } from '../utils/contract';

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState(searchParams.get('type') || 'all');

  // Update filter type when URL param changes
  useEffect(() => {
    const type = searchParams.get('type');
    if (type) {
      setFilterType(type);
    }
  }, [searchParams]);

  useEffect(() => {
    const fetchAssets = async () => {
      try {
        setLoading(true);
        setError(null);

        // ALWAYS use the robust RPC Provider for fetching items independent of the user's wallet
        const rpcUrl = import.meta.env.VITE_RPC_URL || "http://127.0.0.1:8545";
        const provider = new ethers.JsonRpcProvider(rpcUrl);
        
        // Validate contract address is configured
        const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS;
        if (!CONTRACT_ADDRESS || CONTRACT_ADDRESS === '0x...') {
          console.warn('Contract address not configured');
          setAssets([]);
          setLoading(false);
          return;
        }

        // Create contract instance
        const contract = getContractReadOnly();

        // Verify contract exists
        const code = await provider.getCode(CONTRACT_ADDRESS);
        if (code === '0x') {
          setError("Contract not found on this network. Please check your network.");
          setAssets([]);
          setLoading(false);
          return;
        }

        // Fetch nextArtworkId
        let nextId;
        try {
          nextId = await contract.nextArtworkId();
        } catch (err) {
          console.error("Contract call failed:", err);
          setError("Contract is not responding. Check your network connection.");
          setAssets([]);
          setLoading(false);
          return;
        }

        const totalArtworks = Number(nextId);

        if (totalArtworks === 0) {
          setAssets([]);
          setLoading(false);
          return;
        }

        const loadedAssets = [];
        // Fetch ALL artworks (iterate backwards to show newest first)
        for (let i = totalArtworks - 1; i >= 0; i--) {
          try {
            const artwork = await contract.artworks(i);
            
            // Check if metadataCID exists
            if (!artwork.metadataCID) continue;

            // Fetch metadata with retries
            const metadata = await fetchFromIPFS(artwork.metadataCID);

            loadedAssets.push({
              id: i.toString(),
              title: metadata.title || 'Untitled',
              description: metadata.description || 'No description',
              image_url: metadata.image || metadata.image_url || '',
              price: ethers.formatEther(artwork.price),
              creator_address: artwork.creator,
              owner_address: artwork.owner,
              isListed: artwork.isListed, // Useful for marketplace logic
              type: artwork.itemType === 0 ? 'painting' : 'research-paper',
            });
          } catch (err) {
            console.error(`Failed to fetch artwork ${i}:`, err);
            // Continue to next artwork
            continue;
          }
        }

        setAssets(loadedAssets);
      } catch (err) {
        console.error("Error fetching marketplace assets:", err);
        setError("Failed to load marketplace assets. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, []);

  // Filter logic based on fetched assets
  const filteredAssets = assets.filter(asset => {
    const matchesSearch = asset.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          asset.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || asset.type === filterType;
    
    return matchesSearch && matchesType;
  });

  const handleFilterChange = (type) => {
    setFilterType(type);
    setSearchParams({ type: type === 'all' ? '' : type });
  };

  return (
    <div className="min-h-screen bg-black pt-32 pb-12 px-4">
      <div className="container mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">Marketplace</h1>
            <p className="text-gray-400">Explore, collect, and trade unique digital assets</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search Bar */}
            <input
              type="text"
              placeholder="Search assets..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="px-4 py-2 bg-gray-900 border border-gray-700 rounded-lg text-white focus:outline-hidden focus:border-cyan-500 w-full sm:w-64"
            />
          </div>
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <Button 
            variant={filterType === 'all' ? 'primary' : 'outline'}
            onClick={() => handleFilterChange('all')}
            className={filterType === 'all' ? 'bg-cyan-600' : 'border-gray-600'}
          >
            All Items
          </Button>
          <Button 
            variant={filterType === 'painting' ? 'primary' : 'outline'}
            onClick={() => handleFilterChange('painting')}
            className={filterType === 'painting' ? 'bg-cyan-600' : 'border-gray-600'}
          >
            Paintings
          </Button>
          <Button 
            variant={filterType === 'research-paper' ? 'primary' : 'outline'}
            onClick={() => handleFilterChange('research-paper')}
            className={filterType === 'research-paper' ? 'bg-cyan-600' : 'border-gray-600'}
          >
            Research Papers
          </Button>
        </div>

        {/* Content */}
        {loading ? (
          <Loading message="Loading marketplace..." />
        ) : error ? (
          <div className="text-center py-20">
            <p className="text-red-500 text-xl mb-4">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="text-center py-20 bg-gray-900/50 rounded-2xl border border-gray-800">
            <h3 className="text-2xl font-bold text-gray-300 mb-2">No items found</h3>
            <p className="text-gray-500">
              {searchTerm || filterType !== 'all' 
                ? 'Try adjusting your filters' 
                : 'Be the first to create an NFT on this platform!'}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredAssets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} showOwner={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
