
import React from 'react';
// Changed to type-only import
import type { Memory } from '../../types/memory';

interface TimelineViewProps {
  memories: Memory[];
  onSelect: (memory: Memory) => void;
  formatDate: (date: string) => string;
}
// ... (rest of the component logic remains the same)
const TimelineView: React.FC<TimelineViewProps> = ({ memories, onSelect, formatDate }) => {
  return (
    <div className="max-w-4xl mx-auto">
      <div className="relative">
        <div className="absolute left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-purple-600 to-pink-600 transform -translate-x-1/2"></div>
        
        {memories.map((memory, index) => (
          <div key={memory.id} className="relative mb-12">
            <div className={`flex items-center ${index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'}`}>
              <div className="w-5/12">
                <div
                  onClick={() => onSelect(memory)}
                  className="bg-white rounded-2xl shadow-xl overflow-hidden cursor-pointer transform hover:scale-105 transition-all"
                >
                  <img src={memory.image} alt="Memory" className="w-full aspect-square object-cover" />
                  <div className="p-4">
                    <p className="font-semibold text-purple-600">{formatDate(memory.date)}</p>
                    <p className="text-sm text-gray-500 mt-1">
                      Added {new Date(memory.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute left-1/2 transform -translate-x-1/2 w-6 h-6 bg-gradient-to-br from-purple-600 to-pink-600 rounded-full border-4 border-white shadow-lg z-10"></div>
              <div className="w-5/12"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TimelineView;
