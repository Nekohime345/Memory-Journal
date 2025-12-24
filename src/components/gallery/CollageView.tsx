
import React from 'react';
// Changed to type-only import
import type { Memory } from '../../types/memory';

interface CollageViewProps {
  memories: Memory[];
  onSelect: (memory: Memory) => void;
  formatDate: (date: string) => string;
}
// ... (rest of the component logic remains the same)
const CollageView: React.FC<CollageViewProps> = ({ memories, onSelect, formatDate }) => {
  return (
    <div className="grid grid-cols-12 gap-4 auto-rows-[200px]">
      {memories.map((memory, index) => {
        const patterns = [
          'col-span-6 row-span-2',
          'col-span-6 row-span-1',
          'col-span-6 row-span-1',
          'col-span-4 row-span-2',
          'col-span-4 row-span-1',
          'col-span-4 row-span-1',
        ];
        const pattern = patterns[index % patterns.length];
        
        return (
          <div
            key={memory.id}
            onClick={() => onSelect(memory)}
            className={`${pattern} relative overflow-hidden rounded-2xl shadow-lg cursor-pointer group`}
          >
            <img
              src={memory.image}
              alt="Memory"
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <p className="font-semibold text-sm">{formatDate(memory.date)}</p>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default CollageView;
