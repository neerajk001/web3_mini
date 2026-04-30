import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ethers } from 'ethers';
import { formatPrice, getAssetTypeIcon } from '../utils/helpers';
import { useWallet } from '../context/WalletContext';
import { getContract } from '../utils/contract';
import PdfPreview from './PdfPreview';

const AssetCard = ({ asset, showOwner = false }) => {
  const {
    id,
    title,
    description,
    type,
    price,
    image_url,
    creator_name,
    owner_address,
    verified = false,
    daysRemaining = 0,
  } = asset;

  const { connected, address } = useWallet();
  const navigate = useNavigate();
  const [txLoading, setTxLoading] = useState(false);

  const isPaper = type === 'research-paper';
  const isOwner = connected && address?.toLowerCase() === owner_address?.toLowerCase();
  const isLeased = daysRemaining > 0;

  const handleBuy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!connected) { alert('Please connect your wallet first'); return; }
    try {
      setTxLoading(true);
      const contract = await getContract();
      const tx = await contract.buyPainting(id, { value: ethers.parseEther(price) });
      await tx.wait();
      alert('Purchase successful! The painting is now yours.');
      navigate('/profile');
    } catch (err) {
      console.error('Purchase failed:', err);
      alert(err?.reason || err?.message || 'Transaction failed. Please try again.');
    } finally {
      setTxLoading(false);
    }
  };

  const handleRent = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!connected) { alert('Please connect your wallet first'); return; }
    try {
      setTxLoading(true);
      const contract = await getContract();
      const tx = await contract.leasePaper(id, { value: ethers.parseEther(price) });
      await tx.wait();
      alert('Rental successful! You now have 30-day access to this paper.');
    } catch (err) {
      console.error('Rental failed:', err);
      alert(err?.reason || err?.message || 'Transaction failed. Please try again.');
    } finally {
      setTxLoading(false);
    }
  };

  return (
    <div className="group bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden hover:scale-105 hover:border-purple-500/50 transform transition-all duration-300 shadow-lg hover:shadow-purple-500/20">
      {/* Clickable area — navigates to asset detail */}
      <Link to={`/asset/${id}`} className="block">
        {/* Image */}
        <div className="relative h-64 bg-black overflow-hidden">
          {isPaper ? (
            <PdfPreview
              url={image_url}
              className="w-full h-full"
            />
          ) : (
            <img
              src={image_url || 'https://via.placeholder.com/400x300?text=NFT'}
              alt={title}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
            />
          )}

          {/* Type Badge */}
          <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1 text-white border border-white/10">
            <span>{getAssetTypeIcon(type)}</span>
            <span className="capitalize">{type?.replace('-', ' ')}</span>
          </div>

          {/* Verified Badge */}
          {verified && (
            <div className="absolute top-3 right-3 bg-cyan-500 text-white px-2 py-1 rounded-full text-xs font-bold flex items-center space-x-1 shadow-lg shadow-cyan-500/50">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span>Verified</span>
            </div>
          )}
        </div>

        {/* Content */}
        <div className="px-5 pt-5 pb-3">
          <h3 className="font-bold text-lg mb-2 text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{description}</p>

          {showOwner && creator_name && (
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-6 h-6 bg-linear-to-br from-cyan-400 to-purple-400 rounded-full"></div>
              <span className="text-sm text-gray-400">{creator_name}</span>
            </div>
          )}

          {/* Price row */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
            <div>
              <p className="text-xs text-gray-500 mb-1">{isPaper ? 'Lease Price / 30 days' : 'Price'}</p>
              <p className="font-bold text-cyan-400 text-lg">{formatPrice(price)}</p>
            </div>
            <span className="text-xs text-gray-500 bg-gray-800 px-2 py-1 rounded-lg">
              {isPaper ? '📄 Paper' : '🖼️ Painting'}
            </span>
          </div>
        </div>
      </Link>

      {/* Action Button — outside Link to avoid nested anchor */}
      <div className="px-5 pb-5 pt-1">
        {isLeased ? (
          <div className="w-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-sm font-semibold py-2.5 rounded-xl text-center">
            ⏱️ {daysRemaining} day{daysRemaining !== 1 ? 's' : ''} left
          </div>
        ) : isOwner ? (
          <div className="w-full bg-green-500/10 border border-green-500/30 text-green-400 text-sm font-semibold py-2.5 rounded-xl text-center">
            ✓ You own this
          </div>
        ) : isPaper ? (
          <button
            onClick={handleRent}
            disabled={txLoading}
            className="w-full bg-linear-to-r from-violet-600 to-purple-700 hover:from-violet-700 hover:to-purple-800 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-purple-500/30 text-sm"
          >
            {txLoading ? (
              <>
                <svg className="animate-spin w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {connected ? `Rent for ${formatPrice(price)}` : 'Connect Wallet to Rent'}
              </>
            )}
          </button>
        ) : (
          <button
            onClick={handleBuy}
            disabled={txLoading}
            className="w-full bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl flex items-center justify-center gap-2 transition-all shadow-lg shadow-cyan-500/30 text-sm"
          >
            {txLoading ? (
              <>
                <svg className="animate-spin w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                </svg>
                Processing...
              </>
            ) : (
              <>
                <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-4H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                {connected ? `Buy for ${formatPrice(price)}` : 'Connect Wallet to Buy'}
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
};

export default AssetCard;
