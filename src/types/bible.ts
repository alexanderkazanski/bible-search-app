export interface Verse {
  verse: string;
  text: string;
}

export interface Chapter {
  chapter: string;
  verses: Verse[];
}

export interface BookData {
  book: string;
  chapters: Chapter[];
}

export interface BibleData {
  books: string[];
  booksData: Record<string, BookData>;
}

export interface SearchResult {
  book: string;
  chapter: string;
  verse: string;
  text: string;
  bookName: string;
}

export interface SearchFilters {
  searchText: string;
  selectedBooks: string[];
  chapterStart: string;
  chapterEnd: string;
  verseStart: string;
  verseEnd: string;
}

export interface NavigationState {
  currentBook: string;
  currentChapter: string;
  currentVerse: string;
}