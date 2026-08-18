import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useBibleStore } from '../store/bibleStore';
import type { BibleData } from '../types/bible';

interface BibleReaderProps {
  bibleData: BibleData;
  currentBook: string;
  currentChapter: string;
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
  position: relative;
  
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

const SaveButton = styled.button<{ isSaved: boolean }>`
  background: ${props => props.isSaved 
    ? 'linear-gradient(135deg, #ffd700 0%, #ffb347 100%)' 
    : 'rgba(255, 255, 255, 0.8)'};
  border: 2px solid ${props => props.isSaved ? '#ffd700' : 'rgba(255, 215, 0, 0.3)'};
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 0.5rem;
  flex-shrink: 0;
  color: ${props => props.isSaved ? '#1a0a2e' : '#ffd700'};
  font-size: 1rem;
  box-shadow: ${props => props.isSaved 
    ? '0 2px 8px rgba(255, 215, 0, 0.4)' 
    : '0 2px 4px rgba(0, 0, 0, 0.1)'};
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const CopyButton = styled.button<{ isCopied: boolean }>`
  background: ${props => props.isCopied 
    ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)' 
    : 'rgba(255, 255, 255, 0.8)'};
  border: 2px solid ${props => props.isCopied ? '#22c55e' : 'rgba(255, 215, 0, 0.3)'};
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 0.5rem;
  flex-shrink: 0;
  color: ${props => props.isCopied ? '#fff' : '#ffd700'};
  font-size: 1rem;
  box-shadow: ${props => props.isCopied 
    ? '0 2px 8px rgba(34, 197, 94, 0.4)' 
    : '0 2px 4px rgba(0, 0, 0, 0.1)'};
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const SpeakButton = styled.button`
  background: rgba(255, 255, 255, 0.8);
  border: 2px solid rgba(255, 215, 0, 0.3);
  border-radius: 50%;
  width: 2rem;
  height: 2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.3s ease;
  margin-left: 0.5rem;
  flex-shrink: 0;
  color: #ffd700;
  font-size: 1rem;
  
  &:hover {
    transform: scale(1.1);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
  }
  
  &:active {
    transform: scale(0.95);
  }
`;

const ReadControls = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-top: 0.75rem;
`;

const ReadButton = styled.button`
  background: linear-gradient(135deg, #ffd700 0%, #ffb347 100%);
  color: #1a0a2e;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 8px;
  font-family: 'Cinzel', serif;
  font-weight: 600;
  font-size: 0.75rem;
  cursor: pointer;
  transition: all 0.3s ease;
  
  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(255, 215, 0, 0.4);
  }
`;

const StopButton = styled(ReadButton)`
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: #fff;
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

export const BibleReader: React.FC<BibleReaderProps> = ({ bibleData, currentBook, currentChapter }) => {
  const { savedVerses, addSavedVerse, removeSavedVerse } = useBibleStore();
  const [copiedVerse, setCopiedVerse] = useState<string | null>(null);
  
  const bookData = bibleData.booksData[currentBook];
  const chapterData = bookData?.chapters.find(ch => ch.chapter === currentChapter);

  const isVerseSaved = (verseNum: string) => {
    return savedVerses.some(
      v => v.book === currentBook && v.chapter === currentChapter && v.verse === verseNum
    );
  };

  const handleSaveVerse = (verseNum: string, text: string) => {
    if (isVerseSaved(verseNum)) {
      const verseToRemove = savedVerses.find(
        v => v.book === currentBook && v.chapter === currentChapter && v.verse === verseNum
      );
      if (verseToRemove) {
        removeSavedVerse(verseToRemove.id);
      }
    } else {
      addSavedVerse({
        book: currentBook,
        chapter: currentChapter,
        verse: verseNum,
        text: text,
      });
    }
  };

  const handleCopyVerse = (verseNum: string, text: string) => {
    const verseToCopy = `${currentBook} ${currentChapter}:${verseNum} - ${text}`;
    navigator.clipboard.writeText(verseToCopy).then(() => {
      setCopiedVerse(verseNum);
      setTimeout(() => setCopiedVerse(null), 2000);
    });
  };

  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const handleSpeakVerse = (text: string) => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    window.speechSynthesis.speak(utterance);
  };

  const handleReadChapter = () => {
    if (!chapterData) return;
    window.speechSynthesis.cancel();
    chapterData.verses.forEach(verse => {
      const utterance = new SpeechSynthesisUtterance(`${verse.verse}. ${verse.text}`);
      window.speechSynthesis.speak(utterance);
    });
  };

  const handleStop = () => {
    window.speechSynthesis.cancel();
  };

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
        <ReadControls>
          <ReadButton onClick={handleReadChapter}>Read chapter</ReadButton>
          <StopButton onClick={handleStop}>Stop</StopButton>
        </ReadControls>
      </ChapterHeader>
      
      <VersesContainer>
        {chapterData.verses.map((verse) => (
          <Verse key={verse.verse}>
            <VerseNumber>{verse.verse}</VerseNumber>
            <VerseText>{verse.text}</VerseText>
            <SaveButton
              isSaved={isVerseSaved(verse.verse)}
              onClick={() => handleSaveVerse(verse.verse, verse.text)}
              title={isVerseSaved(verse.verse) ? 'Remove from saved' : 'Save verse'}
            >
              {isVerseSaved(verse.verse) ? '♥' : '♡'}
            </SaveButton>
            <CopyButton
              isCopied={copiedVerse === verse.verse}
              onClick={() => handleCopyVerse(verse.verse, verse.text)}
              title={copiedVerse === verse.verse ? 'Copied!' : 'Copy verse'}
            >
              {copiedVerse === verse.verse ? '✓' : '⎘'}
            </CopyButton>
            <SpeakButton
              onClick={() => handleSpeakVerse(verse.text)}
              title="Read verse aloud"
            >
              ▶
            </SpeakButton>
          </Verse>
        ))}
      </VersesContainer>
    </BibleReaderContainer>
  );
};