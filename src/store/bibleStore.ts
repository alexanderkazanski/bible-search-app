import { create } from 'zustand';
import type { SearchFilters, SearchResult } from '../types/bible';

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
}));