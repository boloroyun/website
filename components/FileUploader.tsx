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
} from 'lucide-react';
import { cn } from '@/lib/utils';

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

type FileWithPreview = {
  file: File;
  previewUrl: string;
  id: string;
  uploadProgress: number;
  error?: string;
  uploaded?: boolean;
  uploadedImage?: UploadedImage;
};

interface FileUploaderProps {
  onImagesUploaded: (images: UploadedImage[]) => void;
  onError?: (error: string) => void;
  onUploadStatusChange?: (isUploading: boolean) => void;
  className?: string;
}

export function FileUploader({
  onImagesUploaded,
  onError,
  onUploadStatusChange,
  className,
}: FileUploaderProps) {
  const [files, setFiles] = useState([] as FileWithPreview[]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null as string | null);

  const fileInputRef = useRef(null as HTMLInputElement | null);
  const dropAreaRef = useRef(null as HTMLDivElement | null);

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

  // Process files (validation + preview)
  const processFiles = (filesToProcess: FileList | File[]) => {
    const newFiles: FileWithPreview[] = [];
    const errors: string[] = [];

    // Check total file count
    if (files.length + filesToProcess.length > MAX_FILES) {
      setUploadError(`Maximum ${MAX_FILES} files allowed`);
      onError?.(`Maximum ${MAX_FILES} files allowed`);
      return;
    }

    Array.from(filesToProcess).forEach((file) => {
      const error = validateFile(file);

      if (error) {
        errors.push(`${file.name}: ${error}`);
        return;
      }

      // Create unique ID for each file
      const id = `file-${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;

      // Create object URL for image preview (not for PDFs)
      const previewUrl = file.type.startsWith('image/')
        ? URL.createObjectURL(file)
        : '';

      newFiles.push({
        file,
        previewUrl,
        id,
        uploadProgress: 0,
        uploaded: false,
      });
    });

    if (errors.length > 0) {
      setUploadError(errors.join(', '));
      onError?.(errors.join(', '));
    } else {
      setUploadError(null);
    }

    if (newFiles.length > 0) {
      setFiles((prev) => [...prev, ...newFiles]);
    }
  };

  // Drag-and-drop handlers
  const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();

    // Only set dragging to false if the drag leaves the dropzone (not child elements)
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  // Handle file input change
  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFiles(e.target.files);
    }
  };

  // Open file dialog when clicking the drop area
  const handleBrowseClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Remove file from list
  const handleRemoveFile = (id: string) => {
    setFiles((prev) => {
      // Find file to clean up its preview URL
      const fileToRemove = prev.find((f) => f.id === id);
      if (fileToRemove?.previewUrl) {
        URL.revokeObjectURL(fileToRemove.previewUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  // Upload single file to Cloudinary
  const uploadFileToCloudinary = async (
    file: File,
    signature: string,
    timestamp: string,
    folder: string,
    apiKey: string,
    cloudName: string,
    onProgress: (progress: number) => void
  ): Promise<UploadedImage> => {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      const formData = new FormData();

      // Add required fields for Cloudinary
      formData.append('file', file);
      formData.append('api_key', apiKey);
      formData.append('timestamp', timestamp);
      formData.append('signature', signature);
      formData.append('folder', folder);

      // Set up progress monitoring
      xhr.upload.onprogress = (e) => {
        if (e.lengthComputable) {
          const percentComplete = Math.round((e.loaded / e.total) * 100);
          onProgress(percentComplete);
        }
      };

      xhr.onload = () => {
        if (xhr.status === 200) {
          try {
            const response = JSON.parse(xhr.responseText);
            resolve({
              publicId: response.public_id,
              secureUrl: response.secure_url,
              width: response.width,
              height: response.height,
              bytes: response.bytes,
              format: response.format,
              originalName: file.name,
            });
          } catch (error) {
            reject(new Error('Failed to parse server response'));
          }
        } else {
          reject(new Error(`Upload failed with status ${xhr.status}`));
        }
      };

      xhr.onerror = () => {
        reject(new Error('Network error occurred during upload'));
      };

      xhr.open(
        'POST',
        `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
        true
      );
      xhr.send(formData);
    });
  };

  // Upload all files
  const uploadFiles = useCallback(async () => {
    try {
      if (files.length === 0 || isUploading) return;

      setIsUploading(true);
      onUploadStatusChange?.(true);
      setUploadError(null);

      // Get files that haven't been uploaded yet
      const filesToUpload = files.filter((f) => !f.uploaded);
      if (filesToUpload.length === 0) {
        setIsUploading(false);
        return;
      }

      // Get signature for uploads
      const signResponse = await fetch('/api/uploads/sign', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!signResponse.ok) {
        throw new Error('Failed to get upload signature');
      }

      const { signature, timestamp, folder, apiKey, cloudName } =
        await signResponse.json();

      // Upload each file
      const uploadPromises = filesToUpload.map(async (fileItem) => {
        try {
          // Update progress handler
          const updateProgress = (progress: number) => {
            setFiles((prev) =>
              prev.map((f) =>
                f.id === fileItem.id ? { ...f, uploadProgress: progress } : f
              )
            );
          };

          // Upload to Cloudinary
          const uploadedImage = await uploadFileToCloudinary(
            fileItem.file,
            signature,
            timestamp,
            folder,
            apiKey,
            cloudName,
            updateProgress
          );

          // Mark as uploaded
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileItem.id
                ? {
                    ...f,
                    uploaded: true,
                    uploadProgress: 100,
                    uploadedImage,
                  }
                : f
            )
          );

          return uploadedImage;
        } catch (error) {
          // Handle error for this file
          setFiles((prev) =>
            prev.map((f) =>
              f.id === fileItem.id
                ? {
                    ...f,
                    error:
                      error instanceof Error ? error.message : 'Upload failed',
                    uploadProgress: 0,
                  }
                : f
            )
          );
          return null;
        }
      });

      // Wait for all uploads to complete
      const results = await Promise.all(uploadPromises);
      const successfulUploads = results.filter(Boolean) as UploadedImage[];

      // Call callback with all successfully uploaded images
      const allUploadedImages = files
        .filter((f) => f.uploaded && f.uploadedImage)
        .map((f) => f.uploadedImage as UploadedImage)
        .concat(successfulUploads);

      onImagesUploaded(allUploadedImages);
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error instanceof Error ? error.message : 'Upload failed');
      onError?.(error instanceof Error ? error.message : 'Upload failed');
    } finally {
      setIsUploading(false);
      onUploadStatusChange?.(false);
    }
  }, [files, isUploading, onUploadStatusChange, onImagesUploaded, onError]);

  // Auto-upload when files are added
  useEffect(() => {
    if (
      files.length > 0 &&
      !isUploading &&
      files.some((f) => !f.uploaded && !f.error)
    ) {
      uploadFiles();
    }
  }, [files, isUploading, uploadFiles]);

  // File type icon
  const getFileIcon = (fileType: string) => {
    if (fileType.startsWith('image/')) return <ImageIcon className="h-6 w-6" />;
    if (fileType === 'application/pdf') return <FileIcon className="h-6 w-6" />;
    return <FileIcon className="h-6 w-6" />;
  };

  return (
    <div className={cn('w-full space-y-4', className)}>
      {/* Drag-and-drop area */}
      <div
        ref={dropAreaRef}
        className={cn(
          'border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors',
          isDragging
            ? 'border-blue-500 bg-blue-50'
            : 'border-gray-300 hover:border-gray-400 bg-gray-50 hover:bg-gray-100',
          isUploading && 'opacity-50 cursor-not-allowed',
          className?.includes('max-h') ? 'p-3' : 'p-6'
        )}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={handleBrowseClick}
        aria-disabled={isUploading}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/heic,application/pdf"
          onChange={handleFileInputChange}
          multiple
          className="hidden"
          disabled={isUploading}
          capture="environment"
        />

        <div className="flex flex-col items-center justify-center space-y-2">
          <div className="p-3 bg-gray-200 rounded-full">
            {isDragging ? (
              <Upload className="h-6 w-6 text-blue-500" />
            ) : (
              <>
                <Upload className="h-6 w-6 text-gray-500 sm:block hidden" />
                <Camera className="h-6 w-6 text-gray-500 sm:hidden" />
              </>
            )}
          </div>

          <div className="text-sm sm:text-base">
            <span className="font-medium text-blue-600">
              {isDragging ? 'Drop files here' : 'Click to upload'}
            </span>{' '}
            <span className="text-gray-600 hidden sm:inline">
              or drag and drop
            </span>
          </div>

          <p className="text-xs text-gray-500">
            JPG, PNG, WEBP, HEIC, PDF up to {MAX_FILE_SIZE / (1024 * 1024)}MB
            (max {MAX_FILES} files)
          </p>

          {/* Only show on mobile */}
          <p className="text-xs text-gray-500 sm:hidden">
            Take photos directly from your camera
          </p>
        </div>
      </div>

      {/* Error display */}
      {uploadError && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-md flex items-center gap-2 text-sm text-red-600">
          <AlertCircle className="h-4 w-4" />
          <p>{uploadError}</p>
        </div>
      )}

      {/* Preview grid */}
      {files.length > 0 && (
        <div
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 overflow-y-auto"
          style={className?.includes('max-h') ? { maxHeight: '120px' } : {}}
        >
          {files.map((fileItem) => (
            <div
              key={fileItem.id}
              className="relative border rounded-md overflow-hidden bg-gray-50 h-24 flex flex-col"
            >
              {/* Preview */}
              <div className="flex-1 flex items-center justify-center p-2 overflow-hidden">
                {fileItem.previewUrl ? (
                  <img
                    src={fileItem.previewUrl}
                    alt={fileItem.file.name}
                    className="max-h-full max-w-full object-contain"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center h-full">
                    {getFileIcon(fileItem.file.type)}
                    <span className="text-xs mt-1 text-gray-500 truncate max-w-full px-2">
                      {fileItem.file.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Progress bar */}
              {fileItem.uploadProgress > 0 &&
                !fileItem.uploaded &&
                !fileItem.error && (
                  <div className="h-1 bg-gray-200 w-full">
                    <div
                      className="h-1 bg-blue-500"
                      style={{ width: `${fileItem.uploadProgress}%` }}
                    ></div>
                  </div>
                )}

              {/* Status indicators */}
              <div className="p-1 text-xs flex justify-between items-center">
                {fileItem.error ? (
                  <span className="text-red-500 truncate flex-1 px-1">
                    {fileItem.error}
                  </span>
                ) : fileItem.uploaded ? (
                  <span className="text-green-500 truncate flex-1 px-1">
                    Uploaded
                  </span>
                ) : (
                  <span className="text-gray-500 truncate flex-1 px-1">
                    {fileItem.uploadProgress > 0
                      ? `${fileItem.uploadProgress}%`
                      : 'Waiting...'}
                  </span>
                )}

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(fileItem.id);
                  }}
                  className="text-gray-500 hover:text-red-500 p-1 rounded-full"
                  aria-label="Remove file"
                  disabled={isUploading && !fileItem.uploaded}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              {/* Remove button */}
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveFile(fileItem.id);
                }}
                className="absolute top-1 right-1 p-1 rounded-full bg-black bg-opacity-50 text-white hover:bg-opacity-70"
                aria-label="Remove file"
                disabled={isUploading && !fileItem.uploaded}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
