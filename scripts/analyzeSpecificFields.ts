import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

async function analyzeSpecificFields() {
  const bytes = fs.readFileSync('template/charactersheet.pdf');
  const pdfDoc = await PDFDocument.load(bytes);
  const form = pdfDoc.getForm();
  
  const positions = JSON.parse(fs.readFileSync('scripts/pdf_positions.json', 'utf8'));
  
  // Page 1 fields
  const p1 = positions.filter((p: any) => p.page === 1);
  const p2 = positions.filter((p: any) => p.page === 2);
  
  console.log(`Page 1 field count: ${p1.length}`);
  console.log(`Page 2 field count: ${p2.length}`);

  // Let's print the top 40 fields of Page 1
  console.log('\n--- Page 1 Top Fields ---');
  p1.slice(0, 40).forEach((f: any) => {
    console.log(`${f.name} (${f.type}): x=${f.x}, y=${f.y}, w=${f.width}, h=${f.height}`);
  });

  // Let's print Page 2 fields
  console.log('\n--- Page 2 Fields ---');
  p2.slice(0, 30).forEach((f: any) => {
    console.log(`${f.name} (${f.type}): x=${f.x}, y=${f.y}, w=${f.width}, h=${f.height}`);
  });
}

analyzeSpecificFields().catch(console.error);

