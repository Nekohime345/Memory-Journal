
import React, { useState } from 'react';
import { Grid3x3, Images, Play, Sparkles, Camera, X, Clock } from 'lucide-react';
// Changed to type-only import
import type { Memory, User, ViewMode } from '../../types/memory';
import Navbar from '../common/Navbar';
import GridView from './GridView';
import CollageView from './CollageView';
import SlideshowView from './SlideshowView';
import TimelineView from './TimelineView';

interface GalleryPageProps {
  user: User;
  memories: Memory[];
  onNavigate: (page: string) => void;
  onLogout: () => void;
  onDeleteMemory: (id: number) => void;
}
// ... (rest of the component logic remains the same)
const GalleryPage: React.FC<GalleryPageProps> = ({ user, memories, onNavigate, onLogout, onDeleteMemory }) => {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const [slideshowPlaying, setSlideshowPlaying] = useState(false);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);

  const sortedMemories = [...memories].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100">
      <Navbar 
        user={user} 
        onLogout={onLogout}
        actionButton={
          <button
            onClick={() => onNavigate('upload')}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-medium"
          >
            Add Memory
          </button>
        }
      />

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <h2 className="text-4xl font-bold text-gray-800 mb-3">Your Memories</h2>
          <p className="text-gray-600 mb-6">Relive your favorite moments</p>
          
          <div className="flex justify-center gap-3 flex-wrap">
            <button onClick={() => { setViewMode('grid'); setSlideshowPlaying(false); }} className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${viewMode === 'grid' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-purple-100'}`}>
              <Grid3x3 className="w-4 h-4" /> Grid View
            </button>
            <button onClick={() => { setViewMode('collage'); setSlideshowPlaying(false); }} className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${viewMode === 'collage' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-purple-100'}`}>
              <Images className="w-4 h-4" /> Collage
            </button>
            <button onClick={() => { setViewMode('slideshow'); setCurrentSlide(0); }} className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${viewMode === 'slideshow' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-purple-100'}`}>
              <Play className="w-4 h-4" /> Slideshow
            </button>
            <button onClick={() => { setViewMode('timeline'); setSlideshowPlaying(false); }} className={`px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2 ${viewMode === 'timeline' ? 'bg-purple-600 text-white shadow-lg' : 'bg-white text-gray-700 hover:bg-purple-100'}`}>
              <Sparkles className="w-4 h-4" /> Timeline
            </button>
          </div>
        </div>

        {sortedMemories.length === 0 ? (
          <div className="text-center py-20">
            <Camera className="w-20 h-20 text-gray-300 mx-auto mb-4" />
            <p className="text-xl text-gray-500 mb-4">No memories yet</p>
            <button onClick={() => onNavigate('upload')} className="px-6 py-3 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition-colors">
              Add Your First Memory
            </button>
          </div>
        ) : (
          <>
            {viewMode === 'grid' && (
              <GridView memories={sortedMemories} onSelect={setSelectedMemory} onDelete={onDeleteMemory} formatDate={formatDate} />
            )}
            {viewMode === 'collage' && (
              <CollageView memories={sortedMemories} onSelect={setSelectedMemory} formatDate={formatDate} />
            )}
            {viewMode === 'slideshow' && (
              <SlideshowView 
                memories={sortedMemories} 
                currentSlide={currentSlide} 
                setCurrentSlide={setCurrentSlide} 
                isPlaying={slideshowPlaying} 
                setIsPlaying={setSlideshowPlaying} 
                formatDate={formatDate} 
              />
            )}
            {viewMode === 'timeline' && (
              <TimelineView memories={sortedMemories} onSelect={setSelectedMemory} formatDate={formatDate} />
            )}
          </>
        )}
      </div>

      {selectedMemory && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl">
            <div className="relative">
              <img src={selectedMemory.image} alt="Memory" className="w-full max-h-[60vh] object-contain bg-gray-100" />
              <button onClick={() => setSelectedMemory(null)} className="absolute top-4 right-4 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">{formatDate(selectedMemory.date)}</h3>
                  <p className="text-gray-600 flex items-center">
                    <Clock className="w-4 h-4 mr-2" />
                    Added {new Date(selectedMemory.uploadedAt).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => { onDeleteMemory(selectedMemory.id); setSelectedMemory(null); }}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                >
                  Delete Memory
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GalleryPage;
