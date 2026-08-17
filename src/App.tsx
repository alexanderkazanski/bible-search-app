import React, { useState } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useBibleStore } from './store/bibleStore';
import { BookSelector } from './components/BookSelector';
import { ChapterSelector } from './components/ChapterSelector';
import { BibleReader } from './components/BibleReader';
import { SearchPanel } from './components/SearchPanel';
import { SearchResults } from './components/SearchResults';
import { searchBible } from './utils/bibleSearch';
import bibleData from './data/bible-data.json';
import type { BibleData } from './types/bible';

const typedBibleData = bibleData as BibleData;

const GlobalStyle = createGlobalStyle`
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;500;600;700&family=Cormorant+Garamond:wght@400;500;600;700&family=Inter:wght@400;500;600;700&display=swap');
  
  * {
    box-sizing: border-box;
  }
  
  body {
    margin: 0;
    font-family: 'Cormorant Garamond', 'Georgia', serif;
    background: linear-gradient(135deg, #1a0a2e 0%, #16213e 50%, #0f3460 100%);
    min-height: 100vh;
  }
  
  mark {
    background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
    padding: 2px 6px;
    border-radius: 4px;
    color: #1a0a2e;
    font-weight: 600;
    box-shadow: 0 2px 4px rgba(255, 215, 0, 0.3);
  }
`;

const AppContainer = styled.div`
  min-height: 100vh;
  background: 
    radial-gradient(ellipse at top, rgba(139, 69, 19, 0.1) 0%, transparent 50%),
    radial-gradient(ellipse at bottom, rgba(75, 0, 130, 0.1) 0%, transparent 50%),
    linear-gradient(180deg, #1a0a2e 0%, #16213e 50%, #0f3460 100%);
  background-attachment: fixed;
`;

const Header = styled.header`
  background: linear-gradient(135deg, #4a0e4e 0%, #810000 50%, #4a0e4e 100%);
  padding: 1rem 1rem;
  box-shadow: 
    0 4px 20px rgba(0, 0, 0, 0.5),
    inset 0 1px 0 rgba(255, 215, 0, 0.2),
    inset 0 -1px 0 rgba(0, 0, 0, 0.3);
  border-bottom: 3px solid #ffd700;
  position: relative;
  
  @media (min-width: 768px) {
    padding: 1.5rem 2rem;
  }
  
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffd700' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
    opacity: 0.3;
    pointer-events: none;
  }
`;

const HeaderContent = styled.div`
  max-width: 80rem;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;
`;

const LogoSection = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  
  @media (min-width: 768px) {
    gap: 1rem;
  }
`;

const MobileMenuButton = styled.button`
  display: none;
  background: none;
  border: none;
  color: #ffd700;
  cursor: pointer;
  padding: 0.5rem;
  
  @media (max-width: 1024px) {
    display: block;
  }
  
  &:hover {
    color: #fff;
  }
`;

const Title = styled.h1`
  font-family: 'Cinzel', serif;
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffd700;
  text-shadow: 
    0 2px 4px rgba(0, 0, 0, 0.5),
    0 0 20px rgba(255, 215, 0, 0.3);
  margin: 0;
  letter-spacing: 0.05em;
  
  @media (min-width: 768px) {
    font-size: 2rem;
    letter-spacing: 0.1em;
  }
`;

const KJVBadge = styled.span`
  font-family: 'Cinzel', serif;
  font-size: 0.75rem;
  color: #ffd700;
  background: linear-gradient(135deg, rgba(139, 0, 0, 0.6) 0%, rgba(75, 0, 130, 0.6) 100%);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  
  @media (min-width: 768px) {
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
  }
`;

const SearchForm = styled.form`
  flex: 1;
  max-width: 28rem;
  margin: 0 0.5rem;
  
  @media (min-width: 768px) {
    margin: 0 1rem;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  background: rgba(255, 255, 255, 0.95);
  color: #1a0a2e;
  font-family: 'Cormorant Garamond', serif;
  font-size: 0.875rem;
  box-shadow: 
    0 4px 12px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  
  @media (min-width: 768px) {
    padding: 0.75rem 1rem;
    font-size: 1rem;
  }
  
  &:focus {
    outline: none;
    border-color: #ffd700;
    box-shadow: 
      0 4px 12px rgba(0, 0, 0, 0.3),
      0 0 0 3px rgba(255, 215, 0, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.5);
  }
  
  &::placeholder {
    color: #666;
    font-style: italic;
  }
`;

const FilterButton = styled.button`
  background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
  color: #1a0a2e;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  font-size: 0.75rem;
  cursor: pointer;
  box-shadow: 
    0 4px 12px rgba(255, 215, 0, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  
  @media (min-width: 768px) {
    padding: 0.75rem 1.5rem;
    font-size: 0.875rem;
    gap: 0.5rem;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 6px 16px rgba(255, 215, 0, 0.5),
      inset 0 1px 0 rgba(255, 255, 255, 0.3);
  }
  
  &:active {
    transform: translateY(0);
  }
`;

const MainLayout = styled.div`
  display: flex;
  max-width: 80rem;
  margin: 0 auto;
  min-height: calc(100vh - 80px);
  flex-direction: column;
  
  @media (min-width: 1024px) {
    flex-direction: row;
  }
`;

const MobileNavOverlay = styled.div<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'block' : 'none'};
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  z-index: 40;
  backdrop-filter: blur(4px);
  
  @media (min-width: 1024px) {
    display: none;
  }
`;

const MobileNavContent = styled.div`
  background: linear-gradient(180deg, #1a0a2e 0%, #16213e 100%);
  width: 20rem;
  height: 100%;
  padding: 1.5rem;
  overflow-y: auto;
  box-shadow: 4px 0 20px rgba(0, 0, 0, 0.5);
  border-right: 2px solid rgba(255, 215, 0, 0.2);
`;

const NavHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 2px solid rgba(255, 215, 0, 0.2);
`;

const NavTitle = styled.h2`
  font-family: 'Cinzel', serif;
  font-size: 1.25rem;
  font-weight: 600;
  color: #ffd700;
  margin: 0;
`;

const CloseButton = styled.button`
  background: none;
  border: none;
  color: #ffd700;
  cursor: pointer;
  padding: 0.5rem;
  
  &:hover {
    color: #fff;
  }
`;

const Sidebar = styled.aside`
  display: none;
  width: 20rem;
  background: linear-gradient(180deg, rgba(26, 10, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 100%);
  border-right: 2px solid rgba(255, 215, 0, 0.2);
  padding: 1.5rem;
  overflow-y: auto;
  backdrop-filter: blur(10px);
  flex-shrink: 0;
  
  @media (min-width: 1024px) {
    display: block;
  }
`;

const SearchPanelContainer = styled.aside<{ isOpen: boolean }>`
  display: ${props => props.isOpen ? 'block' : 'none'};
  width: 100%;
  background: linear-gradient(180deg, rgba(26, 10, 46, 0.95) 0%, rgba(22, 33, 62, 0.95) 100%);
  border-right: 2px solid rgba(255, 215, 0, 0.2);
  backdrop-filter: blur(10px);
  flex-shrink: 0;
  
  @media (min-width: 1024px) {
    width: 24rem;
  }
`;

const MainContent = styled.main`
  flex: 1;
  padding: 1rem;
  background: 
    radial-gradient(ellipse at center, rgba(139, 69, 19, 0.05) 0%, transparent 70%),
    linear-gradient(180deg, rgba(26, 10, 46, 0.3) 0%, rgba(22, 33, 62, 0.3) 100%);
  
  @media (min-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (min-width: 1024px) {
    padding: 2rem;
  }
`;

const ContentCard = styled.div`
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.95) 0%, rgba(245, 245, 220, 0.95) 100%);
  border-radius: 16px;
  padding: 1rem;
  max-width: 64rem;
  margin: 0 auto;
  box-shadow: 
    0 8px 32px rgba(0, 0, 0, 0.3),
    inset 0 1px 0 rgba(255, 255, 255, 0.5);
  border: 2px solid rgba(255, 215, 0, 0.2);
  backdrop-filter: blur(10px);
  
  @media (min-width: 768px) {
    padding: 1.5rem;
  }
  
  @media (min-width: 1024px) {
    padding: 2rem;
  }
`;

function App() {
  const {
    showSearchPanel,
    setShowSearchPanel,
    searchFilters,
    setSearchFilters,
    setSearchResults,
    setIsSearching,
    searchResults,
  } = useBibleStore();

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);

  const handleSearch = () => {
    setIsSearching(true);
    // Small delay to allow UI to update
    setTimeout(() => {
      const results = searchBible(typedBibleData, searchFilters);
      setSearchResults(results);
      setIsSearching(false);
    }, 100);
  };

  // Handle quick search from header
  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch();
    setShowSearchPanel(true);
  };

  return (
    <>
      <GlobalStyle />
      <AppContainer>
        <Header>
          <HeaderContent>
            <LogoSection>
              <MobileMenuButton onClick={() => setIsMobileNavOpen(!isMobileNavOpen)}>
                <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </MobileMenuButton>
              <Title>Bible Search</Title>
              <KJVBadge>KJV</KJVBadge>
            </LogoSection>
            
            <SearchForm onSubmit={handleQuickSearch}>
              <SearchInput
                type="text"
                placeholder="Search the Bible..."
                value={searchFilters.searchText}
                onChange={(e) => setSearchFilters({ searchText: e.target.value })}
              />
            </SearchForm>
            
            <FilterButton onClick={() => setShowSearchPanel(!showSearchPanel)}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              {showSearchPanel ? 'Close' : 'Filters'}
            </FilterButton>
          </HeaderContent>
        </Header>

        <MainLayout>
          <MobileNavOverlay isOpen={isMobileNavOpen} onClick={() => setIsMobileNavOpen(false)}>
            <MobileNavContent onClick={(e) => e.stopPropagation()}>
              <NavHeader>
                <NavTitle>Navigation</NavTitle>
                <CloseButton onClick={() => setIsMobileNavOpen(false)}>
                  <svg width="24" height="24" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </CloseButton>
              </NavHeader>
              <BookSelector books={typedBibleData.books} />
              <div style={{ marginTop: '1.5rem' }}>
                <ChapterSelector bibleData={typedBibleData} />
              </div>
            </MobileNavContent>
          </MobileNavOverlay>

          <Sidebar>
            <BookSelector books={typedBibleData.books} />
            <div style={{ marginTop: '1.5rem' }}>
              <ChapterSelector bibleData={typedBibleData} />
            </div>
          </Sidebar>

          <SearchPanelContainer isOpen={showSearchPanel}>
            <SearchPanel bibleData={typedBibleData} onSearch={handleSearch} />
            {searchResults.length > 0 && <SearchResults />}
          </SearchPanelContainer>

          <MainContent>
            <ContentCard>
              <BibleReader bibleData={typedBibleData} />
            </ContentCard>
          </MainContent>
        </MainLayout>
      </AppContainer>
    </>
  );
}

export default App;