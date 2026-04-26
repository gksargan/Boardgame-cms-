import React, { useState, useEffect } from 'react';
import { Upload, X, Star, Trash2, Loader } from 'lucide-react';

export default function GameImageGallery({ gameId, isAdmin = false, onImageUpload }) {
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploadError, setUploadError] = useState('');
  const [primaryImageId, setPrimaryImageId] = useState(null);

  // For demo purposes, we're using placeholder images
  // In production, you'd use Supabase Storage
  const placeholderImages = [
    'https://images.unsplash.com/photo-1516975080664-ed2fc6a32937?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1588195538326-c5b1e9f80a1b?w=400&h=300&fit=crop',
    'https://images.unsplash.com/photo-1571894588268-c86f7d8c4d8b?w=400&h=300&fit=crop',
  ];

  useEffect(() => {
    // Initialize with placeholder images
    setImages(
      placeholderImages.map((url, idx) => ({
        id: `demo-${idx}`,
        image_url: url,
        is_primary: idx === 0,
      }))
    );
    setPrimaryImageId(`demo-0`);
  }, [gameId]);

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file
    if (!file.type.startsWith('image/')) {
      setUploadError('Please select an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('Image must be smaller than 5MB');
      return;
    }

    try {
      setLoading(true);
      setUploadError('');

      // Convert to base64 for demo
      const reader = new FileReader();
      reader.onloadend = () => {
        const newImage = {
          id: `upload-${Date.now()}`,
          image_url: reader.result,
          is_primary: false,
        };
        setImages([...images, newImage]);
        if (onImageUpload) {
          onImageUpload(newImage);
        }
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Error uploading image:', error);
      setUploadError('Failed to upload image');
    } finally {
      setLoading(false);
    }
  };

  const handleSetPrimary = (imageId) => {
    setPrimaryImageId(imageId);
    setImages(
      images.map(img => ({
        ...img,
        is_primary: img.id === imageId,
      }))
    );
  };

  const handleDeleteImage = (imageId) => {
    if (!window.confirm('Delete this image?')) return;
    
    setImages(images.filter(img => img.id !== imageId));
    if (primaryImageId === imageId) {
      setPrimaryImageId(images[0]?.id);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md border border-slate-200 p-6">
      <h3 className="text-lg font-bold text-slate-900 mb-4">Game Images</h3>

      {/* Upload Area */}
      {isAdmin && (
        <div className="mb-6">
          <label className="block">
            <div className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-purple-400 hover:bg-purple-50 transition">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={loading}
                className="hidden"
              />
              <div className="flex flex-col items-center gap-2">
                {loading ? (
                  <Loader className="w-8 h-8 text-purple-500 animate-spin" />
                ) : (
                  <Upload className="w-8 h-8 text-slate-400" />
                )}
                <div>
                  <p className="font-medium text-slate-900">
                    {loading ? 'Uploading...' : 'Click to upload image'}
                  </p>
                  <p className="text-sm text-slate-600">
                    PNG, JPG, GIF up to 5MB
                  </p>
                </div>
              </div>
            </div>
          </label>
          {uploadError && (
            <p className="text-red-500 text-sm mt-2">{uploadError}</p>
          )}
        </div>
      )}

      {/* Images Grid */}
      {images.length === 0 ? (
        <div className="text-center py-8 text-slate-600">
          <p>No images yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map(image => (
            <div
              key={image.id}
              className={`relative rounded-lg overflow-hidden border-2 transition ${
                image.is_primary
                  ? 'border-yellow-400 shadow-lg'
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Image */}
              <img
                src={image.image_url}
                alt="Game"
                className="w-full h-40 object-cover"
              />

              {/* Primary Badge */}
              {image.is_primary && (
                <div className="absolute top-2 right-2 bg-yellow-400 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                  <Star className="w-3 h-3 fill-white" /> Primary
                </div>
              )}

              {/* Actions */}
              {isAdmin && (
                <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 flex gap-2 translate-y-full group-hover:translate-y-0 opacity-0 hover:opacity-100 transition">
                  {!image.is_primary && (
                    <button
                      onClick={() => handleSetPrimary(image.id)}
                      className="flex-1 px-2 py-1 bg-yellow-500 text-white rounded text-xs font-medium hover:bg-yellow-600 transition flex items-center justify-center gap-1"
                      title="Set as primary"
                    >
                      <Star className="w-3 h-3" /> Set Primary
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteImage(image.id)}
                    className="flex-1 px-2 py-1 bg-red-500 text-white rounded text-xs font-medium hover:bg-red-600 transition flex items-center justify-center gap-1"
                    title="Delete image"
                  >
                    <Trash2 className="w-3 h-3" /> Delete
                  </button>
                </div>
              )}

              {/* Hover Overlay for Actions */}
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition flex items-center justify-center gap-2 group">
                {isAdmin && (
                  <>
                    {!image.is_primary && (
                      <button
                        onClick={() => handleSetPrimary(image.id)}
                        className="p-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition"
                        title="Set as primary"
                      >
                        <Star className="w-4 h-4" />
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteImage(image.id)}
                      className="p-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
                      title="Delete image"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200 text-sm text-blue-700">
        <p>
          💡 <strong>Tip:</strong> The primary image appears on the game card. Upload 3-5 images to showcase your game well.
        </p>
      </div>
    </div>
  );
}
