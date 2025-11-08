import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import AssetCard from '../components/AssetCard';
import Button from '../components/Button';
import Loading from '../components/Loading';

const Landing = () => {
  const { connected } = useWallet();
  const [featuredAssets, setFeaturedAssets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock featured assets - replace with actual API call
    setTimeout(() => {
      setFeaturedAssets([
        {
          id: '1',
          title: 'Abstract Dreams',
          description: 'A vibrant digital painting exploring the boundaries of imagination',
          type: 'painting',
          price: '2.5',
          image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
          creator_name: 'Alice Creator',
          creator_address: '0x1234...5678',
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
          creator_address: '0xabcd...efgh',
          verified: true,
        },
        {
          id: '3',
          title: 'Neon Cityscape',
          description: 'Futuristic city illuminated by neon lights and digital art',
          type: 'painting',
          price: '3.2',
          image_url: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=800',
          creator_name: 'Bob Artist',
          creator_address: '0x9876...4321',
          verified: false,
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  return (
    <div className="min-h-screen bg-black">
      {/* Hero Section */}
      <section className="relative bg-black text-white py-24 md:py-40 overflow-hidden pt-32">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-600 rounded-full mix-blend-screen filter blur-3xl animate-pulse-slow"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-blue-600 rounded-full mix-blend-screen filter blur-3xl animate-pulse-slow" style={{animationDelay: '2s'}}></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-purple-700 rounded-full mix-blend-screen filter blur-3xl animate-pulse-slow" style={{animationDelay: '4s'}}></div>
        </div>

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-5xl mx-auto text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 animate-fade-in leading-tight">
              <span className="text-cyan-400">Discover</span>, <span className="text-purple-400">Collect</span>, <span className="text-pink-400">and Sell</span>
              <br />
              <span className="text-blue-300">Extraordinary NFTs</span>
            </h1>
            <p className="text-xl md:text-2xl mb-10 text-gray-300 animate-slide-up max-w-3xl mx-auto">
              The premier marketplace for digital assets on the blockchain. Own unique paintings and research papers as NFTs.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center animate-slide-up mb-16">
              <Link to="/marketplace">
                <Button size="lg" className="bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-8 py-4 text-lg shadow-lg shadow-cyan-500/50">
                  Explore Marketplace
                </Button>
              </Link>
              <Link to="/upload">
                <Button size="lg" variant="outline" className="border-2 border-purple-400 text-purple-300 hover:bg-purple-500 hover:text-white px-8 py-4 text-lg">
                  Create NFT
                </Button>
              </Link>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto">
              <div className="text-center backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-purple-500/20">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-white">10K+</div>
                <div className="text-gray-400 text-sm md:text-base">NFTs Listed</div>
              </div>
              <div className="text-center backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-purple-500/20">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-white">5K+</div>
                <div className="text-gray-400 text-sm md:text-base">Creators</div>
              </div>
              <div className="text-center backdrop-blur-sm bg-white/5 rounded-2xl p-6 border border-purple-500/20">
                <div className="text-4xl md:text-5xl font-bold mb-2 text-white">$2M+</div>
                <div className="text-gray-400 text-sm md:text-base">Volume Traded</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom gradient fade */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-linear-to-t from-black to-transparent"></div>
      </section>

      {/* Featured NFTs */}
      <section className="py-16 bg-black">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Featured NFTs</h2>
            <p className="text-gray-300 text-lg">Discover exceptional digital assets from top creators</p>
          </div>

          {loading ? (
            <Loading message="Loading featured NFTs..." />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredAssets.map((asset) => (
                <AssetCard key={asset.id} asset={asset} showOwner={true} />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link to="/marketplace">
              <Button size="lg" className="bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700">View All Assets</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 bg-black border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">Browse Categories</h2>
            <p className="text-gray-300 text-lg">Explore our diverse collection of digital assets</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Link to="/marketplace?type=painting" className="group">
              <div className="card overflow-hidden h-64 relative">
                <img
                  src="https://images.unsplash.com/photo-1561214115-f2f134cc4912?w=800"
                  alt="Paintings"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-white text-2xl font-bold mb-2">🎨 Digital Paintings</h3>
                    <p className="text-white/90">Unique artwork from talented digital artists</p>
                  </div>
                </div>
              </div>
            </Link>

            <Link to="/marketplace?type=research-paper" className="group">
              <div className="card overflow-hidden h-64 relative">
                <img
                  src="https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?w=800"
                  alt="Research Papers"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 to-transparent flex items-end p-6">
                  <div>
                    <h3 className="text-white text-2xl font-bold mb-2">📄 Research Papers</h3>
                    <p className="text-white/90">Academic and scientific research as digital assets</p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 bg-black border-t border-gray-800">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-white">How It Works</h2>
            <p className="text-gray-300 text-lg">Start your NFT journey in three simple steps</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center">
              <div className="w-16 h-16 bg-linear-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Connect Your Wallet</h3>
              <p className="text-gray-400">
                Connect your MetaMask wallet to start buying, selling, and creating NFTs on our platform
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-linear-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Browse & Discover</h3>
              <p className="text-gray-400">
                Explore thousands of unique digital assets including paintings and research papers
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-linear-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">Buy, Sell & Rent</h3>
              <p className="text-gray-400">
                Purchase NFTs instantly or list your own digital assets for sale or rental
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      {!connected && (
        <section className="py-16 bg-linear-to-r from-primary-600 to-secondary-600 text-white">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Get Started?</h2>
            <p className="text-xl mb-8 text-primary-100">
              Connect your wallet and join thousands of creators and collectors
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="bg-white text-primary-700 hover:bg-gray-100"
            >
              Connect Wallet Now
            </Button>
          </div>
        </section>
      )}
    </div>
  );
};

export default Landing;
