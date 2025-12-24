
import React from 'react';
import { Calendar, Clock } from 'lucide-react';
// Changed to type-only import
import type { Memory } from '../../types/memory';

interface GridViewProps {
  memories: Memory[];
  onSelect: (memory: Memory) => void;
  onDelete: (id: number) => void;
  formatDate: (date: string) => string;
}
// ... (rest of the component logic remains the same)
const GridView: React.FC<GridViewProps> = ({ memories, onSelect, onDelete, formatDate }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {memories.map((memory) => (
        <div
          key={memory.id}
          onClick={() => onSelect(memory)}
          className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-transform duration-300 cursor-pointer"
        >
          <div className="relative aspect-square">
            <img src={memory.image} alt="Memory" className="w-full h-full object-cover" />
          </div>
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center text-purple-600">
                <Calendar className="w-4 h-4 mr-2" />
                <span className="font-medium">{formatDate(memory.date)}</span>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(memory.id);
                }}
                className="text-red-500 hover:text-red-700 text-sm transition-colors"
              >
                Delete
              </button>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Clock className="w-3 h-3 mr-1" />
              Added {new Date(memory.uploadedAt).toLocaleDateString()}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default GridView;
