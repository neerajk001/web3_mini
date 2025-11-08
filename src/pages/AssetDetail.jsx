import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { formatPrice, formatAddress, formatDate } from '../utils/helpers';
import Button from '../components/Button';
import Modal from '../components/Modal';
import Loading from '../components/Loading';

const AssetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { connected, address } = useWallet();
  const [asset, setAsset] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showBuyModal, setShowBuyModal] = useState(false);
  const [showRentModal, setShowRentModal] = useState(false);
  const [transactionLoading, setTransactionLoading] = useState(false);

  useEffect(() => {
    // Mock asset data - replace with actual API call
    setTimeout(() => {
      setAsset({
        id: id,
        title: 'Abstract Dreams',
        description:
          'A vibrant digital painting exploring the boundaries of imagination and creativity. This piece represents the fusion of traditional art techniques with modern digital tools, creating a unique visual experience that transcends conventional artistic boundaries.',
        type: 'painting',
        price: '2.5',
        rentPrice: '0.5',
        image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
        creator_name: 'Alice Creator',
        creator_address: '0x1234567890abcdef1234567890abcdef12345678',
        owner_name: 'Current Owner',
        owner_address: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
        verified: true,
        created_at: '2024-01-15T10:30:00Z',
        category: 'Digital Art',
        dimensions: '4000x3000 px',
        fileSize: '15.2 MB',
        format: 'PNG',
        royalty: '10%',
        ownershipHistory: [
          {
            id: 1,
            from: '0x0000000000000000000000000000000000000000',
            to: '0x1234567890abcdef1234567890abcdef12345678',
            price: '0',
            date: '2024-01-15T10:30:00Z',
            type: 'Minted',
          },
          {
            id: 2,
            from: '0x1234567890abcdef1234567890abcdef12345678',
            to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
            price: '2.0',
            date: '2024-02-20T14:15:00Z',
            type: 'Sale',
          },
        ],
      });
      setLoading(false);
    }, 800);
  }, [id]);

  const handleBuy = async () => {
    if (!connected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setTransactionLoading(true);
      // Simulate transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert('Purchase successful! NFT has been transferred to your wallet.');
      setShowBuyModal(false);
      navigate('/profile');
    } catch (error) {
      console.error('Purchase failed:', error);
      alert('Transaction failed. Please try again.');
    } finally {
      setTransactionLoading(false);
    }
  };

  const handleRent = async () => {
    if (!connected) {
      alert('Please connect your wallet first');
      return;
    }

    try {
      setTransactionLoading(true);
      // Simulate transaction
      await new Promise((resolve) => setTimeout(resolve, 2000));
      alert('Rental successful! You can now access this asset.');
      setShowRentModal(false);
    } catch (error) {
      console.error('Rental failed:', error);
      alert('Transaction failed. Please try again.');
    } finally {
      setTransactionLoading(false);
    }
  };

  if (loading) {
    return <Loading fullScreen message="Loading asset details..." />;
  }

  if (!asset) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Asset not found</h2>
          <Button onClick={() => navigate('/marketplace')}>Back to Marketplace</Button>
        </div>
      </div>
    );
  }

  const isOwner = connected && address?.toLowerCase() === asset.owner_address?.toLowerCase();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-primary-600 mb-6 transition-colors"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left: Image */}
          <div>
            <div className="card sticky top-24">
              <img
                src={asset.image_url}
                alt={asset.title}
                className="w-full h-auto rounded-xl"
              />
              
              {/* Asset Badges */}
              <div className="flex items-center gap-2 mt-4">
                {asset.verified && (
                  <div className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <span>Verified</span>
                  </div>
                )}
                <div className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold capitalize">
                  {asset.type?.replace('-', ' ')}
                </div>
              </div>
            </div>
          </div>

          {/* Right: Details */}
          <div>
            <div className="space-y-6">
              {/* Title & Description */}
              <div>
                <h1 className="text-4xl font-bold mb-4">{asset.title}</h1>
                <p className="text-gray-600 text-lg leading-relaxed">{asset.description}</p>
              </div>

              {/* Creator & Owner */}
              <div className="grid grid-cols-2 gap-4">
                <div className="card p-4">
                  <p className="text-sm text-gray-500 mb-2">Creator</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary-400 to-secondary-400 rounded-full"></div>
                    <div>
                      <p className="font-semibold">{asset.creator_name}</p>
                      <p className="text-sm text-gray-500">{formatAddress(asset.creator_address)}</p>
                    </div>
                  </div>
                </div>

                <div className="card p-4">
                  <p className="text-sm text-gray-500 mb-2">Current Owner</p>
                  <div className="flex items-center space-x-2">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-400 rounded-full"></div>
                    <div>
                      <p className="font-semibold">{isOwner ? 'You' : asset.owner_name}</p>
                      <p className="text-sm text-gray-500">{formatAddress(asset.owner_address)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Price & Actions */}
              <div className="card p-6 bg-gradient-to-br from-primary-50 to-secondary-50">
                <div className="mb-6">
                  <p className="text-sm text-gray-600 mb-2">Current Price</p>
                  <p className="text-4xl font-bold text-primary-700">{formatPrice(asset.price)}</p>
                </div>

                {!isOwner && (
                  <div className="space-y-3">
                    <Button
                      fullWidth
                      size="lg"
                      onClick={() => setShowBuyModal(true)}
                      disabled={!connected}
                    >
                      {connected ? 'Buy Now' : 'Connect Wallet to Buy'}
                    </Button>
                    <Button
                      fullWidth
                      size="lg"
                      variant="outline"
                      onClick={() => setShowRentModal(true)}
                      disabled={!connected}
                    >
                      {connected ? `Rent for ${formatPrice(asset.rentPrice)}` : 'Connect Wallet to Rent'}
                    </Button>
                  </div>
                )}

                {isOwner && (
                  <div className="bg-green-100 text-green-800 p-4 rounded-lg text-center font-semibold">
                    ✓ You own this NFT
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="card p-6">
                <h3 className="text-xl font-bold mb-4">Asset Details</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Category</span>
                    <span className="font-semibold">{asset.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Dimensions</span>
                    <span className="font-semibold">{asset.dimensions}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">File Size</span>
                    <span className="font-semibold">{asset.fileSize}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Format</span>
                    <span className="font-semibold">{asset.format}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Creator Royalty</span>
                    <span className="font-semibold">{asset.royalty}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Created</span>
                    <span className="font-semibold">{formatDate(asset.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Ownership History */}
              <div className="card p-6">
                <h3 className="text-xl font-bold mb-4">Ownership History</h3>
                <div className="space-y-4">
                  {asset.ownershipHistory.map((history) => (
                    <div key={history.id} className="border-l-4 border-primary-500 pl-4 py-2">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold text-primary-600">{history.type}</span>
                        <span className="text-sm text-gray-500">{formatDate(history.date)}</span>
                      </div>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>From: {formatAddress(history.from)}</p>
                        <p>To: {formatAddress(history.to)}</p>
                        {history.price !== '0' && (
                          <p className="font-semibold text-primary-600">
                            Price: {formatPrice(history.price)}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Buy Modal */}
      <Modal isOpen={showBuyModal} onClose={() => setShowBuyModal(false)} title="Confirm Purchase">
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">{asset.title}</h4>
            <p className="text-sm text-gray-600 mb-4">{asset.description}</p>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Price</span>
              <span className="text-2xl font-bold text-primary-600">{formatPrice(asset.price)}</span>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> This transaction will transfer ownership of the NFT to your wallet. Make sure you
              have enough ETH to cover the price and gas fees.
            </p>
          </div>

          <div className="flex space-x-3">
            <Button variant="ghost" onClick={() => setShowBuyModal(false)} fullWidth>
              Cancel
            </Button>
            <Button onClick={handleBuy} loading={transactionLoading} fullWidth>
              {transactionLoading ? 'Processing...' : 'Confirm Purchase'}
            </Button>
          </div>
        </div>
      </Modal>

      {/* Rent Modal */}
      <Modal isOpen={showRentModal} onClose={() => setShowRentModal(false)} title="Rent Asset">
        <div className="space-y-6">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-semibold mb-2">{asset.title}</h4>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600">Rental Price (30 days)</span>
                <span className="text-xl font-bold text-primary-600">{formatPrice(asset.rentPrice)}</span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Rental Terms:</strong> You will have access to this asset for 30 days. The asset will remain in
              the owner's wallet, but you'll receive a rental certificate NFT.
            </p>
          </div>

          <div className="flex space-x-3">
            <Button variant="ghost" onClick={() => setShowRentModal(false)} fullWidth>
              Cancel
            </Button>
            <Button onClick={handleRent} loading={transactionLoading} fullWidth>
              {transactionLoading ? 'Processing...' : 'Confirm Rental'}
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default AssetDetail;
