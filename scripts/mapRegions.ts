import fs from 'fs';

const positions = JSON.parse(fs.readFileSync('scripts/pdf_positions.json', 'utf8'));

console.log('=== PAGE 1 FIELDS BY REGION ===');
const p1 = positions.filter((p: any) => p.page === 1);

console.log('\nTop Header Region (y > 700):');
p1.filter((p: any) => p.y > 700).forEach((p: any) => console.log(`  ${p.name}: x=${p.x}, y=${p.y}, w=${p.width}, h=${p.height} (${p.type})`));

console.log('\nAbilities Column Region (x < 100, 300 < y < 700):');
p1.filter((p: any) => p.x < 100 && p.y > 200 && p.y <= 700).forEach((p: any) => console.log(`  ${p.name}: x=${p.x}, y=${p.y}, w=${p.width}, h=${p.height} (${p.type})`));

console.log('\nSaving Throws / Skills Region (100 <= x < 250, 300 < y < 700):');
p1.filter((p: any) => p.x >= 100 && p.x < 250 && p.y > 300 && p.y <= 700).forEach((p: any) => console.log(`  ${p.name}: x=${p.x}, y=${p.y}, w=${p.width}, h=${p.height} (${p.type})`));

console.log('\nCombat Vitals Region (240 <= x < 400, 500 < y < 750):');
p1.filter((p: any) => p.x >= 240 && p.x < 420 && p.y > 500 && p.y <= 750).forEach((p: any) => console.log(`  ${p.name}: x=${p.x}, y=${p.y}, w=${p.width}, h=${p.height} (${p.type})`));

console.log('\nAttacks Region (200 <= x < 420, 200 < y <= 550):');
p1.filter((p: any) => p.x >= 200 && p.x < 420 && p.y > 200 && p.y <= 550).forEach((p: any) => console.log(`  ${p.name}: x=${p.x}, y=${p.y}, w=${p.width}, h=${p.height} (${p.type})`));

console.log('\nFeatures & Traits Region (x >= 400):');
p1.filter((p: any) => p.x >= 400).forEach((p: any) => console.log(`  ${p.name}: x=${p.x}, y=${p.y}, w=${p.width}, h=${p.height} (${p.type})`));

