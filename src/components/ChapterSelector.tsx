import React from 'react';
import styled from 'styled-components';
import { useBibleStore } from '../store/bibleStore';
import type { BibleData } from '../types/bible';

interface ChapterSelectorProps {
  bibleData: BibleData;
}

const ChapterSelectorContainer = styled.div`
  margin-top: 1.5rem;
`;

const ChapterTitle = styled.h3`
  font-family: 'Cinzel', serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: #ffd700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.75rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const ChaptersGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 0.5rem;
  
  @media (max-width: 480px) {
    grid-template-columns: repeat(4, 1fr);
  }
  
  @media (min-width: 768px) {
    gap: 0.75rem;
  }
`;

const ChapterButton = styled.button<{ isActive: boolean }>`
  padding: 0.75rem 0.5rem;
  font-size: 0.75rem;
  border-radius: 8px;
  border: 2px solid;
  font-family: 'Cormorant Garamond', serif;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.isActive 
    ? 'linear-gradient(135deg, #ffd700 0%, #ffb347 100%)'
    : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.isActive ? '#1a0a2e' : '#ffd700'};
  border-color: ${props => props.isActive ? '#ffd700' : 'rgba(255, 215, 0, 0.3)'};
  box-shadow: ${props => props.isActive 
    ? '0 4px 12px rgba(255, 215, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.3)'
    : 'none'};
  min-height: 44px; /* Better touch target */
  
  @media (min-width: 768px) {
    font-size: 0.875rem;
    padding: 0.75rem 0.5rem;
  }
  
  &:hover {
    background: ${props => props.isActive 
      ? 'linear-gradient(135deg, #ffd700 0%, #ffb347 100%)'
      : 'rgba(255, 215, 0, 0.2)'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const ChapterSelector: React.FC<ChapterSelectorProps> = ({ bibleData }) => {
  const { currentBook, currentChapter, setCurrentChapter } = useBibleStore();
  
  const bookData = bibleData.booksData[currentBook];
  const chapters = bookData?.chapters || [];

  return (
    <ChapterSelectorContainer>
      <ChapterTitle>Chapters</ChapterTitle>
      <ChaptersGrid>
        {chapters.map((chapter) => (
          <ChapterButton
            key={chapter.chapter}
            isActive={currentChapter === chapter.chapter}
            onClick={() => setCurrentChapter(chapter.chapter)}
          >
            {chapter.chapter}
          </ChapterButton>
        ))}
      </ChaptersGrid>
    </ChapterSelectorContainer>
  );
};