import type { BibleData, BookData, Chapter, Verse } from '../types/bible';

type VersionLoader = { label: string; load: () => Promise<BibleData> };

type JsonVersion = {
  translation?: string;
  books: Array<{
    name: string;
    chapters: Array<{
      chapter: string | number;
      verses: Array<{ verse: string | number; text: string }>;
    }>;
  }>;
};

function toString(value: string | number): string {
  return String(value);
}

function buildKjvData(modules: Record<string, unknown>): BibleData {
  const booksData: Record<string, BookData> = {};
  let canonicalOrder: string[] = [];

  Object.entries(modules).forEach(([path, data]) => {
    if (path.endsWith('/Books.json')) {
      canonicalOrder = data as string[];
      return;
    }

    if (data && typeof data === 'object' && 'book' in data) {
      const book = data as BookData;
      booksData[book.book] = book;
    }
  });

  const books = canonicalOrder.length > 0
    ? canonicalOrder.filter((name) => booksData[name])
    : Object.keys(booksData);

  return { books, booksData };
}

function normalizeJsonVersion(data: JsonVersion): BibleData {
  const books: string[] = [];
  const booksData: Record<string, BookData> = {};

  data.books.forEach((b) => {
    const chapters: Chapter[] = b.chapters.map((c) => ({
      chapter: toString(c.chapter),
      verses: c.verses.map((v) => ({
        verse: toString(v.verse),
        text: v.text,
      })) as Verse[],
    }));

    books.push(b.name);
    booksData[b.name] = { book: b.name, chapters };
  });

  return { books, booksData };
}

const mainModules = import.meta.glob<unknown>('../../main/*.json', {
  eager: false,
  import: 'default',
});

const jsonModules = import.meta.glob<unknown>('../../json/*.json', {
  eager: false,
  import: 'default',
});

export async function loadKjv(): Promise<BibleData> {
  const modules: Record<string, unknown> = {};
  await Promise.all(
    Object.keys(mainModules).map(async (key) => {
      modules[key] = await mainModules[key]();
    })
  );
  return buildKjvData(modules);
}

export const VERSIONS: Record<string, VersionLoader> = {
  kjv: { label: 'KJV', load: loadKjv },
};

Object.entries(jsonModules).forEach(([path, loader]) => {
  const id = (path.split(/[\\/]/).pop() ?? '').replace(/\.json$/, '');
  if (!id) return;

  VERSIONS[id] = {
    label: id,
    load: async () => {
      const data = (await loader()) as JsonVersion;
      return normalizeJsonVersion(data);
    },
  };
});

export function getVersionList(): { id: string; label: string }[] {
  return Object.entries(VERSIONS).map(([id, info]) => ({ id, label: info.label }));
}

export async function loadVersion(id: string): Promise<BibleData> {
  const version = VERSIONS[id];
  if (!version) throw new Error(`Unknown version: ${id}`);
  return version.load();
}
