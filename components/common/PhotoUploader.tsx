'use client';
import { useCallback, useState } from 'react';

declare global {
  interface Window {
    cloudinary: any;
  }
}

export default function PhotoUploader({
  onDone,
  multiple = true,
}: {
  onDone: (urls: string[]) => void;
  multiple?: boolean;
}) {
  const [busy, setBusy] = useState(false);

  const open = useCallback(async () => {
    setBusy(true);
    try {
      const res = await fetch('/api/cloudinary/sign');
      if (!res.ok) throw new Error('Sign route error');
      const { cloudName, apiKey, timestamp, signature, folder } =
        await res.json();

      const w = window.cloudinary;
      if (!w) {
        alert('Uploader not loaded yet. Refresh.');
        return;
      }

      const widget = w.createUploadWidget(
        {
          cloudName,
          apiKey,
          uploadSignature: { signature, timestamp }, // <-- signed
          folder,
          multiple,
          sources: ['local', 'camera', 'url'],
          resourceType: 'image',
          maxFileSize: 15_000_000,
        },
        (error: any, result: any) => {
          if (result?.event === 'success') onDone([result.info.secure_url]);
        }
      );
      widget.open();
    } finally {
      setBusy(false);
    }
  }, [onDone, multiple]);

  return (
    <button
      type="button"
      onClick={open}
      disabled={busy}
      className="px-3 py-2 border rounded-md hover:bg-gray-50"
    >
      {busy ? 'Preparing…' : 'Upload Photos'}
    </button>
  );
}
