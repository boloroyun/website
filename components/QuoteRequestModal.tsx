'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  emitCrispEvent,
  CRISP_EVENTS,
  setQuoteSubmittedFlag,
} from '@/lib/crisp-events';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Calculator,
  Hammer,
  Package,
  Loader2,
  CheckCircle,
  AlertCircle,
  Home,
  Ruler,
  Camera,
  ImageIcon,
} from 'lucide-react';
import {
  FileUploaderWithCompression as FileUploader,
  UploadedImage,
} from '@/components/FileUploaderWithCompression';

interface QuoteRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialCategory?: 'countertop' | 'cabinet' | 'combo';
  productIds?: string[];
  onSubmitSuccess?: (quoteData: any) => void;
}

interface QuoteFormData {
  category: 'countertop' | 'cabinet' | 'combo';

  // Countertop fields
  material: string;
  sqft: string;
  edgeProfile: string;
  sinkCutouts: string;
  backsplashLf: string;

  // Cabinet fields
  baseLf: string;
  wallLf: string;
  tallUnits: string;
  drawerStacks: string;

  // Common fields
  zipcode: string;
}

const MATERIALS = [
  { value: 'granite', label: 'Granite' },
  { value: 'quartz', label: 'Quartz' },
  { value: 'marble', label: 'Marble' },
  { value: 'quartzite', label: 'Quartzite' },
  { value: 'limestone', label: 'Limestone' },
  { value: 'concrete', label: 'Concrete' },
  { value: 'butcher block', label: 'Butcher Block' },
  { value: 'wood', label: 'Wood' },
];

const EDGE_PROFILES = [
  { value: 'straight', label: 'Straight Edge' },
  { value: 'beveled', label: 'Beveled' },
  { value: 'bullnose', label: 'Bullnose' },
  { value: 'ogee', label: 'Ogee' },
  { value: 'waterfall', label: 'Waterfall' },
  { value: 'eased', label: 'Eased' },
  { value: 'laminated', label: 'Laminated' },
];

export default function QuoteRequestModal({
  isOpen,
  onClose,
  initialCategory = 'countertop',
  productIds = [],
  onSubmitSuccess,
}: QuoteRequestModalProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [uploadedImages, setUploadedImages] = useState([] as UploadedImage[]);
  const [hasUploadingFiles, setHasUploadingFiles] = useState(false);

  const [formData, setFormData] = useState({
    category: initialCategory,
    material: '',
    sqft: '',
    edgeProfile: 'straight',
    sinkCutouts: '1',
    backsplashLf: '',
    baseLf: '',
    wallLf: '',
    tallUnits: '',
    drawerStacks: '',
    zipcode: '',
  } as QuoteFormData);

  const calculateItemsCount = useCallback(() => {
    let count = 0;

    // Count countertop items
    if (formData.category === 'countertop' || formData.category === 'combo') {
      if (formData.material) count++;
      if (formData.sqft) count++;
      if (formData.edgeProfile) count++;
      if (formData.sinkCutouts) count++;
      if (formData.backsplashLf) count++;
    }

    // Count cabinet items
    if (formData.category === 'cabinet' || formData.category === 'combo') {
      if (formData.baseLf) count++;
      if (formData.wallLf) count++;
      if (formData.tallUnits) count++;
      if (formData.drawerStacks) count++;
    }

    return Math.max(count, 1); // At least 1 item
  }, [formData]);

  const updateFormData = useCallback((updates: Partial<QuoteFormData>) => {
    setFormData((prev) => {
      const newData = { ...prev, ...updates };

      // Track step changes when category changes
      if (updates.category && updates.category !== prev.category) {
        const stepMap = {
          countertop: { step: 1, stepKey: 'material' as const },
          cabinet: { step: 2, stepKey: 'dimensions' as const },
          combo: { step: 3, stepKey: 'summary' as const },
        };

        const stepInfo = stepMap[updates.category];
        if (stepInfo) {
          emitCrispEvent({
            name: CRISP_EVENTS.Quote.STEP_CHANGED,
            data: {
              step: stepInfo.step,
              stepKey: stepInfo.stepKey,
              quoteId: undefined, // No quote ID yet in modal
            },
          });
        }
      }

      return newData;
    });
  }, []);

  // Handle file upload events
  const handleImagesUploaded = useCallback((images: UploadedImage[]) => {
    setUploadedImages(images);
    setHasUploadingFiles(false);
  }, []);

  const handleUploadError = useCallback((errorMessage: string) => {
    setError(`Upload error: ${errorMessage}`);
  }, []);

  const handleUploadStatusChange = useCallback((isUploading: boolean) => {
    setHasUploadingFiles(isUploading);
  }, []);

  const handleSubmit = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Validate required fields based on category
      const errors: string[] = [];

      if (formData.category === 'countertop' || formData.category === 'combo') {
        if (!formData.material) errors.push('Material is required');
        if (!formData.sqft || parseFloat(formData.sqft) <= 0)
          errors.push('Valid square footage is required');
      }

      if (formData.category === 'cabinet' || formData.category === 'combo') {
        if (!formData.baseLf && !formData.wallLf) {
          errors.push('At least base or wall cabinet linear feet is required');
        }
      }

      if (errors.length > 0) {
        setError(errors.join(', '));
        return;
      }

      // Prepare the payload
      const payload: any = {
        category: formData.category,
        zipcode: formData.zipcode || undefined,
      };

      // Add product IDs if provided
      if (productIds.length > 0) {
        payload.products = productIds.map((id) => ({ id, qty: 1 }));
      }

      // Add uploaded images if any
      if (uploadedImages.length > 0) {
        payload.images = uploadedImages;
      }

      // Add countertop fields
      if (formData.category === 'countertop' || formData.category === 'combo') {
        if (formData.material) payload.material = formData.material;
        if (formData.sqft) payload.sqft = parseFloat(formData.sqft);
        if (formData.edgeProfile) payload.edgeProfile = formData.edgeProfile;
        if (formData.sinkCutouts)
          payload.sinkCutouts = parseInt(formData.sinkCutouts);
        if (formData.backsplashLf)
          payload.backsplashLf = parseFloat(formData.backsplashLf);
      }

      // Add cabinet fields
      if (formData.category === 'cabinet' || formData.category === 'combo') {
        if (formData.baseLf) payload.baseLf = parseFloat(formData.baseLf);
        if (formData.wallLf) payload.wallLf = parseFloat(formData.wallLf);
        if (formData.tallUnits)
          payload.tallUnits = parseInt(formData.tallUnits);
        if (formData.drawerStacks)
          payload.drawerStacks = parseInt(formData.drawerStacks);
      }

      console.log('📝 Submitting quote request:', payload);

      // Submit to the unified quote API
      const response = await fetch('/api/quotes/build-unified', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_INTERNAL_API_TOKEN || 'dev-token'}`,
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to generate quote');
      }

      const result = await response.json();
      console.log('✅ Quote generated:', result);

      // Track quote submission success
      const itemsCount = calculateItemsCount();
      emitCrispEvent({
        name: CRISP_EVENTS.Quote.SUBMITTED,
        data: {
          quoteId: result.quoteId,
          itemsCount,
          total: result.total,
          city: result.city,
          zipcode: formData.zipcode || undefined,
        },
      });

      // Set quote submitted flag for campaign targeting
      setQuoteSubmittedFlag();

      // Call the onSubmitSuccess callback if provided
      if (onSubmitSuccess) {
        onSubmitSuccess(result);
      }

      // Close modal and navigate to quote page
      onClose();
      router.push(`/quote/${result.quoteId}`);
    } catch (error) {
      console.error('❌ Quote request failed:', error);
      setError(
        error instanceof Error ? error.message : 'Failed to generate quote'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderCountertopFields = () => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="material">Material *</Label>
        <Select
          value={formData.material}
          onValueChange={(value) => updateFormData({ material: value })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Select material" />
          </SelectTrigger>
          <SelectContent>
            {MATERIALS.map((material) => (
              <SelectItem key={material.value} value={material.value}>
                {material.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="sqft">Square Footage *</Label>
        <Input
          id="sqft"
          type="number"
          placeholder="e.g., 45"
          value={formData.sqft}
          onChange={(e) => updateFormData({ sqft: e.target.value })}
          min="1"
          step="0.1"
        />
      </div>

      <div>
        <Label htmlFor="edgeProfile">Edge Profile</Label>
        <Select
          value={formData.edgeProfile}
          onValueChange={(value) => updateFormData({ edgeProfile: value })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {EDGE_PROFILES.map((edge) => (
              <SelectItem key={edge.value} value={edge.value}>
                {edge.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sinkCutouts">Sink Cutouts</Label>
          <Input
            id="sinkCutouts"
            type="number"
            placeholder="1"
            value={formData.sinkCutouts}
            onChange={(e) => updateFormData({ sinkCutouts: e.target.value })}
            min="0"
          />
        </div>

        <div>
          <Label htmlFor="backsplashLf">Backsplash (Linear Ft)</Label>
          <Input
            id="backsplashLf"
            type="number"
            placeholder="e.g., 12"
            value={formData.backsplashLf}
            onChange={(e) => updateFormData({ backsplashLf: e.target.value })}
            min="0"
            step="0.1"
          />
        </div>
      </div>
    </div>
  );

  const renderCabinetFields = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="baseLf">Base Cabinets (Linear Ft) *</Label>
          <Input
            id="baseLf"
            type="number"
            placeholder="e.g., 12"
            value={formData.baseLf}
            onChange={(e) => updateFormData({ baseLf: e.target.value })}
            min="0"
            step="0.1"
          />
        </div>

        <div>
          <Label htmlFor="wallLf">Wall Cabinets (Linear Ft)</Label>
          <Input
            id="wallLf"
            type="number"
            placeholder="e.g., 10"
            value={formData.wallLf}
            onChange={(e) => updateFormData({ wallLf: e.target.value })}
            min="0"
            step="0.1"
          />
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <Label htmlFor="tallUnits">Tall Units/Pantries</Label>
          <Input
            id="tallUnits"
            type="number"
            placeholder="e.g., 2"
            value={formData.tallUnits}
            onChange={(e) => updateFormData({ tallUnits: e.target.value })}
            min="0"
          />
        </div>

        <div>
          <Label htmlFor="drawerStacks">Drawer Stacks</Label>
          <Input
            id="drawerStacks"
            type="number"
            placeholder="e.g., 3"
            value={formData.drawerStacks}
            onChange={(e) => updateFormData({ drawerStacks: e.target.value })}
            min="0"
          />
        </div>
      </div>

      <div className="text-sm text-gray-600">
        <p>* At least base or wall cabinet linear feet is required</p>
      </div>
    </div>
  );

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <div>
          <DialogTitle className="flex items-center gap-2">
            <Calculator className="h-5 w-5" />
            Request a Quote
          </DialogTitle>
          <DialogDescription>
            Get an instant estimate for your project. All fields marked with *
            are required.
          </DialogDescription>
        </div>

        <div className="space-y-6">
          {/* Category Selection */}
          <div>
            <Label>Project Type</Label>
            <Tabs
              value={formData.category}
              onValueChange={(value) =>
                updateFormData({ category: value as any })
              }
            >
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger
                  value="countertop"
                  className="flex items-center gap-2"
                >
                  <Package className="h-4 w-4" />
                  Countertops
                </TabsTrigger>
                <TabsTrigger
                  value="cabinet"
                  className="flex items-center gap-2"
                >
                  <Home className="h-4 w-4" />
                  Cabinets
                </TabsTrigger>
                <TabsTrigger value="combo" className="flex items-center gap-2">
                  <Hammer className="h-4 w-4" />
                  Both
                </TabsTrigger>
              </TabsList>

              <TabsContent value="countertop" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Countertop Details
                    </CardTitle>
                    <CardDescription>
                      Tell us about your countertop project
                    </CardDescription>
                  </CardHeader>
                  <CardContent>{renderCountertopFields()}</CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="cabinet" className="mt-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Cabinet Details</CardTitle>
                    <CardDescription>
                      Tell us about your cabinet project
                    </CardDescription>
                  </CardHeader>
                  <CardContent>{renderCabinetFields()}</CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="combo" className="mt-4">
                <div className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Package className="h-5 w-5" />
                        Countertop Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>{renderCountertopFields()}</CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Home className="h-5 w-5" />
                        Cabinet Details
                      </CardTitle>
                    </CardHeader>
                    <CardContent>{renderCabinetFields()}</CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          </div>

          {/* Common Fields */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Ruler className="h-5 w-5" />
                Project Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div>
                <Label htmlFor="zipcode">ZIP Code (Optional)</Label>
                <Input
                  id="zipcode"
                  placeholder="e.g., 20151"
                  value={formData.zipcode}
                  onChange={(e) => updateFormData({ zipcode: e.target.value })}
                  maxLength={10}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Helps us provide more accurate pricing and availability
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Project Photos Upload */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Project Photos (optional)
              </CardTitle>
              <CardDescription>
                Upload photos of your space to help us provide a more accurate
                quote
              </CardDescription>
            </CardHeader>
            <CardContent>
              <FileUploader
                onImagesUploaded={handleImagesUploaded}
                onError={handleUploadError}
                onUploadStatusChange={handleUploadStatusChange}
              />
              <p className="text-xs text-gray-500 mt-3">
                Up to 8 photos, max 10 MB each. You can take photos with your
                phone.
              </p>
              {uploadedImages.length > 0 && (
                <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
                  <CheckCircle className="h-4 w-4" />
                  {uploadedImages.length}{' '}
                  {uploadedImages.length === 1 ? 'image' : 'images'} uploaded
                  successfully
                </p>
              )}
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <div className="flex items-center gap-2 p-3 bg-red-50 border border-red-200 rounded-lg text-red-800">
              <AlertCircle className="h-4 w-4" />
              <span className="text-sm">{error}</span>
            </div>
          )}
        </div>

        <div className="flex justify-end space-x-2 mt-6">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading || hasUploadingFiles}
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || hasUploadingFiles}
            title={
              hasUploadingFiles
                ? 'Please wait for all files to upload'
                : undefined
            }
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating Quote...
              </>
            ) : hasUploadingFiles ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading Files...
              </>
            ) : (
              <>
                <Calculator className="mr-2 h-4 w-4" />
                Get a Quote
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
