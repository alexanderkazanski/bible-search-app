import type { BibleData, SearchResult, SearchFilters } from '../types/bible';

export const searchBible = (bibleData: BibleData, filters: SearchFilters): SearchResult[] => {
  const results: SearchResult[] = [];
  const { searchText, selectedBooks, chapterStart, chapterEnd, verseStart, verseEnd } = filters;

  // Convert range filters to numbers for comparison
  const chStart = chapterStart ? parseInt(chapterStart) : 0;
  const chEnd = chapterEnd ? parseInt(chapterEnd) : Infinity;
  const vStart = verseStart ? parseInt(verseStart) : 0;
  const vEnd = verseEnd ? parseInt(verseEnd) : Infinity;

  // Determine which books to search
  const booksToSearch = selectedBooks.length > 0 ? selectedBooks : bibleData.books;

  booksToSearch.forEach(bookName => {
    const bookData = bibleData.booksData[bookName];
    if (!bookData) return;

    bookData.chapters.forEach(chapter => {
      const chapterNum = parseInt(chapter.chapter);
      
      // Check chapter range filter
      if (chapterNum < chStart || chapterNum > chEnd) return;

      chapter.verses.forEach(verse => {
        const verseNum = parseInt(verse.verse);
        
        // Check verse range filter
        if (verseNum < vStart || verseNum > vEnd) return;

        // Check text search
        if (searchText.trim()) {
          const terms = searchText.toLowerCase().trim().split(/\s+/).filter(Boolean);
          const textLower = verse.text.toLowerCase();
          
          if (!terms.some(term => textLower.includes(term))) return;
        }

        // If all filters pass, add to results
        results.push({
          book: bookName,
          chapter: chapter.chapter,
          verse: verse.verse,
          text: verse.text,
          bookName: bookName,
        });
      });
    });
  });

  return results;
};

export const quickSearch = (bibleData: BibleData, query: string): SearchResult[] => {
  const results: SearchResult[] = [];
  const q = query.toLowerCase().trim();
  if (!q) return results;

  bibleData.books.forEach(bookName => {
    const bookData = bibleData.booksData[bookName];
    if (!bookData) return;

    bookData.chapters.forEach(chapter => {
      chapter.verses.forEach(verse => {
        if (verse.text.toLowerCase().includes(q)) {
          results.push({
            book: bookName,
            chapter: chapter.chapter,
            verse: verse.verse,
            text: verse.text,
            bookName: bookName,
          });
        }
      });
    });
  });

  return results;
};

export const highlightSearchTerm = (text: string, searchTerm: string): string => {
  if (!searchTerm.trim()) return text;
  
  const terms = searchTerm.trim().split(/\s+/).filter(Boolean).map(escapeRegExp).join('|');
  if (!terms) return text;
  
  const regex = new RegExp(`(${terms})`, 'gi');
  return text.replace(regex, '<mark>$1</mark>');
};

const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
};