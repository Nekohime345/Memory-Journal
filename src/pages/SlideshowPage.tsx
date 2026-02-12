import { useEffect, useMemo, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface SlideshowPageProps {
  onBack: () => void;
}

const imageModules = import.meta.glob('../assets/memories/**/*.{png,jpg,jpeg,webp,avif,gif}', {
  eager: true,
  import: 'default',
});

interface MonthBucket {
  monthKey: string;
  displayName: string;
  background: string | null;
  slides: Array<{ path: string; src: string }>;
}

interface SlideItem {
  src: string;
  monthKey: string;
  monthName: string;
  background: string;
}

const monthOrder = [
  'july',
  'august',
  'september',
  'october',
  'november',
  'december',
  'january',
  'february',
  'march',
  'april',
  'may',
  'june',
];

const monthRank = new Map(monthOrder.map((month, idx) => [month, idx]));

const bucketsByMonth = new Map<string, MonthBucket>();

Object.entries(imageModules).forEach(([path, mod]) => {
  const match = path.match(/\/memories\/([^/]+)\/([^/]+)$/i);
  if (!match) return;

  const monthKey = match[1].toLowerCase();
  const filename = match[2];
  const fileBaseName = filename.replace(/\.[^.]+$/, '').toLowerCase();
  const src = mod as string;

  const existing = bucketsByMonth.get(monthKey);
  const bucket: MonthBucket =
    existing ??
    {
      monthKey,
      displayName: monthKey.charAt(0).toUpperCase() + monthKey.slice(1),
      background: null,
      slides: [],
    };

  if (fileBaseName === monthKey) {
    bucket.background = src;
  } else {
    bucket.slides.push({ path, src });
  }

  bucketsByMonth.set(monthKey, bucket);
});

const orderedBuckets = Array.from(bucketsByMonth.values())
  .sort((a, b) => {
    const aRank = monthRank.get(a.monthKey) ?? 999;
    const bRank = monthRank.get(b.monthKey) ?? 999;
    if (aRank !== bRank) return aRank - bRank;
    return a.monthKey.localeCompare(b.monthKey);
  })
  .map((bucket) => ({
    ...bucket,
    slides: [...bucket.slides].sort((a, b) => a.path.localeCompare(b.path, undefined, { numeric: true })),
  }));

const slideshowItems: SlideItem[] = orderedBuckets.flatMap((bucket) => {
  const fallbackBackground = bucket.slides[0]?.src ?? '';
  const background = bucket.background ?? fallbackBackground;

  if (bucket.slides.length === 0 && bucket.background) {
    return [
      {
        src: bucket.background,
        monthKey: bucket.monthKey,
        monthName: bucket.displayName,
        background: bucket.background,
      },
    ];
  }

  return bucket.slides.map((slide) => ({
    src: slide.src,
    monthKey: bucket.monthKey,
    monthName: bucket.displayName,
    background,
  }));
});

const preloadImage = (src: string): Promise<void> =>
  new Promise((resolve) => {
    if (!src) {
      resolve();
      return;
    }
    const img = new Image();
    img.src = src;
    img.onload = () => {
      if (typeof img.decode === 'function') {
        img
          .decode()
          .catch(() => undefined)
          .finally(() => resolve());
        return;
      }
      resolve();
    };
    img.onerror = () => resolve();
  });

const SlideshowPage: React.FC<SlideshowPageProps> = ({ onBack }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [pendingIndex, setPendingIndex] = useState<number | null>(null);
  const [isPendingReady, setIsPendingReady] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);

  const total = slideshowItems.length;
  const hasImages = total > 0;
  const transitionMs = 700;

  const currentSlide = useMemo(() => (hasImages ? slideshowItems[activeIndex] : null), [hasImages, activeIndex]);
  const pendingSlide = useMemo(
    () => (hasImages && pendingIndex !== null ? slideshowItems[pendingIndex] : null),
    [hasImages, pendingIndex],
  );

  useEffect(() => {
    if (!hasImages || pendingIndex === null) return;
    let isCancelled = false;
    setIsPendingReady(false);

    const pendingItem = slideshowItems[pendingIndex];
    const nextImageSrc = pendingItem.src;
    const nextBackgroundSrc = pendingItem.background;

    Promise.all([preloadImage(nextImageSrc), preloadImage(nextBackgroundSrc)]).then(() => {
      if (!isCancelled) {
        setIsPendingReady(true);
      }
    });

    return () => {
      isCancelled = true;
    };
  }, [hasImages, pendingIndex]);

  useEffect(() => {
    if (!hasImages || pendingIndex === null || !isPendingReady) return;
    setIsTransitioning(true);
    const timer = window.setTimeout(() => {
      setActiveIndex(pendingIndex);
      setPendingIndex(null);
      setIsPendingReady(false);
      setIsTransitioning(false);
    }, transitionMs);

    return () => window.clearTimeout(timer);
  }, [hasImages, isPendingReady, pendingIndex]);

  useEffect(() => {
    if (!hasImages || !isPlaying) return;

    const timer = window.setInterval(() => {
      if (pendingIndex !== null || isTransitioning) return;
      setPendingIndex((activeIndex + 1) % total);
    }, 3500);

    return () => window.clearInterval(timer);
  }, [activeIndex, hasImages, isPlaying, isTransitioning, pendingIndex, total]);

  const next = () => {
    if (!hasImages || pendingIndex !== null || isTransitioning) return;
    setPendingIndex((activeIndex + 1) % total);
  };

  const prev = () => {
    if (!hasImages || pendingIndex !== null || isTransitioning) return;
    setPendingIndex((activeIndex - 1 + total) % total);
  };

  return (
    <main className="relative min-h-dvh bg-black text-white flex flex-col overflow-hidden">
      <div className="absolute inset-0 bg-black/20" />
      {currentSlide && (
        <>
          <div
            className={`absolute inset-0 bg-cover bg-center scale-110 transition-opacity duration-700 ease-in-out ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
            style={{ backgroundImage: `url('${currentSlide.background}')`, filter: 'blur(10px)' }}
          />
          {pendingSlide && (
            <div
              className={`absolute inset-0 bg-cover bg-center scale-110 transition-opacity duration-700 ease-in-out ${
                isTransitioning ? 'opacity-100' : 'opacity-0'
              }`}
              style={{ backgroundImage: `url('${pendingSlide.background}')`, filter: 'blur(10px)' }}
            />
          )}
        </>
      )}

      <header className="relative z-10 w-full px-4 sm:px-6 py-4 flex items-center justify-between bg-transparent">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-lg border border-white/70 bg-transparent hover:border-white transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]"
        >
          Back
        </button>
        <h1 className="text-lg sm:text-xl font-semibold drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
          {currentSlide ? `${currentSlide.monthName} Memories` : 'Memories Slideshow'}
        </h1>
        <button
          type="button"
          onClick={() => setIsPlaying((prevState) => !prevState)}
          disabled={!hasImages}
          className="px-4 py-2 rounded-lg border border-white/70 bg-transparent hover:border-white disabled:opacity-50 transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]"
        >
          {isPlaying ? 'Pause' : 'Play'}
        </button>
      </header>

      <section className="relative z-10 flex-1 flex items-center justify-center p-4 sm:p-8">
        {hasImages ? (
          <div className="relative w-full max-w-5xl">
            <img
              src={currentSlide?.src}
              alt={`Memory ${activeIndex + 1}`}
              className={`w-full max-h-[72dvh] object-contain rounded-2xl transition-opacity duration-700 ease-in-out ${
                isTransitioning ? 'opacity-0' : 'opacity-100'
              }`}
            />
            {pendingSlide && (
              <img
                src={pendingSlide.src}
                alt={`Memory ${pendingIndex !== null ? pendingIndex + 1 : activeIndex + 1}`}
                className={`absolute inset-0 w-full max-h-[72dvh] object-contain rounded-2xl transition-opacity duration-700 ease-in-out ${
                  isTransitioning ? 'opacity-100' : 'opacity-0'
                }`}
              />
            )}

            <button
              type="button"
              onClick={prev}
              className="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full border border-white/70 bg-transparent hover:border-white transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]"
              aria-label="Previous image"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button
              type="button"
              onClick={next}
              className="absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 p-2 sm:p-3 rounded-full border border-white/70 bg-transparent hover:border-white transition-colors drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]"
              aria-label="Next image"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            <p className="text-center text-sm sm:text-base text-white mt-4 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)]">
              {activeIndex + 1} / {total}
            </p>
          </div>
        ) : (
          <div className="text-center max-w-lg px-4">
            <h2 className="text-2xl font-semibold mb-3">No images found</h2>
            <p className="text-white/80">
              Add photos inside month folders like{' '}
              <code className="bg-white/10 px-1.5 py-0.5 rounded">src/assets/memories/january</code> and keep{' '}
              <code className="bg-white/10 px-1.5 py-0.5 rounded">january.jpg</code> as that month background.
            </p>
          </div>
        )}
      </section>
    </main>
  );
};

export default SlideshowPage;
