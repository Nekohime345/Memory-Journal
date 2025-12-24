
export interface Memory {
  id: number;
  image: string;
  date: string;
  uploadedAt: string;
}

export interface User {
  uid: string;
  email: string;
}

export type ViewMode = 'grid' | 'collage' | 'slideshow' | 'timeline';
