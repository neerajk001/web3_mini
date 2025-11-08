import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { WalletProvider } from './context/WalletContext';
import { UserProvider } from './context/UserContext';
import Header from './components/Header';
import Footer from './components/Footer';
import Landing from './pages/Landing';
import Marketplace from './pages/Marketplace';
import AssetDetail from './pages/AssetDetail';
import Upload from './pages/Upload';
import Profile from './pages/Profile';

function App() {
  return (
    <Router>
      <WalletProvider>
        <UserProvider>
          <div className="flex flex-col min-h-screen bg-black">
            <Header />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Landing />} />
                <Route path="/marketplace" element={<Marketplace />} />
                <Route path="/asset/:id" element={<AssetDetail />} />
                <Route path="/upload" element={<Upload />} />
                <Route path="/profile" element={<Profile />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </UserProvider>
      </WalletProvider>
    </Router>
  );
}

export default App;
