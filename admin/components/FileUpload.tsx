'use client';
import { useState } from 'react';

interface Props {
  bucket: 'audio' | 'visuals';
  accept: string;
  label: string;
  currentUrl?: string;
  onUploaded: (url: string) => void;
}

const M = 'Montserrat, sans-serif';

export default function FileUpload({ bucket, accept, label, currentUrl, onUploaded }: Props) {
  const [uploading, setUploading] = useState(false);
  const [url, setUrl] = useState(currentUrl ?? '');

  async function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const form = new FormData();
    form.append('file', file);
    form.append('bucket', bucket);
    const res = await fetch('/api/upload', { method: 'POST', body: form });
    const data = await res.json();
    if (data.url) { setUrl(data.url); onUploaded(data.url); }
    setUploading(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <label style={{ fontFamily: M, fontWeight: 600, fontSize: 13, color: '#4F4580' }}>{label}</label>
      <label className="flex items-center gap-3 px-4 py-3 rounded-2xl cursor-pointer transition-colors" style={{ border: '1.5px dashed #BEB5DA', background: '#F9F7FF' }}>
        <span style={{ fontFamily: M, fontSize: 13, color: '#699BA9', fontWeight: 600 }}>
          {uploading ? 'Uploading…' : 'Choose file'}
        </span>
        <input type="file" accept={accept} onChange={handleChange} disabled={uploading} className="hidden" />
      </label>
      {url && !uploading && (
        <p style={{ fontFamily: M, fontSize: 12, color: '#699BA9' }} className="truncate">✓ {url}</p>
      )}
    </div>
  );
}
