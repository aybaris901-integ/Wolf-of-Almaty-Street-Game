'use client';
import { useEffect, useRef } from 'react';

interface FullscreenVideoOverlayProps {
  src: string;
  onFinish: () => void;
}

export default function FullscreenVideoOverlay({ src, onFinish }: FullscreenVideoOverlayProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const vid = videoRef.current;
    if (!vid) return;
    vid.play().catch(() => onFinish());
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        width: '100dvw',
        height: '100dvh',
        maxWidth: '100%',
        overflow: 'hidden',
        background: '#000',
        zIndex: 9999,
      }}
    >
      <video
        ref={videoRef}
        src={src}
        style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
        playsInline
        onEnded={onFinish}
        onError={onFinish}
      />
      <button
        onClick={onFinish}
        style={{
          position: 'absolute',
          top: 'max(16px, env(safe-area-inset-top))',
          right: 'max(16px, env(safe-area-inset-right))',
          background: 'rgba(255,255,255,0.15)',
          border: '1px solid rgba(255,255,255,0.3)',
          color: '#fff',
          minHeight: '44px',
          padding: '8px 20px',
          borderRadius: '8px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: 600,
          zIndex: 10000,
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
        }}
      >
        Skip
      </button>
    </div>
  );
}
