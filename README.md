# NFT Marketplace - Frontend

A modern, full-featured NFT marketplace built with React, Tailwind CSS, and Web3 technologies. This platform allows users to buy, sell, and rent digital assets like paintings and research papers on the blockchain.

## 🚀 Features

### Core Functionality
- **MetaMask Integration**: Seamless wallet connection using ethers.js
- **NFT Marketplace**: Browse, search, and filter digital assets
- **Buy & Rent**: Purchase or rent NFTs with customizable pricing
- **Create NFTs**: Upload and tokenize digital assets with metadata
- **User Profiles**: Personal dashboard with owned assets and transaction history
- **Ownership Verification**: Display authenticity badges and ownership history

### User Interface
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Modern UI/UX**: Clean, professional marketplace aesthetic
- **Smooth Animations**: Engaging transitions and loading states
- **Real-time Updates**: Dynamic state management with React Context

### Asset Management
- **Multi-Category Support**: Digital paintings and research papers
- **Advanced Filtering**: Filter by type, price range, and more
- **Search Functionality**: Find assets by title and description
- **Asset Details**: Comprehensive metadata and ownership history

## 📋 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v16 or higher)
- npm or yarn
- MetaMask browser extension

## 🛠️ Installation

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Start the development server**
   ```bash
   npm run dev
   ```

3. **Open your browser**
   Navigate to `http://localhost:5173`

## 📦 Required Dependencies

Install these if not already present:
```bash
npm install react-router-dom ethers
```

**Note:** This is a **frontend-only** implementation with mock data. No backend or database is required for development.

## 🏗️ Project Structure

```
web3-saas/
├── src/
│   ├── components/      # Reusable UI components
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   ├── Button.jsx
│   │   ├── AssetCard.jsx
│   │   ├── Modal.jsx
│   │   └── Loading.jsx
│   ├── context/         # React Context providers
│   │   ├── WalletContext.jsx
│   │   └── UserContext.jsx
│   ├── pages/           # Page components
│   │   ├── Landing.jsx
│   │   ├── Marketplace.jsx
│   │   ├── AssetDetail.jsx
│   │   ├── Upload.jsx
│   │   └── Profile.jsx
│   ├── utils/           # Utility functions
│   │   ├── helpers.js
│   │   ├── wallet.js
│   │   └── supabase.js
│   └── App.jsx          # Main app with routing
├── tailwind.config.js   # Tailwind configuration
└── postcss.config.js    # PostCSS configuration
```

## 🎯 Usage

### For Collectors
1. Connect your MetaMask wallet
2. Browse the marketplace
3. Click on an asset to view details
4. Buy or rent NFTs

### For Creators
1. Connect your MetaMask wallet
2. Navigate to "Create" page
3. Upload your digital asset
4. Fill in metadata and pricing
5. Create and list your NFT

## 🔧 Development

### Available Scripts
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

## 🚨 Important Notes

- ✅ **Frontend-only implementation** - No backend or database required
- ✅ **Mock data** - All NFT data is simulated for demonstration
- ✅ **MetaMask ready** - Wallet connection works, transactions are simulated
- ⚠️ **For production** - Add smart contracts and blockchain integration

### What's Included (Frontend Only)
- Complete UI/UX for NFT marketplace
- Wallet connection with MetaMask
- Mock NFT browsing and filtering
- Simulated buy/rent/create flows
- User profile and transaction history (mock data)

### What You'll Need to Add for Production
- Smart contracts (ERC-721/ERC-1155)
- IPFS for decentralized storage
- Backend API (optional)
- Real blockchain transactions

## 📝 License

MIT License
