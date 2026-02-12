import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SlideshowPageProps {
  onBack: () => void;
}

const imageModules = import.meta.glob('../assets/memories/*.{png,jpg,jpeg,webp,avif,gif}', {
  eager: true,
  import: 'default',
});

const memoryImages = Object.entries(imageModules)
  .sort(([a], [b]) => a.localeCompare(b, undefined, { numeric: true }))
  .map(([, value]) => value as string);

const SlideshowPage: React.FC<SlideshowPageProps> = ({ onBack }) => {
  const [index, setIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const total = memoryImages.length;
  const hasImages = total > 0;

  const currentImage = useMemo(() => {
    if (!hasImages) return '';
    return memoryImages[index];
  }, [hasImages, index]);

  useEffect(() => {
    if (!hasImages || !isPlaying) return;

    const timer = window.setInterval(() => {
      setIndex((prev) => (prev + 1) % total);
    }, 3000);

    return () => window.clearInterval(timer);
  }, [hasImages, isPlaying, total]);

  const next = () => setIndex((prev) => (prev + 1) % total);
  const prev = () => setIndex((prev) => (prev - 1 + total) % total);

  return (
    <main className="min-h-dvh bg-black text-white flex flex-col">
      <header className="w-full px-4 sm:px-6 py-4 flex items-center justify-between bg-black/30 backdrop-blur-md">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-lg bg-white/15 hover:bg-white/25 transition-colors"
        >
          Back
        </button>
        <h1 className="text-lg sm:text-xl font-semibold">Memories Slideshow</h1>
        <button
          type="button"
          onClick={() => setIsPlaying((prevState) => !prevState)}
          disabled={!hasImages}
          className="px-4 py-2 rounded-lg bg-white/15 hover:bg-white/25 disabled:opacity-50 disabled:hover:bg-white/15 transition-colors"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </header>

      <section className="flex-1 flex items-center justify-center p-4 sm:p-8">
        {hasImages ? (
          <div className="relative w-full max-w-5xl">
            <img
              src={currentImage}
              alt={`Memory ${index + 1}`}
              className="w-full max-h-[72dvh] object-contain rounded-2xl shadow-2xl"
            />

            <button
              type="button"
              onClick={prev}
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/45 hover:bg-black/60 transition-colors"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full bg-black/45 hover:bg-black/60 transition-colors"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <p className="text-center text-sm sm:text-base text-white/85 mt-4">
              {index + 1} / {total}
            </p>
          </div>
        ) : (
          <div className="text-center max-w-lg px-4">
            <h2 className="text-2xl font-semibold mb-3">No images found</h2>
            <p className="text-white/80">
              Add your photos to <code className="bg-white/10 px-1.5 py-0.5 rounded">src/assets/memories</code> and
              refresh the page.
            </p>
          </div>
        )}
      </section>
    </main>
  );
};

export default SlideshowPage;
