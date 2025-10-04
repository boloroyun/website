/**
 * React Hook for Image Compression
 *
 * Provides easy-to-use image compression functionality for React components
 * with progress tracking and error handling.
 */

import { useState, useCallback } from 'react';
import {
  compressImage,
  compressMultipleImages,
  validateTotalSize,
  CompressionOptions,
  CompressionResult,
} from '../image-compression';

export interface UseImageCompressionOptions extends CompressionOptions {
  maxTotalMB?: number;
  onProgress?: (progress: number) => void;
  onError?: (error: string) => void;
}

export interface UseImageCompressionReturn {
  compress: (file: File) => Promise<CompressionResult | null>;
  compressMultiple: (files: File[]) => Promise<CompressionResult[]>;
  isCompressing: boolean;
  progress: number;
  error: string | null;
  clearError: () => void;
}

/**
 * Hook for image compression with progress tracking
 */
export function useImageCompression(
  options: UseImageCompressionOptions = {}
): UseImageCompressionReturn {
  const [isCompressing, setIsCompressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const {
    maxTotalMB = 10,
    onProgress,
    onError,
    ...compressionOptions
  } = options;

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const compress = useCallback(
    async (file: File): Promise<CompressionResult | null> => {
      try {
        setIsCompressing(true);
        setError(null);
        setProgress(0);

        // Validate file
        if (!file || !(file instanceof File)) {
          throw new Error('Invalid file provided');
        }

        if (!file.type.startsWith('image/')) {
          throw new Error('File must be an image');
        }

        // Update progress
        setProgress(25);
        onProgress?.(25);

        // Compress the image with error handling
        const result = await compressImage(file, compressionOptions);

        // Update progress
        setProgress(100);
        onProgress?.(100);

        return result;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Compression failed';
        setError(errorMessage);
        onError?.(errorMessage);
        return null;
      } finally {
        setIsCompressing(false);
        // Reset progress after a delay to prevent flickering
        setTimeout(() => {
          try {
            setProgress(0);
          } catch (error) {
            // Ignore errors if component is unmounted
          }
        }, 1000);
      }
    },
    [compressionOptions, onProgress, onError]
  );

  const compressMultiple = useCallback(
    async (files: File[]): Promise<CompressionResult[]> => {
      try {
        setIsCompressing(true);
        setError(null);
        setProgress(0);

        // Validate total size before compression
        const validation = validateTotalSize(files, maxTotalMB);
        if (!validation.isValid) {
          throw new Error(validation.message);
        }

        // Update progress
        setProgress(10);
        onProgress?.(10);

        // Compress all images
        const results = await compressMultipleImages(files, compressionOptions);

        // Validate compressed total size
        const compressedFiles = results.map((r) => r.file);
        const compressedValidation = validateTotalSize(
          compressedFiles,
          maxTotalMB
        );

        if (!compressedValidation.isValid) {
          console.warn(
            'Compressed files still exceed size limit:',
            compressedValidation.message
          );
          // Continue anyway, but log warning
        }

        // Update progress
        setProgress(100);
        onProgress?.(100);

        return results;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Compression failed';
        setError(errorMessage);
        onError?.(errorMessage);
        return [];
      } finally {
        setIsCompressing(false);
        setTimeout(() => {
          try {
            setProgress(0);
          } catch (error) {
            // Ignore errors if component is unmounted
          }
        }, 1000); // Reset progress after delay
      }
    },
    [compressionOptions, maxTotalMB, onProgress, onError]
  );

  return {
    compress,
    compressMultiple,
    isCompressing,
    progress,
    error,
    clearError,
  };
}

/**
 * Hook for batch image compression with individual file progress
 */
export function useImageCompressionBatch(
  options: UseImageCompressionOptions = {}
) {
  const [isCompressing, setIsCompressing] = useState(false);
  const [fileProgress, setFileProgress] = useState<Record<string, number>>({});
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<CompressionResult[]>([]);

  const {
    maxTotalMB = 10,
    onProgress,
    onError,
    ...compressionOptions
  } = options;

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const compressBatch = useCallback(
    async (files: File[]): Promise<CompressionResult[]> => {
      try {
        setIsCompressing(true);
        setError(null);
        setResults([]);
        setFileProgress({});

        // Validate total size
        const validation = validateTotalSize(files, maxTotalMB);
        if (!validation.isValid) {
          throw new Error(validation.message);
        }

        const batchResults: CompressionResult[] = [];
        const totalFiles = files.length;

        // Process files one by one for individual progress tracking
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const fileId = `${file.name}-${file.size}`;

          try {
            // Update file progress
            setFileProgress((prev) => ({ ...prev, [fileId]: 0 }));

            if (file.type.startsWith('image/')) {
              // Compress image
              const result = await compressImage(file, compressionOptions);
              batchResults.push(result);
            } else {
              // Handle non-image files
              const reader = new FileReader();
              const dataUrl = await new Promise<string>((resolve, reject) => {
                reader.onload = () => resolve(reader.result as string);
                reader.onerror = () => reject(new Error('Failed to read file'));
                reader.readAsDataURL(file);
              });

              batchResults.push({
                file,
                originalSize: file.size,
                compressedSize: file.size,
                compressionRatio: 0,
                dataUrl,
              });
            }

            // Update file progress
            setFileProgress((prev) => ({ ...prev, [fileId]: 100 }));

            // Update overall progress
            const overallProgress = ((i + 1) / totalFiles) * 100;
            onProgress?.(overallProgress);
          } catch (fileError) {
            console.error(`Failed to process ${file.name}:`, fileError);
            // Continue with other files
          }
        }

        setResults(batchResults);
        return batchResults;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : 'Batch compression failed';
        setError(errorMessage);
        onError?.(errorMessage);
        return [];
      } finally {
        setIsCompressing(false);
      }
    },
    [compressionOptions, maxTotalMB, onProgress, onError]
  );

  return {
    compressBatch,
    isCompressing,
    fileProgress,
    error,
    results,
    clearError,
  };
}
