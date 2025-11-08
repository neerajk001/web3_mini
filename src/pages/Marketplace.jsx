import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import AssetCard from '../components/AssetCard';
import Loading from '../components/Loading';

const Marketplace = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: searchParams.get('type') || '',
    search: '',
    minPrice: '',
    maxPrice: '',
    sortBy: 'newest',
  });

  // Mock data - replace with actual API call
  const mockAssets = [
    {
      id: '1',
      title: 'Abstract Dreams',
      description: 'A vibrant digital painting exploring the boundaries of imagination',
      type: 'painting',
      price: '2.5',
      image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
      creator_name: 'Alice Creator',
      verified: true,
    },
    {
      id: '2',
      title: 'Quantum Computing Research',
      description: 'Groundbreaking research on quantum algorithms and their applications',
      type: 'research-paper',
      price: '1.8',
      image_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?w=800',
      creator_name: 'Dr. Smith',
      verified: true,
    },
    {
      id: '3',
      title: 'Neon Cityscape',
      description: 'Futuristic city illuminated by neon lights',
      type: 'painting',
      price: '3.2',
      image_url: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=800',
      creator_name: 'Bob Artist',
      verified: false,
    },
    {
      id: '4',
      title: 'Machine Learning Study',
      description: 'Advanced research on neural networks and deep learning',
      type: 'research-paper',
      price: '2.1',
      image_url: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800',
      creator_name: 'Dr. Johnson',
      verified: true,
    },
    {
      id: '5',
      title: 'Cosmic Explosion',
      description: 'Abstract representation of the universe',
      type: 'painting',
      price: '4.5',
      image_url: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800',
      creator_name: 'Cosmic Artist',
      verified: true,
    },
    {
      id: '6',
      title: 'Climate Change Analysis',
      description: 'Comprehensive study on global warming impacts',
      type: 'research-paper',
      price: '1.5',
      image_url: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800',
      creator_name: 'Dr. Green',
      verified: false,
    },
  ];

  useEffect(() => {
    // Simulate API call
    setLoading(true);
    setTimeout(() => {
      let filtered = [...mockAssets];

      // Filter by type
      if (filters.type) {
        filtered = filtered.filter((asset) => asset.type === filters.type);
      }

      // Filter by search
      if (filters.search) {
        filtered = filtered.filter(
          (asset) =>
            asset.title.toLowerCase().includes(filters.search.toLowerCase()) ||
            asset.description.toLowerCase().includes(filters.search.toLowerCase())
        );
      }

      // Filter by price
      if (filters.minPrice) {
        filtered = filtered.filter((asset) => parseFloat(asset.price) >= parseFloat(filters.minPrice));
      }
      if (filters.maxPrice) {
        filtered = filtered.filter((asset) => parseFloat(asset.price) <= parseFloat(filters.maxPrice));
      }

      // Sort
      if (filters.sortBy === 'price-low') {
        filtered.sort((a, b) => parseFloat(a.price) - parseFloat(b.price));
      } else if (filters.sortBy === 'price-high') {
        filtered.sort((a, b) => parseFloat(b.price) - parseFloat(a.price));
      }

      setAssets(filtered);
      setLoading(false);
    }, 500);
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    if (key === 'type') {
      if (value) {
        setSearchParams({ type: value });
      } else {
        setSearchParams({});
      }
    }
  };

  const clearFilters = () => {
    setFilters({
      type: '',
      search: '',
      minPrice: '',
      maxPrice: '',
      sortBy: 'newest',
    });
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Explore NFT Marketplace</h1>
          <p className="text-gray-600">Discover unique digital assets from creators around the world</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Search */}
            <div className="lg:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by title or description..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="input-field"
              />
            </div>

            {/* Type Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={filters.type}
                onChange={(e) => handleFilterChange('type', e.target.value)}
                className="input-field"
              >
                <option value="">All Types</option>
                <option value="painting">Paintings</option>
                <option value="research-paper">Research Papers</option>
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Min Price (ETH)</label>
              <input
                type="number"
                placeholder="0.0"
                step="0.1"
                value={filters.minPrice}
                onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                className="input-field"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Max Price (ETH)</label>
              <input
                type="number"
                placeholder="10.0"
                step="0.1"
                value={filters.maxPrice}
                onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                className="input-field"
              />
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mt-4 gap-4">
            {/* Sort */}
            <div className="flex items-center space-x-3">
              <label className="text-sm font-medium text-gray-700">Sort by:</label>
              <select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                className="input-field w-auto"
              >
                <option value="newest">Newest</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
              </select>
            </div>

            {/* Clear Filters */}
            <button
              onClick={clearFilters}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              Clear All Filters
            </button>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            {loading ? 'Loading...' : `${assets.length} asset${assets.length !== 1 ? 's' : ''} found`}
          </p>
        </div>

        {/* Assets Grid */}
        {loading ? (
          <Loading message="Loading assets..." />
        ) : assets.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-2">No assets found</h3>
            <p className="text-gray-600 mb-6">Try adjusting your filters or search terms</p>
            <button
              onClick={clearFilters}
              className="btn-primary"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {assets.map((asset) => (
              <AssetCard key={asset.id} asset={asset} showOwner={true} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Marketplace;
