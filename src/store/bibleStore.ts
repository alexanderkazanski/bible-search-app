import { create } from 'zustand';
import type { SearchFilters, SearchResult, SavedVerse } from '../types/bible';

interface BibleStore {
  // Navigation state
  currentBook: string;
  currentChapter: string;
  setCurrentBook: (book: string) => void;
  setCurrentChapter: (chapter: string) => void;
  navigateToVerse: (book: string, chapter: string) => void;
  
  // Search state
  searchFilters: SearchFilters;
  setSearchFilters: (filters: Partial<SearchFilters>) => void;
  searchResults: SearchResult[];
  setSearchResults: (results: SearchResult[]) => void;
  isSearching: boolean;
  setIsSearching: (searching: boolean) => void;
  
  // UI state
  showSearchPanel: boolean;
  setShowSearchPanel: (show: boolean) => void;
  showSavedVerses: boolean;
  setShowSavedVerses: (show: boolean) => void;
  
  // Saved verses state
  savedVerses: SavedVerse[];
  addSavedVerse: (verse: Omit<SavedVerse, 'id' | 'savedAt'>) => void;
  removeSavedVerse: (id: string) => void;
  loadSavedVerses: () => void;
}

const initialSearchFilters: SearchFilters = {
  searchText: '',
  selectedBooks: [],
  chapterStart: '',
  chapterEnd: '',
  verseStart: '',
  verseEnd: '',
};

export const useBibleStore = create<BibleStore>((set) => ({
  // Navigation state
  currentBook: 'Genesis',
  currentChapter: '1',
  setCurrentBook: (book) => set({ currentBook: book, currentChapter: '1' }),
  setCurrentChapter: (chapter) => set({ currentChapter: chapter }),
  navigateToVerse: (book, chapter) => set({ 
    currentBook: book, 
    currentChapter: chapter,
    showSearchPanel: false,
  }),
  
  // Search state
  searchFilters: initialSearchFilters,
  setSearchFilters: (filters) => set((state) => ({ 
    searchFilters: { ...state.searchFilters, ...filters } 
  })),
  searchResults: [],
  setSearchResults: (results) => set({ searchResults: results }),
  isSearching: false,
  setIsSearching: (searching) => set({ isSearching: searching }),
  
  // UI state
  showSearchPanel: false,
  setShowSearchPanel: (show) => set({ showSearchPanel: show }),
  showSavedVerses: false,
  setShowSavedVerses: (show) => set({ showSavedVerses: show }),
  
  // Saved verses state
  savedVerses: [],
  addSavedVerse: (verse) => set((state) => {
    const newVerse: SavedVerse = {
      ...verse,
      id: `${verse.book}-${verse.chapter}-${verse.verse}-${Date.now()}`,
      savedAt: new Date().toISOString(),
    };
    const updated = [...state.savedVerses, newVerse];
    localStorage.setItem('savedVerses', JSON.stringify(updated));
    return { savedVerses: updated };
  }),
  removeSavedVerse: (id) => set((state) => {
    const updated = state.savedVerses.filter(v => v.id !== id);
    localStorage.setItem('savedVerses', JSON.stringify(updated));
    return { savedVerses: updated };
  }),
  loadSavedVerses: () => {
    const saved = localStorage.getItem('savedVerses');
    if (saved) {
      set({ savedVerses: JSON.parse(saved) });
    }
  },
}));