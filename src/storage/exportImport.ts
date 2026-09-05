import { CharacterData } from '../types/character';

export function exportCharacterToJson(character: CharacterData): void {
  const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(character, null, 2));
  const downloadAnchor = document.createElement('a');
  downloadAnchor.setAttribute('href', dataStr);
  const cleanName = (character.name || 'character').replace(/[^a-z0-9]/gi, '_').toLowerCase();
  downloadAnchor.setAttribute('download', `${cleanName}-dnd2024.json`);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function importCharacterFromJson(file: File): Promise<CharacterData> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target?.result as string) as CharacterData;
        if (!parsed.classId || !parsed.speciesId || !parsed.backgroundId) {
          throw new Error('Invalid character file format: Missing core fields.');
        }
        // Ensure unique ID for imported character
        const validated: CharacterData = {
          ...parsed,
          id: 'char_' + Date.now() + '_' + Math.random().toString(36).substring(2, 7),
          updatedAt: Date.now()
        };
        resolve(validated);
      } catch (err) {
        reject(err instanceof Error ? err : new Error('Failed to parse JSON'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

