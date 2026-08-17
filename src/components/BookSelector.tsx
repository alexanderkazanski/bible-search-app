import React from 'react';
import styled from 'styled-components';
import { useBibleStore } from '../store/bibleStore';

interface BookSelectorProps {
  books: string[];
}

const BookSelectorContainer = styled.div`
  margin-bottom: 1rem;
`;

const SectionTitle = styled.h3<{ color: string }>`
  font-family: 'Cinzel', serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: ${props => props.color};
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.75rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const BooksGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  
  @media (min-width: 768px) {
    gap: 0.75rem;
  }
`;

const BookButton = styled.button<{ isActive: boolean; color: string }>`
  text-align: left;
  padding: 0.75rem 0.75rem;
  font-size: 0.75rem;
  border-radius: 8px;
  border: 2px solid;
  font-family: 'Cormorant Garamond', serif;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.isActive 
    ? `linear-gradient(135deg, ${props.color} 0%, ${props.color}dd 100%)`
    : 'rgba(255, 255, 255, 0.1)'};
  color: ${props => props.isActive ? '#fff' : '#ffd700'};
  border-color: ${props => props.isActive ? props.color : 'rgba(255, 215, 0, 0.3)'};
  box-shadow: ${props => props.isActive 
    ? `0 4px 12px ${props.color}40, inset 0 1px 0 rgba(255, 255, 255, 0.2)`
    : 'none'};
  min-height: 44px; /* Better touch target */
  
  @media (min-width: 768px) {
    font-size: 0.875rem;
    padding: 0.75rem 0.75rem;
  }
  
  &:hover {
    background: ${props => props.isActive 
      ? `linear-gradient(135deg, ${props.color} 0%, ${props.color}dd 100%)`
      : 'rgba(255, 215, 0, 0.2)'};
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const BookSelector: React.FC<BookSelectorProps> = ({ books }) => {
  const { currentBook, setCurrentBook } = useBibleStore();

  // Separate Old Testament and New Testament
  const oldTestament = books.slice(0, 39);
  const newTestament = books.slice(39);

  return (
    <BookSelectorContainer>
      <SectionTitle color="#9333ea">Old Testament</SectionTitle>
      <BooksGrid>
        {oldTestament.map((book) => (
          <BookButton
            key={book}
            isActive={currentBook === book}
            color="#9333ea"
            onClick={() => setCurrentBook(book)}
          >
            {book}
          </BookButton>
        ))}
      </BooksGrid>
      
      <SectionTitle color="#dc2626">New Testament</SectionTitle>
      <BooksGrid style={{ marginBottom: 0 }}>
        {newTestament.map((book) => (
          <BookButton
            key={book}
            isActive={currentBook === book}
            color="#dc2626"
            onClick={() => setCurrentBook(book)}
          >
            {book}
          </BookButton>
        ))}
      </BooksGrid>
    </BookSelectorContainer>
  );
};