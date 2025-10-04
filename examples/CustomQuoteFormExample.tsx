// Example: Custom Quote Form with Image Compression Hook

'use client';
import { useState } from 'react';
import { useImageCompression } from '@/lib/hooks/use-image-compression';

export default function CustomQuoteForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    images: [] as string[], // Base64 compressed images
  });

  // 🎯 Your exact configuration
  const { compressMultiple, isCompressing } = useImageCompression({
    maxWidth: 1920,
    maxHeight: 1920,
    quality: 0.8,
    maxSizeMB: 0.8, // Your preferred size
  });

  // 🚀 Auto-resize handler
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    try {
      const resized = await compressMultiple(files); // Auto-resize!

      // Extract base64 data URLs for your API
      const imageDataUrls = resized.map((result) => result.dataUrl);

      setFormData((prev) => ({
        ...prev,
        images: imageDataUrls,
      }));

      console.log('✅ Images compressed and ready:', resized);
    } catch (error) {
      console.error('❌ Compression failed:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // 📤 Submit with compressed images
    const payload = {
      ...formData,
      images: formData.images, // Already compressed!
    };

    const response = await fetch('/api/quotes/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    console.log('🎉 Quote submitted with compressed images!');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Your form fields */}
      <input
        type="text"
        value={formData.name}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, name: e.target.value }))
        }
        placeholder="Name"
        required
      />

      <input
        type="email"
        value={formData.email}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, email: e.target.value }))
        }
        placeholder="Email"
        required
      />

      <textarea
        value={formData.message}
        onChange={(e) =>
          setFormData((prev) => ({ ...prev, message: e.target.value }))
        }
        placeholder="Message"
        required
      />

      {/* 📸 Image Upload with Auto-Compression */}
      <div>
        <label>Project Photos (auto-compressed to &lt;0.8MB each)</label>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          disabled={isCompressing}
        />
        {isCompressing && <p>🔄 Compressing images...</p>}
        {formData.images.length > 0 && (
          <p>✅ {formData.images.length} images ready for upload</p>
        )}
      </div>

      <button type="submit" disabled={isCompressing}>
        {isCompressing ? 'Compressing...' : 'Submit Quote'}
      </button>
    </form>
  );
}
