import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { useUser } from '../context/UserContext';
import AssetCard from '../components/AssetCard';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { formatPrice, formatAddress, formatDate } from '../utils/helpers';

const Profile = () => {
  const navigate = useNavigate();
  const { connected, address, balance } = useWallet();
  const { profile, transactions } = useUser();
  const [activeTab, setActiveTab] = useState('owned');
  const [loading, setLoading] = useState(true);
  const [ownedAssets, setOwnedAssets] = useState([]);
  const [listedAssets, setListedAssets] = useState([]);

  useEffect(() => {
    if (!connected) {
      navigate('/');
      return;
    }

    // Mock data - replace with actual API calls
    setTimeout(() => {
      setOwnedAssets([
        {
          id: '1',
          title: 'Abstract Dreams',
          description: 'A vibrant digital painting',
          type: 'painting',
          price: '2.5',
          image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800',
          creator_name: 'You',
          verified: true,
        },
        {
          id: '3',
          title: 'Neon Cityscape',
          description: 'Futuristic city illuminated',
          type: 'painting',
          price: '3.2',
          image_url: 'https://images.unsplash.com/photo-1550684376-efcbd6e3f031?w=800',
          creator_name: 'You',
          verified: false,
        },
      ]);

      setListedAssets([
        {
          id: '5',
          title: 'Cosmic Explosion',
          description: 'Abstract representation',
          type: 'painting',
          price: '4.5',
          image_url: 'https://images.unsplash.com/photo-1549887534-1541e9326642?w=800',
          creator_name: 'You',
          verified: true,
        },
      ]);

      setLoading(false);
    }, 800);
  }, [connected, navigate]);

  if (!connected) {
    return null;
  }

  const mockTransactions = [
    {
      id: 1,
      type: 'Purchase',
      asset: 'Abstract Dreams',
      price: '2.5',
      from: '0x1234567890abcdef1234567890abcdef12345678',
      to: address,
      date: '2024-03-15T10:30:00Z',
      status: 'Completed',
    },
    {
      id: 2,
      type: 'Sale',
      asset: 'Digital Landscape',
      price: '1.8',
      from: address,
      to: '0xabcdefabcdefabcdefabcdefabcdefabcdefabcd',
      date: '2024-03-10T14:20:00Z',
      status: 'Completed',
    },
    {
      id: 3,
      type: 'Mint',
      asset: 'Cosmic Explosion',
      price: '0',
      from: '0x0000000000000000000000000000000000000000',
      to: address,
      date: '2024-03-05T09:15:00Z',
      status: 'Completed',
    },
  ];

  const stats = [
{
  label: 'Wallet Balance',
  value: connected
    ? `${Number(balance).toFixed(4)} ETH`
    : 'Not connected',
  icon: '💰',
},
    { label: 'Owned NFTs', value: ownedAssets.length, icon: '🖼️' },
    { label: 'Listed Items', value: listedAssets.length, icon: '📋' },
    { label: 'Total Transactions', value: mockTransactions.length, icon: '📊' },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pt-24 pb-8">
      <div className="container mx-auto px-4">
        {/* Profile Header */}
        <div className="card p-8 mb-8">
          <div className="flex flex-col md:flex-row items-center md:items-start space-y-4 md:space-y-0 md:space-x-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center text-white text-4xl font-bold">
              {address?.substring(2, 4).toUpperCase()}
            </div>

            {/* Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold mb-2">My Profile</h1>
              <div className="flex items-center justify-center md:justify-start space-x-2 mb-3">
                <p className="text-gray-600 font-mono">{formatAddress(address)}</p>
                <button
                  onClick={() => navigator.clipboard.writeText(address)}
                  className="text-primary-600 hover:text-primary-700"
                  title="Copy address"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </button>
              </div>
              {profile?.bio && <p className="text-gray-600">{profile.bio}</p>}
            </div>

            {/* Actions */}
            <div className="flex space-x-3">
              <Button onClick={() => navigate('/upload')}>Create NFT</Button>
              <Button variant="outline">Edit Profile</Button>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <div key={index} className="card p-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-3xl">{stat.icon}</span>
                <span className="text-2xl font-bold text-primary-600">{stat.value}</span>
              </div>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <div className="flex space-x-8">
              <button
                onClick={() => setActiveTab('owned')}
                className={`pb-4 px-1 border-b-2 font-semibold transition-colors ${
                  activeTab === 'owned'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Owned ({ownedAssets.length})
              </button>
              <button
                onClick={() => setActiveTab('listed')}
                className={`pb-4 px-1 border-b-2 font-semibold transition-colors ${
                  activeTab === 'listed'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Listed ({listedAssets.length})
              </button>
              <button
                onClick={() => setActiveTab('transactions')}
                className={`pb-4 px-1 border-b-2 font-semibold transition-colors ${
                  activeTab === 'transactions'
                    ? 'border-primary-600 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                Transactions ({mockTransactions.length})
              </button>
            </div>
          </div>
        </div>

        {/* Tab Content */}
        {loading ? (
          <Loading message="Loading your assets..." />
        ) : (
          <>
            {/* Owned Assets */}
            {activeTab === 'owned' && (
              <div>
                {ownedAssets.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">🖼️</div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">No owned NFTs yet</h3>
                    <p className="text-gray-600 mb-6">Start collecting unique digital assets</p>
                    <Button onClick={() => navigate('/marketplace')}>Browse Marketplace</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {ownedAssets.map((asset) => (
                      <AssetCard key={asset.id} asset={asset} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Listed Assets */}
            {activeTab === 'listed' && (
              <div>
                {listedAssets.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">📋</div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">No listed items</h3>
                    <p className="text-gray-600 mb-6">Create and list your first NFT</p>
                    <Button onClick={() => navigate('/upload')}>Create NFT</Button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {listedAssets.map((asset) => (
                      <AssetCard key={asset.id} asset={asset} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Transactions */}
            {activeTab === 'transactions' && (
              <div className="card">
                {mockTransactions.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-2xl font-bold text-gray-700 mb-2">No transactions yet</h3>
                    <p className="text-gray-600">Your transaction history will appear here</p>
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Type
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Asset
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Price
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            From/To
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Date
                          </th>
                          <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {mockTransactions.map((tx) => (
                          <tr key={tx.id} className="hover:bg-gray-50">
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span
                                className={`px-3 py-1 rounded-full text-xs font-semibold ${
                                  tx.type === 'Purchase'
                                    ? 'bg-green-100 text-green-700'
                                    : tx.type === 'Sale'
                                    ? 'bg-blue-100 text-blue-700'
                                    : 'bg-purple-100 text-purple-700'
                                }`}
                              >
                                {tx.type}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap font-medium">{tx.asset}</td>
                            <td className="px-6 py-4 whitespace-nowrap text-primary-600 font-semibold">
                              {tx.price === '0' ? 'N/A' : formatPrice(tx.price)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              {tx.type === 'Purchase' ? (
                                <span className="text-gray-600">From: {formatAddress(tx.from)}</span>
                              ) : (
                                <span className="text-gray-600">To: {formatAddress(tx.to)}</span>
                              )}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                              {formatDate(tx.date)}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className="text-green-600 font-semibold">✓ {tx.status}</span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
