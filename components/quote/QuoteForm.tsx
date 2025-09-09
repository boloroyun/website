'use client';
import { useState } from 'react';
import PhotoUploader from '@/components/common/PhotoUploader';
import {
  openChat,
  sendVisitorMessage,
  addSessionTags,
  setSessionData,
} from '@/lib/crisp';

export default function QuoteForm({ productName }: { productName?: string }) {
  const [v, setV] = useState({
    name: '',
    email: '',
    phone: '',
    zip: '',
    material: productName ?? '',
    dimensions: '',
    notes: '',
    photos: [] as string[],
  });
  const set = (k: keyof typeof v) => (e: any) =>
    setV((s) => ({ ...s, [k]: e.target.value }));
  const addPhotos = (urls: string[]) =>
    setV((s) => ({ ...s, photos: [...s.photos, ...urls] }));

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!v.name || !v.email) return alert('Name & email required.');
    addSessionTags(['quote-request']);
    setSessionData({ zip: v.zip || 'n/a', material: v.material || 'n/a' });
    const msg = [
      '🧾 *New Quote Request*',
      `• Name: ${v.name}`,
      `• Email: ${v.email}`,
      v.phone && `• Phone: ${v.phone}`,
      v.zip && `• ZIP: ${v.zip}`,
      v.material && `• Material: ${v.material}`,
      v.dimensions && `• Dimensions: ${v.dimensions}`,
      v.notes && `• Notes: ${v.notes}`,
      v.photos.length
        ? `• Photos:\n${v.photos.map((u) => `  - ${u}`).join('\n')}`
        : '',
    ]
      .filter(Boolean)
      .join('\n');
    openChat();
    sendVisitorMessage(msg);
    sendVisitorMessage('Thanks! Could you estimate this project?');
  };

  return (
    <form
      onSubmit={submit}
      className="grid gap-3 border rounded-md p-4 bg-white"
    >
      <div className="grid md:grid-cols-2 gap-3">
        <input
          className="input"
          placeholder="Full name *"
          value={v.name}
          onChange={set('name')}
        />
        <input
          className="input"
          type="email"
          placeholder="Email *"
          value={v.email}
          onChange={set('email')}
        />
        <input
          className="input"
          placeholder="Phone"
          value={v.phone}
          onChange={set('phone')}
        />
        <input
          className="input"
          placeholder="ZIP"
          value={v.zip}
          onChange={set('zip')}
        />
      </div>
      <input
        className="input"
        placeholder="Material (Quartz, Granite…)"
        value={v.material}
        onChange={set('material')}
      />
      <input
        className="input"
        placeholder="Dimensions (e.g., 10ft + island 60x36)"
        value={v.dimensions}
        onChange={set('dimensions')}
      />
      <PhotoUploader onDone={addPhotos} />
      {!!v.photos.length && (
        <ul className="text-sm text-gray-600 list-disc pl-5">
          {v.photos.map((u, i) => (
            <li key={i} className="truncate">
              {u}
            </li>
          ))}
        </ul>
      )}
      <textarea
        className="textarea"
        rows={4}
        placeholder="Notes"
        value={v.notes}
        onChange={set('notes')}
      />
      <button className="btn btn-primary" type="submit">
        Send to Chat
      </button>
    </form>
  );
}
