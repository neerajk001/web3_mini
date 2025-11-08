import { Link } from 'react-router-dom';
import { formatPrice, getAssetTypeIcon } from '../utils/helpers';

const AssetCard = ({ asset, showOwner = false }) => {
  const {
    id,
    title,
    description,
    type,
    price,
    image_url,
    creator_name,
    creator_address,
    verified = false,
  } = asset;

  return (
    <Link to={`/asset/${id}`} className="group">
      <div className="bg-gray-900/90 backdrop-blur-sm border border-gray-800 rounded-2xl overflow-hidden hover:scale-105 hover:border-purple-500/50 transform transition-all duration-300 shadow-lg hover:shadow-purple-500/20">
        {/* Image */}
        <div className="relative h-64 bg-black overflow-hidden">
          <img
            src={image_url || 'https://via.placeholder.com/400x300?text=NFT'}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          
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
        <div className="p-5">
          <h3 className="font-bold text-lg mb-2 text-white group-hover:text-cyan-400 transition-colors line-clamp-1">
            {title}
          </h3>
          <p className="text-gray-400 text-sm mb-4 line-clamp-2">{description}</p>

          {/* Creator */}
          {showOwner && creator_name && (
            <div className="flex items-center space-x-2 mb-3">
              <div className="w-6 h-6 bg-linear-to-br from-cyan-400 to-purple-400 rounded-full"></div>
              <span className="text-sm text-gray-400">{creator_name}</span>
            </div>
          )}

          {/* Price */}
          <div className="flex items-center justify-between pt-3 border-t border-gray-700/50">
            <div>
              <p className="text-xs text-gray-500 mb-1">Price</p>
              <p className="font-bold text-cyan-400 text-lg">{formatPrice(price)}</p>
            </div>
            <button className="bg-linear-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors shadow-lg shadow-cyan-500/30">
              View Details
            </button>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default AssetCard;
