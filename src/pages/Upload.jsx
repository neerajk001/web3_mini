import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useWallet } from '../context/WalletContext';
import Button from '../components/Button';

const Upload = () => {
  const navigate = useNavigate();
  const { connected, address } = useWallet();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'painting',
    price: '',
    rentPrice: '',
    royalty: '10',
    file: null,
  });
  const [preview, setPreview] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!connected) {
      alert('Please connect your wallet first');
      return;
    }

    // Validation
    if (!formData.file) {
      alert('Please select a file to upload');
      return;
    }

    if (!formData.title || !formData.description || !formData.price) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);
      
      // Simulate upload and minting process
      await new Promise((resolve) => setTimeout(resolve, 3000));
      
      alert('NFT created successfully! Your asset has been minted and listed on the marketplace.');
      navigate('/marketplace');
    } catch (error) {
      console.error('Upload failed:', error);
      alert('Failed to create NFT. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!connected) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">🔒</div>
          <h2 className="text-3xl font-bold mb-4">Wallet Not Connected</h2>
          <p className="text-gray-600 mb-6">
            You need to connect your wallet to create and list NFTs on the marketplace.
          </p>
          <Button size="lg">Connect Wallet</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Create New NFT</h1>
          <p className="text-gray-600">Upload and tokenize your digital assets</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* File Upload */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Upload File*</h3>
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-500 transition-colors">
              {preview ? (
                <div className="space-y-4">
                  <img src={preview} alt="Preview" className="max-h-64 mx-auto rounded-lg" />
                  <div>
                    <p className="text-sm text-gray-600 mb-2">{formData.file.name}</p>
                    <button
                      type="button"
                      onClick={() => {
                        setFormData((prev) => ({ ...prev, file: null }));
                        setPreview(null);
                      }}
                      className="text-red-600 hover:text-red-700 text-sm font-medium"
                    >
                      Remove File
                    </button>
                  </div>
                </div>
              ) : (
                <div>
                  <svg
                    className="w-16 h-16 mx-auto mb-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                    />
                  </svg>
                  <p className="text-gray-600 mb-2">Drag and drop your file here, or click to browse</p>
                  <p className="text-sm text-gray-500 mb-4">Supported: JPG, PNG, GIF, PDF (Max 50MB)</p>
                  <input
                    type="file"
                    id="file-upload"
                    accept="image/*,.pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label htmlFor="file-upload">
                    <span className="btn-primary cursor-pointer inline-block">Choose File</span>
                  </label>
                </div>
              )}
            </div>
          </div>

          {/* Basic Information */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Basic Information</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Title*</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="Enter asset title"
                  className="input-field"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description*</label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Describe your asset"
                  rows="4"
                  className="input-field"
                  required
                ></textarea>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category*</label>
                <select name="category" value={formData.category} onChange={handleInputChange} className="input-field">
                  <option value="painting">Digital Painting</option>
                  <option value="research-paper">Research Paper</option>
                  <option value="photo">Photography</option>
                  <option value="music">Music</option>
                  <option value="video">Video</option>
                </select>
              </div>
            </div>
          </div>

          {/* Pricing */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Sale Price (ETH)*</label>
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleInputChange}
                  placeholder="2.5"
                  step="0.001"
                  min="0"
                  className="input-field"
                  required
                />
                <p className="text-sm text-gray-500 mt-1">Price for direct purchase</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rental Price (ETH/30 days)</label>
                <input
                  type="number"
                  name="rentPrice"
                  value={formData.rentPrice}
                  onChange={handleInputChange}
                  placeholder="0.5"
                  step="0.001"
                  min="0"
                  className="input-field"
                />
                <p className="text-sm text-gray-500 mt-1">Optional rental option</p>
              </div>
            </div>
          </div>

          {/* Royalties */}
          <div className="card p-6">
            <h3 className="text-xl font-bold mb-4">Royalties</h3>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Creator Royalty (%)</label>
              <input
                type="number"
                name="royalty"
                value={formData.royalty}
                onChange={handleInputChange}
                placeholder="10"
                min="0"
                max="50"
                className="input-field"
              />
              <p className="text-sm text-gray-500 mt-1">
                You will receive {formData.royalty}% of the sale price on future secondary sales
              </p>
            </div>
          </div>

          {/* Summary */}
          <div className="card p-6 bg-gradient-to-br from-primary-50 to-secondary-50">
            <h3 className="text-xl font-bold mb-4">Summary</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Creator</span>
                <span className="font-semibold">{address?.substring(0, 10)}...</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sale Price</span>
                <span className="font-semibold">{formData.price || '0'} ETH</span>
              </div>
              {formData.rentPrice && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Rental Price</span>
                  <span className="font-semibold">{formData.rentPrice} ETH/month</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-gray-600">Creator Royalty</span>
                <span className="font-semibold">{formData.royalty}%</span>
              </div>
              <div className="flex justify-between pt-3 border-t border-primary-200">
                <span className="text-gray-600">Estimated Gas Fee</span>
                <span className="font-semibold">~0.005 ETH</span>
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="flex space-x-4">
            <Button type="button" variant="ghost" onClick={() => navigate(-1)} fullWidth>
              Cancel
            </Button>
            <Button type="submit" loading={loading} fullWidth size="lg">
              {loading ? 'Creating NFT...' : 'Create & List NFT'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Upload;
