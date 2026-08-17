import React from 'react';
import styled from 'styled-components';
import { useBibleStore } from '../store/bibleStore';
import { highlightSearchTerm } from '../utils/bibleSearch';

const SearchResultsContainer = styled.div`
  border-top: 2px solid rgba(255, 215, 0, 0.2);
`;

const ResultsHeader = styled.div`
  padding: 1rem;
  background: rgba(255, 215, 0, 0.1);
  border-bottom: 2px solid rgba(255, 215, 0, 0.2);
`;

const ResultsCount = styled.h3`
  font-family: 'Cinzel', serif;
  font-weight: 600;
  color: #ffd700;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.3);
`;

const ResultsList = styled.div`
  max-height: 24rem;
  overflow-y: auto;
`;

const ResultItem = styled.div`
  padding: 1rem;
  border-bottom: 1px solid rgba(255, 215, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    background: rgba(255, 215, 0, 0.1);
  }
`;

const ResultHeader = styled.div`
  font-weight: 600;
  color: #ffd700;
  margin-bottom: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-family: 'Cinzel', serif;
`;

const BookName = styled.span`
  color: #dc2626;
`;

const VerseReference = styled.span`
  color: #9333ea;
  font-size: 0.875rem;
`;

const ResultText = styled.div`
  color: #e0e0e0;
  font-size: 0.875rem;
  line-height: 1.6;
  font-family: 'Cormorant Garamond', serif;
`;

const EmptyResults = styled.div`
  padding: 1rem;
  text-align: center;
  color: #ffd700;
  font-family: 'Cormorant Garamond', serif;
  font-style: italic;
`;

export const SearchResults: React.FC = () => {
  const { searchResults, searchFilters, navigateToVerse } = useBibleStore();

  if (searchResults.length === 0) {
    return (
      <EmptyResults>
        <p>No results found. Try adjusting your search criteria.</p>
      </EmptyResults>
    );
  }

  return (
    <SearchResultsContainer>
      <ResultsHeader>
        <ResultsCount>Found {searchResults.length} results</ResultsCount>
      </ResultsHeader>
      
      <ResultsList>
        {searchResults.map((result, index) => (
          <ResultItem
            key={`${result.book}-${result.chapter}-${result.verse}-${index}`}
            onClick={() => navigateToVerse(result.book, result.chapter)}
          >
            <ResultHeader>
              <BookName>{result.book}</BookName>
              <VerseReference>{result.chapter}:{result.verse}</VerseReference>
            </ResultHeader>
            <ResultText
              dangerouslySetInnerHTML={{
                __html: highlightSearchTerm(result.text, searchFilters.searchText)
              }}
            />
          </ResultItem>
        ))}
      </ResultsList>
    </SearchResultsContainer>
  );
};