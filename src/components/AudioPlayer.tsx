'use client'

interface AudioPlayerProps {
  src: string;
  title?: string;
}

export default function AudioPlayer({ src, title }: AudioPlayerProps) {
  return (
    <div className="my-4">
      <audio
        controls
        className="w-full"
        preload="metadata"
      >
        <source src={src} type="audio/mp4" />
        Votre navigateur ne supporte pas la lecture audio.
      </audio>
      {title && (
        <p className="text-xs text-gray-500 mt-1">{title}</p>
      )}
    </div>
  );
} 