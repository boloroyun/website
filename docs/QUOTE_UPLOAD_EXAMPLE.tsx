/**
 * Complete Working Example: Quote Form with Image Compression
 *
 * This example shows how to integrate image compression into your quote request form.
 *
 * 📊 Limits & Configuration:
 * - Admin API body limit: 10MB
 * - Recommended per image: <1MB (auto-compressed)
 * - Max dimensions: 1920x1920px
 * - Default quality: 80%
 * - Max images: Unlimited (keep total <10MB)
 */

'use client';

import { useState } from 'react';
import { useImageCompression } from '@/lib/hooks/use-image-compression';
import { formatFileSize } from '@/lib/image-compression';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Upload,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  ImageIcon,
  FileIcon,
} from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface QuoteFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  images: string[]; // Base64 encoded compressed images
}

export default function QuoteFormWithCompression() {
  const [formData, setFormData] = useState<QuoteFormData>({
    name: '',
    email: '',
    phone: '',
    message: '',
    images: [],
  });

  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [compressedImages, setCompressedImages] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize image compression hook with optimal settings
  const { compressMultiple, isCompressing, progress, error, clearError } =
    useImageCompression({
      maxWidth: 1920,
      maxHeight: 1920,
      quality: 0.8,
      maxSizeMB: 1,
      maxTotalMB: 10,
      onProgress: (progress) => {
        console.log(`Compression progress: ${progress}%`);
      },
      onError: (error) => {
        toast({
          title: 'Compression Error',
          description: error,
          variant: 'destructive',
        });
      },
    });

  // Handle file selection and compression
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);

    if (files.length === 0) return;

    // Clear previous errors
    clearError();

    // Set selected files for preview
    setSelectedFiles(files);

    try {
      // Compress all selected images
      const compressed = await compressMultiple(files);

      if (compressed.length > 0) {
        // Extract base64 data URLs for API submission
        const imageDataUrls = compressed.map((result) => result.dataUrl);

        setCompressedImages(imageDataUrls);
        setFormData((prev) => ({
          ...prev,
          images: imageDataUrls,
        }));

        // Show success message with compression stats
        const totalOriginalSize = compressed.reduce(
          (sum, r) => sum + r.originalSize,
          0
        );
        const totalCompressedSize = compressed.reduce(
          (sum, r) => sum + r.compressedSize,
          0
        );
        const avgCompressionRatio =
          compressed.reduce((sum, r) => sum + r.compressionRatio, 0) /
          compressed.length;

        toast({
          title: 'Images Compressed Successfully',
          description: `${compressed.length} images compressed. Original: ${formatFileSize(totalOriginalSize)}, Compressed: ${formatFileSize(totalCompressedSize)} (${avgCompressionRatio.toFixed(1)}% reduction)`,
        });
      }
    } catch (err) {
      console.error('Compression failed:', err);
    }
  };

  // Remove an image
  const removeImage = (index: number) => {
    const newFiles = selectedFiles.filter((_, i) => i !== index);
    const newImages = compressedImages.filter((_, i) => i !== index);

    setSelectedFiles(newFiles);
    setCompressedImages(newImages);
    setFormData((prev) => ({
      ...prev,
      images: newImages,
    }));
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.message) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Submit the form with compressed images
      const response = await fetch('/api/quotes/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          // Images are already compressed and in base64 format
          images: formData.images,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to submit quote request');
      }

      const result = await response.json();

      toast({
        title: 'Quote Request Submitted',
        description: "We'll get back to you within 24 hours!",
      });

      // Reset form
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        images: [],
      });
      setSelectedFiles([]);
      setCompressedImages([]);
    } catch (err) {
      console.error('Submission failed:', err);
      toast({
        title: 'Submission Failed',
        description: 'Please try again or contact support.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>Request a Quote</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, name: e.target.value }))
                  }
                  required
                />
              </div>
              <div>
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, email: e.target.value }))
                  }
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="phone">Phone (optional)</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, phone: e.target.value }))
                }
              />
            </div>

            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, message: e.target.value }))
                }
                placeholder="Please describe your project requirements..."
                required
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-4">
              <Label>Project Photos (optional)</Label>

              {/* File Input */}
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  disabled={isCompressing}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center space-y-2"
                >
                  {isCompressing ? (
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                  ) : (
                    <Upload className="h-8 w-8 text-gray-400" />
                  )}
                  <span className="text-sm text-gray-600">
                    {isCompressing
                      ? 'Compressing images...'
                      : 'Click to upload images'}
                  </span>
                  <span className="text-xs text-gray-500">
                    Images will be automatically compressed to &lt;1MB each
                  </span>
                </label>
              </div>

              {/* Compression Progress */}
              {isCompressing && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Compressing images...</span>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={progress} className="w-full" />
                </div>
              )}

              {/* Error Display */}
              {error && (
                <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </div>
              )}

              {/* Image Previews */}
              {selectedFiles.length > 0 && (
                <div className="space-y-3">
                  <h4 className="text-sm font-medium">Selected Images:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {selectedFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                          {compressedImages[index] ? (
                            <img
                              src={compressedImages[index]}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              {isCompressing ? (
                                <Loader2 className="h-6 w-6 animate-spin text-blue-500" />
                              ) : (
                                <ImageIcon className="h-6 w-6 text-gray-400" />
                              )}
                            </div>
                          )}
                        </div>

                        {/* Remove button */}
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="h-3 w-3" />
                        </button>

                        {/* File info */}
                        <div className="mt-1 text-xs text-gray-500 text-center">
                          <div className="truncate">{file.name}</div>
                          <div>{formatFileSize(file.size)}</div>
                          {compressedImages[index] && (
                            <div className="flex items-center justify-center space-x-1 text-green-600">
                              <CheckCircle className="h-3 w-3" />
                              <span>Compressed</span>
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Upload Summary */}
              {compressedImages.length > 0 && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center space-x-2 text-green-800">
                    <CheckCircle className="h-4 w-4" />
                    <span className="text-sm font-medium">
                      {compressedImages.length} image(s) ready for upload
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full"
              disabled={isSubmitting || isCompressing}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                'Submit Quote Request'
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

/**
 * Usage Instructions:
 *
 * 1. Copy the image compression files:
 *    - /lib/image-compression.ts
 *    - /lib/hooks/use-image-compression.ts
 *
 * 2. Import and use in your quote form:
 *    ```tsx
 *    import { useImageCompression } from '@/lib/hooks/use-image-compression';
 *
 *    function QuoteForm() {
 *      const [images, setImages] = useState<string[]>([]);
 *      const { compressMultiple, isCompressing } = useImageCompression({
 *        maxWidth: 1920,
 *        maxHeight: 1920,
 *        quality: 0.8,
 *        maxSizeMB: 1,
 *      });
 *
 *      const handleFileChange = async (e) => {
 *        const files = Array.from(e.target.files || []);
 *        const compressed = await compressMultiple(files);
 *        setImages(compressed.map(r => r.dataUrl));
 *      };
 *
 *      // Submit compressed images in your API call
 *      const payload = { ...formData, images };
 *    }
 *    ```
 *
 * 3. The compressed images will be:
 *    - Resized to max 1920x1920px
 *    - Compressed to ~80% quality
 *    - Under 1MB each
 *    - Total under 10MB for all images
 */
