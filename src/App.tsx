
import { useState } from 'react';
import SlideshowPage from './pages/SlideshowPage';

function App() {
  const [showSlideshow, setShowSlideshow] = useState(false);

  if (showSlideshow) {
    return <SlideshowPage onBack={() => setShowSlideshow(false)} />;
  }

  return (
    <main className="relative min-h-dvh flex items-center justify-center px-4 overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center scale-110"
        style={{
          backgroundImage:
            "url('https://images.stockcake.com/public/a/0/d/a0df3fa1-fd8f-4bd0-8c21-3b6484879741_large/sunset-flower-field-stockcake.jpg')",
          filter: 'blur(8px)',
        }}
      />
      <div className="absolute inset-0 bg-black/30" />

      <section className="relative z-10 w-full max-w-2xl text-center text-white">
        <p
          className="text-3xl sm:text-5xl leading-tight px-2"
          style={{ fontFamily: "'Cormorant Garamond', serif" }}
        >
          "Grateful for the one person who made every moment brighter."
        </p>
        <button
          type="button"
          onClick={() => setShowSlideshow(true)}
          className="mt-10 px-8 py-3.5 rounded-2xl text-lg font-semibold border border-white/35 bg-white/15 backdrop-blur-md shadow-[0_8px_30px_rgba(0,0,0,0.25)] hover:bg-white/25 hover:scale-[1.02] transition-all"
        >
          View Memories
        </button>
      </section>
    </main>
  );
}

export default App;
