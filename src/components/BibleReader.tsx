import React from 'react';
import styled from 'styled-components';
import { useBibleStore } from '../store/bibleStore';
import type { BibleData } from '../types/bible';

interface BibleReaderProps {
  bibleData: BibleData;
}

const BibleReaderContainer = styled.div`
  animation: fadeIn 0.5s ease;
  
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(10px); }
    to { opacity: 1; transform: translateY(0); }
  }
`;

const ChapterHeader = styled.div`
  margin-bottom: 1.5rem;
  padding-bottom: 0.75rem;
  border-bottom: 3px solid;
  border-image: linear-gradient(135deg, #ffd700 0%, #dc2626 100%) 1;
  text-align: center;
  
  @media (min-width: 768px) {
    margin-bottom: 2rem;
    padding-bottom: 1rem;
  }
`;

const BookTitle = styled.h2`
  font-family: 'Cinzel', serif;
  font-size: 1.5rem;
  font-weight: 700;
  color: #4a0e4e;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
  letter-spacing: 0.05em;
  
  @media (min-width: 768px) {
    font-size: 2rem;
  }
  
  @media (min-width: 1024px) {
    font-size: 2.5rem;
  }
`;

const ChapterTitle = styled.h3`
  font-family: 'Cinzel', serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #810000;
  margin: 0.5rem 0 0 0;
  letter-spacing: 0.05em;
  
  @media (min-width: 768px) {
    font-size: 1.5rem;
  }
`;

const VersesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  
  @media (min-width: 768px) {
    gap: 1.5rem;
  }
`;

const Verse = styled.div`
  line-height: 1.8;
  display: flex;
  align-items: flex-start;
  padding: 0.5rem;
  border-radius: 8px;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(255, 215, 0, 0.1);
  }
`;

const VerseNumber = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
  color: #1a0a2e;
  border-radius: 50%;
  font-weight: 700;
  font-size: 0.875rem;
  margin-right: 0.75rem;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(255, 215, 0, 0.4);
  font-family: 'Cinzel', serif;
`;

const VerseText = styled.span`
  color: #1a0a2e;
  font-size: 1.125rem;
  font-family: 'Cormorant Garamond', serif;
  line-height: 1.8;
  flex: 1;
`;

const EmptyState = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  color: #ffd700;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1.25rem;
  font-style: italic;
`;

export const BibleReader: React.FC<BibleReaderProps> = ({ bibleData }) => {
  const { currentBook, currentChapter } = useBibleStore();
  
  const bookData = bibleData.booksData[currentBook];
  const chapterData = bookData?.chapters.find(ch => ch.chapter === currentChapter);

  if (!chapterData) {
    return (
      <EmptyState>
        <p>Select a book and chapter to begin reading</p>
      </EmptyState>
    );
  }

  return (
    <BibleReaderContainer>
      <ChapterHeader>
        <BookTitle>{currentBook}</BookTitle>
        <ChapterTitle>Chapter {currentChapter}</ChapterTitle>
      </ChapterHeader>
      
      <VersesContainer>
        {chapterData.verses.map((verse) => (
          <Verse key={verse.verse}>
            <VerseNumber>{verse.verse}</VerseNumber>
            <VerseText>{verse.text}</VerseText>
          </Verse>
        ))}
      </VersesContainer>
    </BibleReaderContainer>
  );
};