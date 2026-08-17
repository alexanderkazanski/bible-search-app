import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Read the Books.json file
const booksPath = path.join(__dirname, '../../Books.json');
const books = JSON.parse(fs.readFileSync(booksPath, 'utf8'));

// Create the bible data object
const bibleData = {
  books: books,
  booksData: {}
};

// Read each book's JSON file
books.forEach(book => {
  const bookFileName = book.replace(/\s+/g, '') + '.json';
  const bookPath = path.join(__dirname, '../../', bookFileName);
  
  if (fs.existsSync(bookPath)) {
    const bookData = JSON.parse(fs.readFileSync(bookPath, 'utf8'));
    bibleData.booksData[book] = bookData;
  }
});

// Write the bundled data to a new file
const outputPath = path.join(__dirname, '../src/data/bible-data.json');
fs.writeFileSync(outputPath, JSON.stringify(bibleData, null, 2));

console.log('Bible data bundled successfully!');
console.log(`Output: ${outputPath}`);
console.log(`Total books: ${Object.keys(bibleData.booksData).length}`);