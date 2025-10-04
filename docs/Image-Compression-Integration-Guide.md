# Image Compression Integration Guide

## 📊 Specifications Met

✅ **Admin API body limit**: 10MB  
✅ **Recommended per image**: <1MB (auto-compressed)  
✅ **Max dimensions**: 1920x1920px  
✅ **Default quality**: 80%  
✅ **Max images**: Unlimited (keeps total <10MB)

## 🚀 Quick Integration

### Option 1: Replace Existing FileUploader

Replace your current `FileUploader` import with the new compression-enabled version:

```tsx
// Before
import { FileUploader } from '@/components/FileUploader';

// After
import { FileUploaderWithCompression } from '@/components/FileUploaderWithCompression';
```

### Option 2: Use the Hook Directly

For custom implementations, use the compression hook:

```tsx
import { useImageCompression } from '@/lib/hooks/use-image-compression';

function QuoteForm() {
  const [images, setImages] = useState<string[]>([]);

  const { compressMultiple, isCompressing } = useImageCompression({
    maxWidth: 1920,
    maxHeight: 1920,
    quality: 0.8,
    maxSizeMB: 1,
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    const compressed = await compressMultiple(files);

    // Use compressed images (base64 data URLs)
    setImages(compressed.map((result) => result.dataUrl));
  };

  // Submit compressed images in your API call
  const payload = { ...formData, images };
}
```

## 📁 Files Created

1. **`/lib/image-compression.ts`** - Core compression utilities
2. **`/lib/hooks/use-image-compression.ts`** - React hook for compression
3. **`/components/FileUploaderWithCompression.tsx`** - Enhanced file uploader
4. **`/docs/QUOTE_UPLOAD_EXAMPLE.tsx`** - Complete working example

## 🔧 Configuration Options

```tsx
const compressionOptions = {
  maxWidth: 1920, // Max width in pixels
  maxHeight: 1920, // Max height in pixels
  quality: 0.8, // JPEG quality (0.1 - 1.0)
  maxSizeMB: 1, // Max file size after compression
  maxTotalMB: 10, // Max total size for all files
  format: 'jpeg', // Output format: 'jpeg' | 'webp' | 'png'
};
```

## 🎯 Benefits

- **Automatic Compression**: Images are compressed before upload
- **Size Optimization**: Reduces file sizes by 60-80% typically
- **Progress Tracking**: Visual feedback during compression
- **Error Handling**: Graceful handling of compression failures
- **Batch Processing**: Handles multiple files efficiently
- **Preview Support**: Shows compressed image previews
- **API Compliance**: Ensures files meet your 10MB API limit

## 🔄 Migration Steps

1. **Copy the new files** to your project
2. **Update imports** in your quote forms
3. **Test compression** with various image sizes
4. **Deploy** and monitor performance

## 📱 Mobile Optimization

The compression works especially well for mobile uploads where users often have large camera photos (5-20MB). These get automatically compressed to <1MB while maintaining good quality.

## 🐛 Troubleshooting

**Large files still failing?**

- Reduce `quality` to 0.6 or lower
- Reduce `maxWidth/maxHeight` to 1280x1280

**Compression too aggressive?**

- Increase `quality` to 0.9
- Increase `maxSizeMB` to 2MB

**Need different formats?**

- Set `format: 'webp'` for better compression
- Set `format: 'png'` for images with transparency
