import React, { useState } from 'react';
import styled from 'styled-components';
import { useBibleStore } from '../store/bibleStore';
import type { BibleData } from '../types/bible';

interface SearchPanelProps {
  bibleData: BibleData;
  onSearch: () => void;
}

const SearchPanelContainer = styled.div`
  padding: 1rem;
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

const FormGroup = styled.div`
  margin-bottom: 1.5rem;
`;

const Label = styled.label`
  display: block;
  font-family: 'Cinzel', serif;
  font-size: 0.875rem;
  font-weight: 600;
  color: #ffd700;
  margin-bottom: 0.5rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const Input = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  background: rgba(255, 255, 255, 0.95);
  color: #1a0a2e;
  font-family: 'Cormorant Garamond', serif;
  font-size: 1rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  min-height: 44px; /* Better touch target */
  
  &:focus {
    outline: none;
    border-color: #ffd700;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2), 0 0 0 3px rgba(255, 215, 0, 0.2);
  }
`;

const ExpandButton = styled.button<{ color: string }>`
  width: 100%;
  text-align: left;
  padding: 0.75rem 1rem;
  border-radius: 8px;
  border: 2px solid;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  transition: all 0.3s ease;
  background: ${props => props.color === 'purple' 
    ? 'rgba(147, 51, 234, 0.2)' 
    : 'rgba(220, 38, 38, 0.2)'};
  color: ${props => props.color === 'purple' ? '#9333ea' : '#dc2626'};
  border-color: ${props => props.color === 'purple' 
    ? 'rgba(147, 51, 234, 0.4)' 
    : 'rgba(220, 38, 38, 0.4)'};
  display: flex;
  justify-content: space-between;
  align-items: center;
  min-height: 48px; /* Better touch target */
  
  &:hover {
    background: ${props => props.color === 'purple' 
      ? 'rgba(147, 51, 234, 0.3)' 
      : 'rgba(220, 38, 38, 0.3)'};
  }
`;

const Badge = styled.span`
  font-size: 0.75rem;
  background: rgba(255, 215, 0, 0.2);
  color: #ffd700;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  border: 1px solid rgba(255, 215, 0, 0.3);
`;

const BooksList = styled.div`
  margin-top: 0.5rem;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
  max-height: 12rem;
  overflow-y: auto;
  padding: 0.5rem;
  background: rgba(0, 0, 0, 0.2);
  border-radius: 8px;
`;

const BookCheckbox = styled.label<{ color: string }>`
  display: flex;
  align-items: center;
  font-size: 0.875rem;
  color: ${props => props.color === 'purple' ? '#9333ea' : '#dc2626'};
  cursor: pointer;
  padding: 0.5rem;
  border-radius: 4px;
  transition: background 0.3s ease;
  
  &:hover {
    background: rgba(255, 215, 0, 0.1);
  }
`;

const Checkbox = styled.input<{ color: string }>`
  margin-right: 0.5rem;
  width: 1rem;
  height: 1rem;
  accent-color: ${props => props.color === 'purple' ? '#9333ea' : '#dc2626'};
`;

const RangeInputs = styled.div`
  display: flex;
  gap: 0.5rem;
`;

const SearchButton = styled.button`
  width: 100%;
  background: linear-gradient(135deg, #9333ea 0%, #dc2626 100%);
  color: white;
  padding: 0.875rem;
  border-radius: 8px;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  border: none;
  box-shadow: 0 4px 12px rgba(147, 51, 234, 0.4);
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 6px 16px rgba(147, 51, 234, 0.5);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

export const SearchPanel: React.FC<SearchPanelProps> = ({ bibleData, onSearch }) => {
  const { searchFilters, setSearchFilters, setShowSearchPanel } = useBibleStore();
  const [expandedBooks, setExpandedBooks] = useState({
    oldTestament: false,
    newTestament: false,
  });

  const handleBookToggle = (book: string) => {
    const selectedBooks = [...searchFilters.selectedBooks];
    const index = selectedBooks.indexOf(book);
    
    if (index > -1) {
      selectedBooks.splice(index, 1);
    } else {
      selectedBooks.push(book);
    }
    
    setSearchFilters({ selectedBooks });
  };

  const oldTestament = bibleData.books.slice(0, 39);
  const newTestament = bibleData.books.slice(39);

  return (
    <SearchPanelContainer>
      <PanelHeader>
        <PanelTitle>Search Filters</PanelTitle>
        <CloseButton onClick={() => setShowSearchPanel(false)}>
          <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </CloseButton>
      </PanelHeader>

      <FormGroup>
        <Label>Search Text</Label>
        <Input
          type="text"
          value={searchFilters.searchText}
          onChange={(e) => setSearchFilters({ searchText: e.target.value })}
          placeholder="Enter words to search..."
        />
      </FormGroup>

      <FormGroup>
        <Label>Books (leave empty for all)</Label>
        
        <div style={{ marginBottom: '0.75rem' }}>
          <ExpandButton 
            color="purple"
            onClick={() => setExpandedBooks({ ...expandedBooks, oldTestament: !expandedBooks.oldTestament })}
          >
            <span>Old Testament</span>
            <Badge>{searchFilters.selectedBooks.filter(b => oldTestament.includes(b)).length} selected</Badge>
          </ExpandButton>
          {expandedBooks.oldTestament && (
            <BooksList>
              {oldTestament.map((book) => (
                <BookCheckbox key={book} color="purple">
                  <Checkbox 
                    type="checkbox"
                    color="purple"
                    checked={searchFilters.selectedBooks.includes(book)}
                    onChange={() => handleBookToggle(book)}
                  />
                  {book}
                </BookCheckbox>
              ))}
            </BooksList>
          )}
        </div>

        <div>
          <ExpandButton 
            color="red"
            onClick={() => setExpandedBooks({ ...expandedBooks, newTestament: !expandedBooks.newTestament })}
          >
            <span>New Testament</span>
            <Badge>{searchFilters.selectedBooks.filter(b => newTestament.includes(b)).length} selected</Badge>
          </ExpandButton>
          {expandedBooks.newTestament && (
            <BooksList>
              {newTestament.map((book) => (
                <BookCheckbox key={book} color="red">
                  <Checkbox 
                    type="checkbox"
                    color="red"
                    checked={searchFilters.selectedBooks.includes(book)}
                    onChange={() => handleBookToggle(book)}
                  />
                  {book}
                </BookCheckbox>
              ))}
            </BooksList>
          )}
        </div>
      </FormGroup>

      <FormGroup>
        <Label>Chapter Range</Label>
        <RangeInputs>
          <Input
            type="number"
            min="1"
            value={searchFilters.chapterStart}
            onChange={(e) => setSearchFilters({ chapterStart: e.target.value })}
            placeholder="From"
          />
          <Input
            type="number"
            min="1"
            value={searchFilters.chapterEnd}
            onChange={(e) => setSearchFilters({ chapterEnd: e.target.value })}
            placeholder="To"
          />
        </RangeInputs>
      </FormGroup>

      <FormGroup>
        <Label>Verse Range</Label>
        <RangeInputs>
          <Input
            type="number"
            min="1"
            value={searchFilters.verseStart}
            onChange={(e) => setSearchFilters({ verseStart: e.target.value })}
            placeholder="From"
          />
          <Input
            type="number"
            min="1"
            value={searchFilters.verseEnd}
            onChange={(e) => setSearchFilters({ verseEnd: e.target.value })}
            placeholder="To"
          />
        </RangeInputs>
      </FormGroup>

      <SearchButton onClick={onSearch}>
        Search Bible
      </SearchButton>
    </SearchPanelContainer>
  );
};