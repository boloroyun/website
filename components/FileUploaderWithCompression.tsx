'use client';

import { useState, useCallback, useRef, useEffect } from 'react';
import {
  X,
  Upload,
  Image as ImageIcon,
  File as FileIcon,
  Camera,
  Trash2,
  AlertCircle,
  CheckCircle,
  Loader2,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useImageCompression } from '@/lib/hooks/use-image-compression';
import { formatFileSize } from '@/lib/image-compression';
import { Progress } from '@/components/ui/progress';
import { toast } from '@/components/ui/use-toast';

// Maximum file size in bytes (10MB)
const MAX_FILE_SIZE =
  Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_MB || '10') * 1024 * 1024;
const MAX_FILES = Number(process.env.NEXT_PUBLIC_MAX_UPLOAD_COUNT || '8');
const ACCEPTED_FILE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'application/pdf',
];

// Type definitions
export type UploadedImage = {
  publicId: string;
  secureUrl: string;
  width?: number;
  height?: number;
  bytes?: number;
  format?: string;
  originalName?: string;
};

export type CompressedFile = {
  file: File;
  previewUrl: string;
  id: string;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  isCompressed: boolean;
  uploadProgress: number;
  error?: string;
  uploaded?: boolean;
  uploadedImage?: UploadedImage;
};

interface FileUploaderWithCompressionProps {
  onImagesUploaded: (images: UploadedImage[]) => void;
  onError?: (error: string) => void;
  onUploadStatusChange?: (isUploading: boolean) => void;
  className?: string;
  compressionOptions?: {
    maxWidth?: number;
    maxHeight?: number;
    quality?: number;
    maxSizeMB?: number;
  };
}

export function FileUploaderWithCompression({
  onImagesUploaded,
  onError,
  onUploadStatusChange,
  className,
  compressionOptions = {
    maxWidth: 1920,
    maxHeight: 1920,
    quality: 0.8,
    maxSizeMB: 1,
  },
}: FileUploaderWithCompressionProps) {
  const [files, setFiles] = useState<CompressedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const dropAreaRef = useRef<HTMLDivElement | null>(null);
  const isMountedRef = useRef(true);

  // Track component mounting state
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Image compression hook
  const {
    compressMultiple,
    isCompressing,
    progress: compressionProgress,
    error: compressionError,
    clearError: clearCompressionError,
  } = useImageCompression({
    ...compressionOptions,
    maxTotalMB: 10,
    onProgress: (progress) => {
      console.log(`Compression progress: ${progress}%`);
    },
    onError: (error) => {
      console.error('Compression error:', error);
      onError?.(error);
    },
  });

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      // Safely clean up object URLs
      files.forEach((file) => {
        try {
          if (file.previewUrl && file.previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(file.previewUrl);
          }
        } catch (error) {
          // Ignore errors during cleanup
          console.warn('Failed to revoke object URL:', error);
        }
      });
    };
  }, [files]);

  // Update upload status when compression or upload state changes
  useEffect(() => {
    const isProcessing = isCompressing || isUploading;
    onUploadStatusChange?.(isProcessing);
  }, [isCompressing, isUploading, onUploadStatusChange]);

  // Handle file validation
  const validateFile = (file: File): string | null => {
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      return `File type ${file.type} is not supported`;
    }

    if (file.size > MAX_FILE_SIZE) {
      return `File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`;
    }

    return null;
  };

  // Process and compress files
  const processFiles = async (filesToProcess: FileList | File[]) => {
    const fileArray = Array.from(filesToProcess);

    // Check total file count
    if (files.length + fileArray.length > MAX_FILES) {
      const errorMsg = `Maximum ${MAX_FILES} files allowed`;
      if (isMountedRef.current) {
        setUploadError(errorMsg);
      }
      onError?.(errorMsg);
      return;
    }

    // Validate files
    const validFiles: File[] = [];
    const errors: string[] = [];

    fileArray.forEach((file) => {
      const error = validateFile(file);
      if (error) {
        errors.push(`${file.name}: ${error}`);
      } else {
        validFiles.push(file);
      }
    });

    if (errors.length > 0) {
      const errorMsg = errors.join(', ');
      if (isMountedRef.current) {
        setUploadError(errorMsg);
      }
      onError?.(errorMsg);
      return;
    }

    if (validFiles.length === 0) return;

    try {
      // Clear previous errors
      if (isMountedRef.current) {
        setUploadError(null);
      }
      clearCompressionError();

      // Compress images
      const compressionResults = await compressMultiple(validFiles);

      if (compressionResults.length > 0) {
        // Create compressed file objects
        const newCompressedFiles: CompressedFile[] = compressionResults.map(
          (result, index) => ({
            file: result.file,
            previewUrl: result.dataUrl,
            id: `${result.file.name}-${Date.now()}-${index}`,
            originalSize: result.originalSize,
            compressedSize: result.compressedSize,
            compressionRatio: result.compressionRatio,
            isCompressed: result.compressionRatio > 0,
            uploadProgress: 0,
          })
        );

        // Add to files list
        if (isMountedRef.current) {
          setFiles((prev) => [...prev, ...newCompressedFiles]);
        }

        // Show compression success message
        const totalOriginalSize = compressionResults.reduce(
          (sum, r) => sum + r.originalSize,
          0
        );
        const totalCompressedSize = compressionResults.reduce(
          (sum, r) => sum + r.compressedSize,
          0
        );
        const avgCompressionRatio =
          compressionResults.reduce((sum, r) => sum + r.compressionRatio, 0) /
          compressionResults.length;

        toast({
          title: 'Images Compressed Successfully',
          description: `${compressionResults.length} images processed. Original: ${formatFileSize(totalOriginalSize)}, Compressed: ${formatFileSize(totalCompressedSize)} (${avgCompressionRatio.toFixed(1)}% reduction)`,
        });

        // Auto-upload compressed files
        uploadFiles(newCompressedFiles);
      }
    } catch (error) {
      console.error('File processing failed:', error);
      const errorMsg =
        error instanceof Error ? error.message : 'File processing failed';
      setUploadError(errorMsg);
      onError?.(errorMsg);
    }
  };

  // Upload files to Cloudinary
  const uploadFiles = async (filesToUpload: CompressedFile[]) => {
    setIsUploading(true);
    const uploadedImages: UploadedImage[] = [];

    try {
      for (const fileObj of filesToUpload) {
        try {
          // Update progress
          if (isMountedRef.current) {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileObj.id ? { ...f, uploadProgress: 10 } : f
              )
            );
          }

          // Create form data
          const formData = new FormData();
          formData.append('file', fileObj.file);

          // Upload to Cloudinary
          const response = await fetch('/api/uploads/sign', {
            method: 'POST',
            body: formData,
          });

          if (!response.ok) {
            throw new Error(`Upload failed: ${response.statusText}`);
          }

          const result = await response.json();

          // Update progress
          if (isMountedRef.current) {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileObj.id
                  ? {
                      ...f,
                      uploadProgress: 100,
                      uploaded: true,
                      uploadedImage: result,
                    }
                  : f
              )
            );
          }

          uploadedImages.push(result);
        } catch (error) {
          console.error(`Upload failed for ${fileObj.file.name}:`, error);

          // Update file with error
          if (isMountedRef.current) {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileObj.id
                  ? {
                      ...f,
                      error:
                        error instanceof Error
                          ? error.message
                          : 'Upload failed',
                    }
                  : f
              )
            );
          }
        }
      }

      // Notify parent component
      if (uploadedImages.length > 0) {
        onImagesUploaded(uploadedImages);
      }
    } catch (error) {
      console.error('Upload process failed:', error);
      const errorMsg = error instanceof Error ? error.message : 'Upload failed';
      setUploadError(errorMsg);
      onError?.(errorMsg);
    } finally {
      setIsUploading(false);
    }
  };

  // Handle file input change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = e.target.files;
    if (selectedFiles && selectedFiles.length > 0) {
      processFiles(selectedFiles);
    }
    // Reset input safely
    try {
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      // Ignore errors if input element is not available
      console.warn('Failed to reset file input:', error);
    }
  };

  // Handle drag and drop
  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragging(false);

      const droppedFiles = e.dataTransfer.files;
      if (droppedFiles.length > 0) {
        processFiles(droppedFiles);
      }
    },
    [processFiles]
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  // Remove file
  const removeFile = (fileId: string) => {
    if (!isMountedRef.current) return;

    setFiles((prev) => {
      const fileToRemove = prev.find((f) => f.id === fileId);
      if (fileToRemove && fileToRemove.previewUrl) {
        try {
          if (fileToRemove.previewUrl.startsWith('blob:')) {
            URL.revokeObjectURL(fileToRemove.previewUrl);
          }
        } catch (error) {
          // Ignore errors during cleanup
          console.warn('Failed to revoke object URL during removal:', error);
        }
      }
      return prev.filter((f) => f.id !== fileId);
    });
  };

  // Clear all files
  const clearAllFiles = () => {
    if (!isMountedRef.current) return;

    files.forEach((file) => {
      try {
        if (file.previewUrl && file.previewUrl.startsWith('blob:')) {
          URL.revokeObjectURL(file.previewUrl);
        }
      } catch (error) {
        // Ignore errors during cleanup
        console.warn('Failed to revoke object URL during clear:', error);
      }
    });
    setFiles([]);
    setUploadError(null);
  };

  const isProcessing = isCompressing || isUploading;

  return (
    <div className={cn('space-y-4', className)}>
      {/* Drop Zone */}
      <div
        ref={dropAreaRef}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center transition-colors',
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400',
          isProcessing && 'opacity-50 pointer-events-none'
        )}
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*,.pdf"
          onChange={handleFileChange}
          className="hidden"
          disabled={isProcessing}
        />

        <div className="flex flex-col items-center space-y-2">
          {isProcessing ? (
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          ) : (
            <Upload className="h-8 w-8 text-gray-400" />
          )}

          <div className="text-sm text-gray-600">
            {isCompressing ? (
              'Compressing images...'
            ) : isUploading ? (
              'Uploading files...'
            ) : (
              <>
                <button
                  type="button"
                  onClick={() => {
                    try {
                      fileInputRef.current?.click();
                    } catch (error) {
                      console.warn(
                        'Failed to trigger file input click:',
                        error
                      );
                    }
                  }}
                  className="text-blue-600 hover:text-blue-700 font-medium"
                  disabled={isProcessing}
                >
                  Click to upload
                </button>
                {' or drag and drop'}
              </>
            )}
          </div>

          <div className="text-xs text-gray-500">
            Images will be automatically compressed to &lt;1MB each
          </div>

          <div className="text-xs text-gray-500">
            Max {MAX_FILES} files, {MAX_FILE_SIZE / (1024 * 1024)}MB each
          </div>
        </div>
      </div>

      {/* Compression Progress */}
      {isCompressing && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Compressing images...</span>
            <span>{compressionProgress.toFixed(0)}%</span>
          </div>
          <Progress value={compressionProgress} className="w-full" />
        </div>
      )}

      {/* Error Display */}
      {(uploadError || compressionError) && (
        <div className="flex items-center space-x-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
          <AlertCircle className="h-4 w-4 flex-shrink-0" />
          <span className="text-sm">{uploadError || compressionError}</span>
        </div>
      )}

      {/* File List */}
      {files.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-medium">
              Files ({files.length}/{MAX_FILES})
            </h4>
            <button
              type="button"
              onClick={clearAllFiles}
              className="text-xs text-red-600 hover:text-red-700"
              disabled={isProcessing}
            >
              Clear all
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {files.map((file) => (
              <div
                key={file.id}
                className="relative group border rounded-lg p-3 bg-white"
              >
                {/* Preview */}
                <div className="aspect-square bg-gray-100 rounded-md overflow-hidden mb-2">
                  {file.file.type.startsWith('image/') ? (
                    <img
                      src={file.previewUrl}
                      alt={file.file.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <FileIcon className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>

                {/* File Info */}
                <div className="space-y-1">
                  <div
                    className="text-xs font-medium truncate"
                    title={file.file.name}
                  >
                    {file.file.name}
                  </div>

                  <div className="text-xs text-gray-500">
                    {file.isCompressed ? (
                      <div className="space-y-1">
                        <div>Original: {formatFileSize(file.originalSize)}</div>
                        <div>
                          Compressed: {formatFileSize(file.compressedSize)}
                        </div>
                        <div className="text-green-600">
                          {file.compressionRatio.toFixed(1)}% reduction
                        </div>
                      </div>
                    ) : (
                      <div>{formatFileSize(file.file.size)}</div>
                    )}
                  </div>

                  {/* Status */}
                  <div className="flex items-center space-x-1 text-xs">
                    {file.error ? (
                      <>
                        <AlertCircle className="h-3 w-3 text-red-500" />
                        <span className="text-red-600">Error</span>
                      </>
                    ) : file.uploaded ? (
                      <>
                        <CheckCircle className="h-3 w-3 text-green-500" />
                        <span className="text-green-600">Uploaded</span>
                      </>
                    ) : file.uploadProgress > 0 ? (
                      <>
                        <Loader2 className="h-3 w-3 animate-spin text-blue-500" />
                        <span className="text-blue-600">Uploading...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="h-3 w-3 text-blue-500" />
                        <span className="text-blue-600">Ready</span>
                      </>
                    )}
                  </div>

                  {/* Upload Progress */}
                  {file.uploadProgress > 0 && file.uploadProgress < 100 && (
                    <Progress value={file.uploadProgress} className="h-1" />
                  )}
                </div>

                {/* Remove Button */}
                <button
                  type="button"
                  onClick={() => removeFile(file.id)}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                  disabled={isProcessing}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
