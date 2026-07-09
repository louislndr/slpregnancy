'use client';
import { useState } from 'react';
import FileUpload from './FileUpload';

interface Asset { name: string; url: string }

const F = 'Raleway, sans-serif';
const M = 'Montserrat, sans-serif';

const cardStyle = {
  background: 'white', borderRadius: 24, border: '1px solid #E8E0F0',
  boxShadow: '0 2px 16px rgba(79,69,128,0.05)', overflow: 'hidden',
};

export default function AssetUploader({ audioFiles, visualFiles }: { audioFiles: Asset[]; visualFiles: Asset[] }) {
  const [audio, setAudio] = useState(audioFiles);
  const [visuals, setVisuals] = useState(visualFiles);
  const [copied, setCopied] = useState<string | null>(null);

  async function copyToClipboard(url: string) {
    await navigator.clipboard.writeText(url);
    setCopied(url);
    setTimeout(() => setCopied(null), 1500);
  }

  function FileRow({ f, icon }: { f: Asset; icon: React.ReactNode }) {
    return (
      <div className="flex items-center gap-3 px-5 py-3" style={{ borderBottom: '1px solid #F0EBF8' }}>
        {icon}
        <div className="flex-1 min-w-0">
          <p className="truncate" style={{ fontFamily: M, fontWeight: 600, fontSize: 13, color: '#4F4580' }}>{f.name}</p>
          <p className="truncate" style={{ fontFamily: M, fontSize: 11, color: '#A0A0B8' }}>{f.url}</p>
        </div>
        <button
          onClick={() => copyToClipboard(f.url)}
          className="shrink-0 px-3 py-1 rounded-full transition-all"
          style={{
            fontFamily: M, fontWeight: 600, fontSize: 11,
            background: copied === f.url ? '#DBE8F0' : '#F9F7FF',
            color: copied === f.url ? '#699BA9' : '#A0A0B8',
            border: '1px solid #E8E0F0',
          }}
        >
          {copied === f.url ? 'Copied!' : 'Copy URL'}
        </button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="flex flex-col gap-4">
        <p style={{ fontFamily: F, fontWeight: 700, fontSize: 16, color: '#4F4580' }}>Audio Files</p>
        <FileUpload bucket="audio" accept="audio/*" label="Upload MP3 / audio" onUploaded={(url) => {
          setAudio((prev) => [{ name: url.split('/').pop()!, url }, ...prev]);
        }} />
        <div style={cardStyle}>
          {audio.length === 0
            ? <p className="text-center py-10" style={{ fontFamily: M, fontSize: 13, color: '#A0A0B8' }}>No audio files yet</p>
            : audio.map((f) => (
              <FileRow key={f.name} f={f} icon={
                <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: '#DBE8F0' }}>
                  <span style={{ fontSize: 14 }}>♪</span>
                </div>
              } />
            ))}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <p style={{ fontFamily: F, fontWeight: 700, fontSize: 16, color: '#4F4580' }}>Visuals</p>
        <FileUpload bucket="visuals" accept="image/*,video/*" label="Upload image / video" onUploaded={(url) => {
          setVisuals((prev) => [{ name: url.split('/').pop()!, url }, ...prev]);
        }} />
        <div style={cardStyle}>
          {visuals.length === 0
            ? <p className="text-center py-10" style={{ fontFamily: M, fontSize: 13, color: '#A0A0B8' }}>No visuals yet</p>
            : visuals.map((f) => (
              <FileRow key={f.name} f={f} icon={
                f.name.match(/\.(jpg|jpeg|png|webp|gif)$/i)
                  // eslint-disable-next-line @next/next/no-img-element
                  ? <img src={f.url} alt={f.name} className="w-8 h-8 object-cover rounded-full shrink-0" />
                  : <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0" style={{ background: '#FFE6D5' }}>
                      <span style={{ fontSize: 14 }}>▶</span>
                    </div>
              } />
            ))}
        </div>
      </div>
    </div>
  );
}
