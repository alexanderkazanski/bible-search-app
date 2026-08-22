import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle } from 'styled-components';
import { useBibleStore } from './store/bibleStore';
import { BookSelector } from './components/BookSelector';
import { ChapterSelector } from './components/ChapterSelector';
import { BibleReader } from './components/BibleReader';
import { SearchResults } from './components/SearchResults';
import { SavedVerses } from './components/SavedVerses';
import { quickSearch } from './utils/bibleSearch';
import { useBibleData } from './hooks/useBibleData';

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

const VersionSelect = styled.select`
  font-family: 'Cinzel', serif;
  font-size: 0.75rem;
  color: #ffd700;
  background: linear-gradient(135deg, rgba(139, 0, 0, 0.6) 0%, rgba(75, 0, 130, 0.6) 100%);
  padding: 0.25rem 0.75rem;
  border-radius: 20px;
  border: 2px solid rgba(255, 215, 0, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
  appearance: none;
  -webkit-appearance: none;
  outline: none;
  cursor: pointer;
  
  @media (min-width: 768px) {
    font-size: 0.875rem;
    padding: 0.5rem 1rem;
  }

  &:hover {
    border-color: rgba(255, 215, 0, 0.6);
  }

  option {
    color: #1a0a2e;
    background: #ffd700;
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


const SavedVersesButton = styled.button`
  background: linear-gradient(135deg, #9333ea 0%, #dc2626 100%);
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  font-size: 0.75rem;
  cursor: pointer;
  box-shadow: 
    0 4px 12px rgba(147, 51, 234, 0.4),
    inset 0 1px 0 rgba(255, 255, 255, 0.3);
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-right: 0.5rem;
  
  @media (min-width: 768px) {
    padding: 0.75rem 1rem;
    font-size: 0.875rem;
    gap: 0.5rem;
    margin-right: 0.75rem;
  }
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 
      0 6px 16px rgba(147, 51, 234, 0.5),
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

const SavedVersesPanelContainer = styled.aside<{ isOpen: boolean }>`
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
    showSavedVerses,
    setShowSavedVerses,
    searchFilters,
    setSearchFilters,
    setSearchResults,
    setIsSearching,
    currentBook,
    currentChapter,
    setCurrentBook,
    setCurrentChapter,
    loadSavedVerses,
  } = useBibleStore();

  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { bibleData, isLoading, version, setVersion, versions } = useBibleData();

  // Load saved verses on mount
  useEffect(() => {
    loadSavedVerses();
  }, [loadSavedVerses]);

  if (isLoading || !bibleData) {
    return (
      <AppContainer style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Title>Loading Bible…</Title>
      </AppContainer>
    );
  }


  // Handle quick search from header
  const handleQuickSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSearching(true);
    setShowSavedVerses(false);
    setTimeout(() => {
      if (!bibleData) return;
      const results = quickSearch(bibleData, searchFilters.searchText);
      setSearchResults(results);
      setIsSearching(false);
      setShowSearchPanel(true);
    }, 100);
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
              <VersionSelect value={version} onChange={(e) => { setVersion(e.target.value); setCurrentBook('Genesis'); setCurrentChapter('1'); }}>
                {versions.map((v) => (
                  <option key={v.id} value={v.id}>{v.label}</option>
                ))}
              </VersionSelect>
            </LogoSection>
            
            <SearchForm onSubmit={handleQuickSearch}>
              <SearchInput
                type="text"
                placeholder="Search the Bible..."
                value={searchFilters.searchText}
                onChange={(e) => setSearchFilters({ searchText: e.target.value })}
              />
            </SearchForm>
            
            <SavedVersesButton onClick={() => {
              setShowSavedVerses(!showSavedVerses);
              if (showSearchPanel) setShowSearchPanel(false);
            }}>
              <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
            </SavedVersesButton>
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
              <BookSelector books={bibleData.books} />
              <div style={{ marginTop: '1.5rem' }}>
                <ChapterSelector bibleData={bibleData} />
              </div>
            </MobileNavContent>
          </MobileNavOverlay>

          <Sidebar>
            <BookSelector books={bibleData.books} />
            <div style={{ marginTop: '1.5rem' }}>
              <ChapterSelector bibleData={bibleData} />
            </div>
          </Sidebar>

          <SearchPanelContainer isOpen={showSearchPanel}>
            <SearchResults />
          </SearchPanelContainer>

          <SavedVersesPanelContainer isOpen={showSavedVerses}>
            <SavedVerses />
          </SavedVersesPanelContainer>

          <MainContent>
            <ContentCard>
              <BibleReader bibleData={bibleData} currentBook={currentBook} currentChapter={currentChapter} />
            </ContentCard>
          </MainContent>
        </MainLayout>
      </AppContainer>
    </>
  );
}

export default App;