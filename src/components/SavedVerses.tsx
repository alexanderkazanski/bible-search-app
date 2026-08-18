import React from 'react';
import styled from 'styled-components';
import { useBibleStore } from '../store/bibleStore';

const SavedVersesContainer = styled.div`
  padding: 1.5rem;
  height: 100%;
  overflow-y: auto;
  
  @media (min-width: 768px) {
    padding: 1.5rem;
  }
`;

const PanelHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(255, 215, 0, 0.2);
`;

const PanelTitle = styled.h2`
  font-family: 'Cinzel', serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffd700;
  margin: 0;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.3);
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #ffd700;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.3s ease;
  
  &:hover {
    color: #fff;
  }
`;

const EmptySaved = styled.div`
  text-align: center;
  color: #ffd700;
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
  padding: 2rem 0;
`;

const SavedVerseItem = styled.div`
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 215, 0, 0.2);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1rem;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 215, 0, 0.1);
    border-color: rgba(255, 215, 0, 0.4);
  }
`;

const VerseHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
`;

const VerseReference = styled.span`
  font-family: 'Cinzel', serif;
  font-weight: 600;
  color: #ffd700;
  font-size: 0.875rem;
`;

const DeleteButton = styled.button`
  background: none;
  border: none;
  color: #dc2626;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1.25rem;
  transition: all 0.3s ease;
  
  &:hover {
    color: #ff6b6b;
    transform: scale(1.1);
  }
`;

const VerseText = styled.div`
  color: #e0e0e0;
  font-size: 0.875rem;
  line-height: 1.6;
  font-family: 'Cormorant Garamond', serif;
`;

const VerseDate = styled.div`
  font-size: 0.75rem;
  color: #999;
  margin-top: 0.5rem;
  font-style: italic;
`;

export const SavedVerses: React.FC = () => {
  const { savedVerses, removeSavedVerse, setShowSavedVerses, navigateToVerse } = useBibleStore();

  const handleDelete = (id: string) => {
    removeSavedVerse(id);
  };

  const handleNavigate = (book: string, chapter: string) => {
    navigateToVerse(book, chapter);
    setShowSavedVerses(false);
  };

  if (savedVerses.length === 0) {
    return (
      <SavedVersesContainer>
        <PanelHeader>
          <PanelTitle>Saved Verses</PanelTitle>
          <CloseButton onClick={() => setShowSavedVerses(false)}>
            <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </CloseButton>
        </PanelHeader>
        <EmptySaved>
          <p>No saved verses yet. Click the heart icon on any verse to save it.</p>
        </EmptySaved>
      </SavedVersesContainer>
    );
  }

  return (
    <SavedVersesContainer>
      <PanelHeader>
        <PanelTitle>Saved Verses ({savedVerses.length})</PanelTitle>
        <CloseButton onClick={() => setShowSavedVerses(false)}>
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </CloseButton>
      </PanelHeader>
      
      {savedVerses.map((savedVerse) => (
        <SavedVerseItem key={savedVerse.id}>
          <VerseHeader>
            <VerseReference 
              onClick={() => handleNavigate(savedVerse.book, savedVerse.chapter)}
              style={{ cursor: 'pointer' }}
            >
              {savedVerse.book} {savedVerse.chapter}:{savedVerse.verse}
            </VerseReference>
            <DeleteButton onClick={() => handleDelete(savedVerse.id)}>
              ×
            </DeleteButton>
          </VerseHeader>
          <VerseText>{savedVerse.text}</VerseText>
          <VerseDate>
            Saved {new Date(savedVerse.savedAt).toLocaleDateString()}
          </VerseDate>
        </SavedVerseItem>
      ))}
    </SavedVersesContainer>
  );
};