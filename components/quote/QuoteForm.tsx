'use client';
import { useState } from 'react';
// Use direct imports without the @ alias
import {
  FileUploader as CustomFileUploader,
  UploadedImage,
} from '../../components/FileUploader';
import { Loader2 } from 'lucide-react';
import { openChat, sendVisitorMessage, setSessionData } from '../../lib/crisp';
import { addSessionTags as tagSession } from '../../lib/crisp';
import { toast } from '../../components/ui/use-toast';

export default function QuoteForm({
  productName,
  productId,
}: {
  productName?: string;
  productId?: string;
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState(
    productName ? `I'm interested in getting a quote for ${productName}.` : ''
  );
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !email || !message) {
      toast({
        title: 'Missing information',
        description: 'Please fill out all required fields.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Track this quote request
      tagSession(['quote-request']);

      // Set session data for the customer
      setSessionData({
        name,
        email,
        phone,
        product_of_interest: productName || 'Not specified',
        product_id: productId || 'Not specified',
      });

      // Open chat
      openChat();

      // Prepare message with images if present
      let fullMessage = `
Name: ${name}
Email: ${email}
Phone: ${phone || 'Not provided'}
${productName ? `Product: ${productName}` : ''}

${message}
      `.trim();

      if (uploadedImages.length > 0) {
        fullMessage += `\n\n${uploadedImages.length} image(s) uploaded. Please check the attachments.`;
      }

      // Send the message with a slight delay to ensure chat is open
      setTimeout(() => {
        sendVisitorMessage(fullMessage);
      }, 500);

      toast({
        title: 'Quote request sent',
        description: 'Our team will get back to you shortly.',
      });

      // Reset form fields
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setUploadedImages([]);
    } catch (error) {
      console.error('Error submitting quote request:', error);
      toast({
        title: 'Something went wrong',
        description: 'Please try again or contact us directly.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name" className="text-sm font-medium">
            Name <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="Your name"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-medium">
            Email <span className="text-red-500">*</span>
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
            placeholder="your.email@example.com"
          />
        </div>
      </div>

      <div className="space-y-2">
        <label htmlFor="phone" className="text-sm font-medium">
          Phone Number
        </label>
        <input
          id="phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="(Optional) Your phone number"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="message" className="text-sm font-medium">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 min-h-[120px]"
          required
          placeholder="Please describe what you're looking for..."
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">Add Photos (Optional)</label>
        <CustomFileUploader onImagesUploaded={setUploadedImages} />
        <p className="text-xs text-gray-500">
          Upload photos of your space or inspiration images (max 5 images).
        </p>
      </div>

      {productName && (
        <div className="px-4 py-3 bg-blue-50 border border-blue-100 rounded-md">
          <p className="text-sm text-blue-800">
            You are requesting a quote for <strong>{productName}</strong>. Our
            team will provide pricing and availability information.
          </p>
        </div>
      )}

      <div className="flex justify-center">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:pointer-events-none min-w-[180px]"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin inline" />
              Sending...
            </>
          ) : (
            'Submit Quote Request'
          )}
        </button>
      </div>
    </form>
  );
}
