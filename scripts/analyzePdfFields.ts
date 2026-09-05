import fs from 'fs';
const fields = JSON.parse(fs.readFileSync('scripts/pdf_fields.json', 'utf8'));

console.log('Sample text fields:');
const textFields = fields.filter((f: any) => f.type === 'PDFTextField');
console.log(textFields.map((f: any) => f.name).slice(0, 100));

console.log('\nLooking for character name, ability scores, class, etc:');
const keywords = ['name', 'class', 'race', 'species', 'str', 'dex', 'con', 'int', 'wis', 'cha', 'ac', 'hp', 'speed', 'init', 'feat', 'skill', 'prof', 'align', 'background'];
keywords.forEach(k => {
  const matches = fields.filter((f: any) => f.name.toLowerCase().includes(k));
  console.log(`Keyword "${k}": ${matches.length} matches -> ${matches.map((m: any) => `"${m.name}"`).slice(0, 10).join(', ')}`);
});

