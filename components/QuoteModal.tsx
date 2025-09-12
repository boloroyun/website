'use client';

import React, { useState, useEffect, useCallback } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { openChat, sendVisitorMessage } from '@/lib/crisp';
import { storePendingQuote } from '@/lib/quote-fallback';
import { FileUploader, UploadedImage } from '@/components/FileUploader';
import { Image, CheckCircle, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';

interface QuoteModalProps {
  isOpen: boolean;
  onClose: () => void;
  productData: {
    id: string;
    title: string;
    sku: string;
  };
}

export default function QuoteModal({
  isOpen,
  onClose,
  productData,
}: QuoteModalProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    zipCode: '',
    notes: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);
  const [hasUploadingFiles, setHasUploadingFiles] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle form input changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // File upload handlers
  const handleImagesUploaded = useCallback((images: UploadedImage[]) => {
    setUploadedImages(images);
    setHasUploadingFiles(false);
  }, []);

  const handleUploadError = useCallback((errorMessage: string) => {
    setError(errorMessage);
  }, []);

  const handleUploadStatusChange = useCallback((isUploading: boolean) => {
    setHasUploadingFiles(isUploading);
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Prepare data with product information
      const quoteRequestData = {
        ...formData,
        productId: productData.id,
        productName: productData.title,
        sku: productData.sku,
        timestamp: new Date().toISOString(),
        images: uploadedImages, // Include uploaded images
      };

      // Send data to API with timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000); // 8 second timeout

      let response;
      try {
        response = await fetch('/api/quotes', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(quoteRequestData),
          signal: controller.signal,
        });

        clearTimeout(timeoutId);
      } catch (fetchError: unknown) {
        if (fetchError instanceof Error && fetchError.name === 'AbortError') {
          throw new Error('Request timed out. Please try again later.');
        }
        throw fetchError;
      }

      const responseData = await response.json().catch(() => ({}));

      if (!response.ok) {
        // Extract error message from response if available
        const errorMessage =
          responseData?.error || 'Failed to submit quote request';
        throw new Error(errorMessage);
      }

      // Check for warning messages (fallback processing)
      if (responseData.warning) {
        console.warn('Quote request warning:', responseData.warning);
        // Still treat it as success but could display a different message if desired
      }

      // Optional: Send information to Crisp if it's loaded
      if (typeof window !== 'undefined' && window.$crisp) {
        // Send a message to Crisp with the quote details
        openChat();
        sendVisitorMessage(
          `New quote request for ${productData.title} (SKU: ${productData.sku}):\n` +
            `Name: ${formData.name}\n` +
            `Email: ${formData.email}\n` +
            `Phone: ${formData.phone || 'Not provided'}\n` +
            `ZIP: ${formData.zipCode || 'Not provided'}\n` +
            `Notes: ${formData.notes || 'None'}`
        );
      }

      // Show success message
      toast({
        title: 'Quote Request Submitted',
        description:
          "Your quote request has been successfully submitted. We'll contact you soon!",
        variant: 'default',
        className: 'bg-green-50 border-green-200 text-green-800',
      });

      setIsSuccess(true);

      // Check if we have a quote ID and token to redirect to
      if (responseData.quoteId && responseData.publicToken) {
        // Show success message before redirecting
        setTimeout(() => {
          // Redirect to the confirmation page
          window.location.href = `/quote-requests/${responseData.quoteId}?token=${responseData.publicToken}`;
        }, 1500);
      } else {
        // Fallback to original behavior if we don't have the needed data
        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
          // Reset form and states after closing
          setFormData({
            name: '',
            email: '',
            phone: '',
            zipCode: '',
            notes: '',
          });
          setUploadedImages([]);
          setIsSuccess(false);
        }, 2000);
      }
    } catch (err) {
      console.error('Error submitting quote request:', err);

      // Log more detailed error information
      if (err instanceof Error) {
        console.error('Error message:', err.message);
      }

      // Store the quote data locally as a fallback
      try {
        // Need to recreate the data since it's not accessible in this scope
        const fallbackData = {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          zipCode: formData.zipCode,
          notes: formData.notes,
          productId: productData.id,
          productName: productData.title,
          sku: productData.sku,
          timestamp: new Date().toISOString(),
          images: uploadedImages,
        };
        const fallbackResult = await storePendingQuote(fallbackData);

        // Show success message
        toast({
          title: 'Quote Request Saved',
          description:
            'Your quote request has been saved and will be processed shortly.',
          variant: 'default',
          className: 'bg-green-50 border-green-200 text-green-800',
        });

        setIsSuccess(true);

        // If the fallback provides an ID and token, we can redirect
        if (fallbackResult?.quoteId && fallbackResult?.publicToken) {
          setTimeout(() => {
            window.location.href = `/quote-requests/${fallbackResult.quoteId}?token=${fallbackResult.publicToken}`;
          }, 1500);
          return;
        }

        // Show log message
        console.log(
          'Quote request stored locally. Will be sent when connection is restored.'
        );

        // Close modal after 2 seconds
        setTimeout(() => {
          onClose();
          setFormData({
            name: '',
            email: '',
            phone: '',
            zipCode: '',
            notes: '',
          });
          setIsSuccess(false);
        }, 2000);

        return; // Exit early since we're handling this as a "success"
      } catch (fallbackErr) {
        console.error('Failed to store quote locally:', fallbackErr);
      }

      // If fallback storage also failed, show an error message to the user
      const errorMessage =
        'Failed to submit request. Please try again. If the issue persists, contact support.';
      setError(errorMessage);

      // Also show toast notification for the error
      toast({
        title: 'Error Submitting Request',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Close modal if escape key is pressed
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting && !isSuccess) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => {
      window.removeEventListener('keydown', handleEsc);
    };
  }, [onClose, isSubmitting, isSuccess]);

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => !open && !isSubmitting && !isSuccess && onClose()}
    >
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Request a Quote</DialogTitle>
          <DialogDescription>
            {isSuccess ? (
              <span className="block py-6 text-center">
                <span className="block text-green-500 mb-3 text-xl">✓</span>
                <span className="block text-lg font-medium text-green-700">
                  Thanks! We'll contact you shortly.
                </span>
              </span>
            ) : (
              <span>
                Fill in the details below to get a quote for {productData.title}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>
        {!isSuccess && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Your full name"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email *</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone (optional)</Label>
                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="(123) 456-7890"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="zipCode">ZIP Code (optional)</Label>
                <Input
                  id="zipCode"
                  name="zipCode"
                  value={formData.zipCode}
                  onChange={handleChange}
                  placeholder="12345"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notes</Label>
                <Textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Any specific requirements or questions"
                  rows={3}
                />
              </div>

              {/* Project Photos Upload */}
              <div className="space-y-2">
                <Label htmlFor="photos" className="flex items-center gap-2">
                  <Image className="h-4 w-4" />
                  Project Photos (optional)
                </Label>
                <FileUploader
                  onImagesUploaded={handleImagesUploaded}
                  onError={handleUploadError}
                  onUploadStatusChange={handleUploadStatusChange}
                  className="max-h-[200px]"
                />
                <p className="text-xs text-gray-500">
                  Up to 8 photos, max 10 MB each. You can take photos with your
                  phone.
                </p>
                {uploadedImages.length > 0 && (
                  <p className="text-sm text-green-600 flex items-center gap-1">
                    <CheckCircle className="h-4 w-4" />
                    {uploadedImages.length}{' '}
                    {uploadedImages.length === 1 ? 'image' : 'images'} uploaded
                    successfully
                  </p>
                )}
              </div>
            </div>

            {error && (
              <div
                className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded relative"
                role="alert"
              >
                <span className="block sm:inline">{error}</span>
                <button
                  type="button"
                  className="absolute top-0 bottom-0 right-0 px-4 py-3"
                  onClick={() => setError(null)}
                >
                  <span className="sr-only">Dismiss</span>
                  <span>&times;</span>
                </button>
              </div>
            )}

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={isSubmitting || hasUploadingFiles}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || hasUploadingFiles}
                title={
                  hasUploadingFiles
                    ? 'Please wait for all files to upload'
                    : undefined
                }
              >
                {isSubmitting
                  ? 'Submitting...'
                  : hasUploadingFiles
                    ? 'Uploading Files...'
                    : 'Submit Request'}
              </Button>
            </div>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
