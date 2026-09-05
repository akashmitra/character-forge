import { openDB, DBSchema, IDBPDatabase } from 'idb';
import { CharacterData } from '../types/character';

interface CharacterForgeDB extends DBSchema {
  characters: {
    key: string;
    value: CharacterData;
    indexes: { 'by-updated': number };
  };
  settings: {
    key: string;
    value: unknown;
  };
}

const DB_NAME = 'dnd-character-forge-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<CharacterForgeDB>> | null = null;

export function getDatabase() {
  if (!dbPromise) {
    dbPromise = openDB<CharacterForgeDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('characters')) {
          const charStore = db.createObjectStore('characters', { keyPath: 'id' });
          charStore.createIndex('by-updated', 'updatedAt');
        }
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
      },
    });
  }
  return dbPromise;
}

export async function saveCharacter(character: CharacterData): Promise<void> {
  const db = await getDatabase();
  const updatedChar: CharacterData = {
    ...character,
    updatedAt: Date.now()
  };
  await db.put('characters', updatedChar);
}

export async function getCharacter(id: string): Promise<CharacterData | undefined> {
  const db = await getDatabase();
  return db.get('characters', id);
}

export async function getAllCharacters(): Promise<CharacterData[]> {
  const db = await getDatabase();
  const characters = await db.getAllFromIndex('characters', 'by-updated');
  return characters.reverse(); // Most recent first
}

export async function deleteCharacter(id: string): Promise<void> {
  const db = await getDatabase();
  await db.delete('characters', id);
}

export async function duplicateCharacter(id: string): Promise<CharacterData | undefined> {
  const original = await getCharacter(id);
  if (!original) return undefined;

  const clone: CharacterData = {
    ...original,
    id: 'char_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
    name: `${original.name} (Copy)`,
    createdAt: Date.now(),
    updatedAt: Date.now()
  };

  await saveCharacter(clone);
  return clone;
}

