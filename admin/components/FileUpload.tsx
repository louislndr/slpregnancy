'use client';
import { useState } from 'react';

interface Props {
  bucket: 'audio' | 'visuals';
  accept: string;
  label: string;
  currentUrl?: string;
  onUploaded: (url: string) => void;
}

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
    if (data.url) {
      setUrl(data.url);
      onUploaded(data.url);
    }
    setUploading(false);
  }

  return (
    <div className="flex flex-col gap-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <input
        type="file"
        accept={accept}
        onChange={handleChange}
        disabled={uploading}
        className="text-sm text-gray-600 file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-[#EEF6F9] file:text-[#699BA9] hover:file:bg-[#DBE8F0] cursor-pointer"
      />
      {uploading && <p className="text-xs text-gray-400">Uploading…</p>}
      {url && !uploading && (
        <p className="text-xs text-green-600 truncate">✓ {url}</p>
      )}
    </div>
  );
}
