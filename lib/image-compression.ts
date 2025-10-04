/**
 * Image Compression Utility
 *
 * Compresses images to meet the following specifications:
 * - Max dimensions: 1920x1920px
 * - Default quality: 80%
 * - Recommended size: <1MB per image
 * - Total limit: <10MB for all images
 */

export interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number;
  maxSizeMB?: number;
  format?: 'jpeg' | 'webp' | 'png';
}

export interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  dataUrl: string;
}

const DEFAULT_OPTIONS: Required<CompressionOptions> = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.8,
  maxSizeMB: 1,
  format: 'jpeg',
};

/**
 * Compresses a single image file
 */
export async function compressImage(
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      reject(new Error('Canvas context not available'));
      return;
    }

    img.onload = () => {
      try {
        // Calculate new dimensions while maintaining aspect ratio
        const { width: newWidth, height: newHeight } = calculateDimensions(
          img.width,
          img.height,
          opts.maxWidth,
          opts.maxHeight
        );

        // Set canvas dimensions
        canvas.width = newWidth;
        canvas.height = newHeight;

        // Draw and compress image
        ctx.drawImage(img, 0, 0, newWidth, newHeight);

        // Convert to blob with compression
        canvas.toBlob(
          (blob) => {
            if (!blob) {
              reject(new Error('Failed to compress image'));
              return;
            }

            // Check if compressed size meets requirements
            const compressedSizeMB = blob.size / (1024 * 1024);
            if (compressedSizeMB > opts.maxSizeMB) {
              // Try with lower quality if still too large
              const lowerQuality = Math.max(0.1, opts.quality - 0.2);
              compressImage(file, { ...options, quality: lowerQuality })
                .then(resolve)
                .catch(reject);
              return;
            }

            // Create new file with compressed data
            const compressedFile = new File(
              [blob],
              file.name.replace(/\.[^/.]+$/, `.${opts.format}`),
              {
                type: `image/${opts.format}`,
                lastModified: Date.now(),
              }
            );

            // Create data URL for preview
            const reader = new FileReader();
            reader.onload = () => {
              resolve({
                file: compressedFile,
                originalSize: file.size,
                compressedSize: blob.size,
                compressionRatio: (1 - blob.size / file.size) * 100,
                dataUrl: reader.result as string,
              });
            };
            reader.onerror = () =>
              reject(new Error('Failed to read compressed file'));
            reader.readAsDataURL(blob);
          },
          `image/${opts.format}`,
          opts.quality
        );
      } catch (error) {
        reject(error);
      }
    };

    img.onerror = () => reject(new Error('Failed to load image'));

    // Load the image
    const reader = new FileReader();
    reader.onload = (e) => {
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsDataURL(file);
  });
}

/**
 * Compresses multiple images
 */
export async function compressMultipleImages(
  files: File[],
  options: CompressionOptions = {}
): Promise<CompressionResult[]> {
  const results: CompressionResult[] = [];

  for (const file of files) {
    try {
      // Only compress image files
      if (file.type.startsWith('image/')) {
        const result = await compressImage(file, options);
        results.push(result);
      } else {
        // For non-image files, return as-is
        const reader = new FileReader();
        const dataUrl = await new Promise<string>((resolve, reject) => {
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsDataURL(file);
        });

        results.push({
          file,
          originalSize: file.size,
          compressedSize: file.size,
          compressionRatio: 0,
          dataUrl,
        });
      }
    } catch (error) {
      console.error(`Failed to compress ${file.name}:`, error);
      // Skip failed files but continue with others
    }
  }

  return results;
}

/**
 * Calculate new dimensions while maintaining aspect ratio
 */
function calculateDimensions(
  originalWidth: number,
  originalHeight: number,
  maxWidth: number,
  maxHeight: number
): { width: number; height: number } {
  let { width, height } = { width: originalWidth, height: originalHeight };

  // Scale down if larger than max dimensions
  if (width > maxWidth || height > maxHeight) {
    const aspectRatio = width / height;

    if (width > height) {
      width = maxWidth;
      height = width / aspectRatio;
    } else {
      height = maxHeight;
      width = height * aspectRatio;
    }
  }

  return {
    width: Math.round(width),
    height: Math.round(height),
  };
}

/**
 * Validate total file size doesn't exceed limit
 */
export function validateTotalSize(
  files: File[],
  maxTotalMB: number = 10
): { isValid: boolean; totalSizeMB: number; message?: string } {
  const totalBytes = files.reduce((sum, file) => sum + file.size, 0);
  const totalSizeMB = totalBytes / (1024 * 1024);

  if (totalSizeMB > maxTotalMB) {
    return {
      isValid: false,
      totalSizeMB,
      message: `Total file size (${totalSizeMB.toFixed(1)}MB) exceeds limit of ${maxTotalMB}MB`,
    };
  }

  return {
    isValid: true,
    totalSizeMB,
  };
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}
