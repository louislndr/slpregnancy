'use client';
import { useState } from 'react';
import FileUpload from './FileUpload';

interface Asset { name: string; url: string }

export default function AssetUploader({ audioFiles, visualFiles }: { audioFiles: Asset[]; visualFiles: Asset[] }) {
  const [audio, setAudio] = useState(audioFiles);
  const [visuals, setVisuals] = useState(visualFiles);

  async function copyToClipboard(url: string) {
    await navigator.clipboard.writeText(url);
    alert('URL copied!');
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Audio */}
      <div className="flex flex-col gap-4">
        <h2 className="font-semibold text-gray-800">Audio Files</h2>
        <FileUpload bucket="audio" accept="audio/*" label="Upload MP3 / audio" onUploaded={(url) => {
          const name = url.split('/').pop()!;
          setAudio((prev) => [{ name, url }, ...prev]);
        }} />
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
          {audio.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No audio files yet</p>}
          {audio.map((f) => (
            <div key={f.name} className="flex items-center gap-3 px-4 py-3">
              <span className="text-2xl">🎵</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{f.name}</p>
                <p className="text-xs text-gray-400 truncate">{f.url}</p>
              </div>
              <button onClick={() => copyToClipboard(f.url)} className="text-xs text-[#699BA9] hover:underline shrink-0">Copy URL</button>
            </div>
          ))}
        </div>
      </div>

      {/* Visuals */}
      <div className="flex flex-col gap-4">
        <h2 className="font-semibold text-gray-800">Visuals</h2>
        <FileUpload bucket="visuals" accept="image/*,video/*" label="Upload image / video" onUploaded={(url) => {
          const name = url.split('/').pop()!;
          setVisuals((prev) => [{ name, url }, ...prev]);
        }} />
        <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
          {visuals.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No visuals yet</p>}
          {visuals.map((f) => (
            <div key={f.name} className="flex items-center gap-3 px-4 py-3">
              {f.name.match(/\.(jpg|jpeg|png|webp|gif)$/i) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={f.url} alt={f.name} className="w-10 h-10 object-cover rounded-lg" />
              ) : (
                <span className="text-2xl">🎬</span>
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-700 truncate">{f.name}</p>
                <p className="text-xs text-gray-400 truncate">{f.url}</p>
              </div>
              <button onClick={() => copyToClipboard(f.url)} className="text-xs text-[#699BA9] hover:underline shrink-0">Copy URL</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
