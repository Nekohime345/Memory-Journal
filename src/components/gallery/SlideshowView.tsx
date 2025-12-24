
import React, { useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause } from 'lucide-react';
// Changed to type-only import
import type { Memory } from '../../types/memory';

interface SlideshowViewProps {
  memories: Memory[];
  currentSlide: number;
  setCurrentSlide: (index: number) => void;
  isPlaying: boolean;
  setIsPlaying: (playing: boolean) => void;
  formatDate: (date: string) => string;
}
// ... (rest of the component logic remains the same)
const SlideshowView: React.FC<SlideshowViewProps> = ({ 
  memories, currentSlide, setCurrentSlide, isPlaying, setIsPlaying, formatDate 
}) => {
  
  const nextSlide = () => setCurrentSlide((currentSlide + 1) % memories.length);
  const prevSlide = () => setCurrentSlide((currentSlide - 1 + memories.length) % memories.length);

  useEffect(() => {
    let interval: any;
    if (isPlaying && memories.length > 0) {
      interval = setInterval(() => {
        setCurrentSlide((currentSlide + 1) % memories.length);
      }, 3000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, memories.length, currentSlide, setCurrentSlide]);

  if (memories.length === 0) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-black rounded-3xl overflow-hidden shadow-2xl">
        <div className="relative aspect-video">
          <img
            src={memories[currentSlide].image}
            alt="Memory"
            className="w-full h-full object-contain"
          />
          
          <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all">
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white p-3 rounded-full transition-all">
            <ChevronRight className="w-6 h-6" />
          </button>

          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
            <div className="flex items-center justify-between text-white">
              <div>
                <p className="text-xl font-semibold">{formatDate(memories[currentSlide].date)}</p>
                <p className="text-sm text-gray-300">{currentSlide + 1} / {memories.length}</p>
              </div>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="bg-white/20 hover:bg-white/30 backdrop-blur-sm p-3 rounded-full transition-all"
              >
                {isPlaying ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-2 mt-6 overflow-x-auto pb-2">
        {memories.map((memory, index) => (
          <button
            key={memory.id}
            onClick={() => { setCurrentSlide(index); setIsPlaying(false); }}
            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden transition-all ${
              index === currentSlide ? 'ring-4 ring-purple-600 scale-110' : 'opacity-60 hover:opacity-100'
            }`}
          >
            <img src={memory.image} alt="" className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default SlideshowView;
