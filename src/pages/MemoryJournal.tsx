
import React, { useState, useEffect } from 'react';
// Changed to type-only import
import type { Memory, User } from '../types/memory';
import LoginPage from '../components/auth/LoginPage';
import UploadPage from '../components/upload/UploadPage';
import GalleryPage from '../components/gallery/GalleryPage';

// Fix for custom window storage if needed
declare global {
  interface Window {
    storage: any;
  }
}

const MemoryJournal = () => {
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState('login');
  const [memories, setMemories] = useState<Memory[]>([]);

  useEffect(() => {
    if (user) {
      loadMemories();
    }
  }, [user]);

  const loadMemories = async () => {
    if (!user) return;
    try {
      const storageKey = `memories_${user.uid}`;
      const result = await window.storage.get(storageKey);
      if (result && result.value) {
        setMemories(JSON.parse(result.value));
      }
    } catch (error) {
      console.log('No existing memories found');
    }
  };

  const saveMemories = async (newMemories: Memory[]) => {
    if (!user) return;
    try {
      const storageKey = `memories_${user.uid}`;
      await window.storage.set(storageKey, JSON.stringify(newMemories));
    } catch (error) {
      console.error('Error saving memories:', error);
    }
  };

  const handleAuth = (email: string) => {
    const mockUser: User = {
      uid: btoa(email).replace(/=/g, ''),
      email: email
    };
    setUser(mockUser);
    setCurrentPage('upload');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
    setMemories([]);
  };

  const handleImageUpload = async (file: File, date: string) => {
    return new Promise<void>((resolve) => {
      const reader = new FileReader();
      reader.onload = async (event) => {
        if (event.target?.result) {
          const newMemory: Memory = {
            id: Date.now(),
            image: event.target.result as string,
            date: date,
            uploadedAt: new Date().toISOString()
          };
          const updatedMemories = [newMemory, ...memories];
          setMemories(updatedMemories);
          await saveMemories(updatedMemories);
          resolve();
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const deleteMemory = async (id: number) => {
    const updatedMemories = memories.filter(m => m.id !== id);
    setMemories(updatedMemories);
    await saveMemories(updatedMemories);
  };

  if (currentPage === 'login') {
    return <LoginPage onLogin={handleAuth} />;
  }

  if (currentPage === 'upload' && user) {
    return (
      <UploadPage
        user={user}
        memoriesCount={memories.length}
        onUpload={handleImageUpload}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
    );
  }

  if (currentPage === 'gallery' && user) {
    return (
      <GalleryPage
        user={user}
        memories={memories}
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
        onDeleteMemory={deleteMemory}
      />
    );
  }

  return null;
};

export default MemoryJournal;
