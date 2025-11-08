import { Link } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import { formatAddress } from '../utils/helpers';
import { useState } from 'react';

const Header = () => {
  const { address, connected, connect, disconnect, loading } = useWallet();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleWalletClick = async () => {
    if (connected) {
      disconnect();
    } else {
      await connect();
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 px-4 py-4">
      <nav className="container mx-auto bg-black/80 backdrop-blur-md rounded-full px-6 py-3 shadow-lg border-2 border-white">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <span className="text-xl font-bold text-white">
              NFT Marketplace
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-300 hover:text-white font-medium transition-colors">
              Home
            </Link>
            <Link to="/marketplace" className="text-gray-300 hover:text-white font-medium transition-colors">
              Marketplace
            </Link>
            <Link to="/upload" className="text-gray-300 hover:text-white font-medium transition-colors">
              Create
            </Link>
            {connected && (
              <Link to="/profile" className="text-gray-300 hover:text-white font-medium transition-colors">
                Profile
              </Link>
            )}
          </div>  

          {/* Wallet Buttons */}
          <div className="hidden md:flex items-center space-x-3">
            {!connected ? (
              <>
                <button
                  onClick={handleWalletClick}
                  disabled={loading}
                  className="text-white font-medium px-5 py-2 rounded-full hover:bg-white/10 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Connecting...' : 'Sign in'}
                </button>
                <button
                  onClick={handleWalletClick}
                  disabled={loading}
                  className="bg-lime-400 hover:bg-lime-500 text-black font-semibold px-6 py-2 rounded-full transition-all duration-200 shadow-lg shadow-lime-400/30 hover:shadow-lime-400/50 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                >
                  {loading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                      <span>Connecting...</span>
                    </>
                  ) : (
                    <>
                      <span>Get Started</span>
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </>
                  )}
                </button>
              </>
            ) : (
              <button
                onClick={handleWalletClick}
                className="bg-lime-400 hover:bg-lime-500 text-black font-semibold px-6 py-2 rounded-full transition-all duration-200 shadow-lg shadow-lime-400/30 hover:shadow-lime-400/50 flex items-center space-x-2"
              >
                <div className="w-2 h-2 bg-green-600 rounded-full"></div>
                <span>{formatAddress(address)}</span>
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="md:hidden mt-4 pb-4 space-y-3 animate-fade-in bg-black/60 backdrop-blur-md rounded-2xl p-4 border border-white/10">
            <Link
              to="/"
              className="block text-gray-300 hover:text-white font-medium transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/marketplace"
              className="block text-gray-300 hover:text-white font-medium transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Marketplace
            </Link>
            <Link
              to="/upload"
              className="block text-gray-300 hover:text-white font-medium transition-colors py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Create
            </Link>
            {connected && (
              <Link
                to="/profile"
                className="block text-gray-300 hover:text-white font-medium transition-colors py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                Profile
              </Link>
            )}
            <button
              onClick={handleWalletClick}
              disabled={loading}
              className="w-full bg-lime-400 hover:bg-lime-500 text-black font-semibold py-2 px-6 rounded-full transition-all duration-200 shadow-md disabled:opacity-50"
            >
              {loading ? 'Connecting...' : connected ? formatAddress(address) : 'Get Started'}
            </button>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
