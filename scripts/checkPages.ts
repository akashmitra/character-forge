import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

async function checkPages() {
  const bytes = fs.readFileSync('template/charactersheet.pdf');
  const pdfDoc = await PDFDocument.load(bytes);
  const pages = pdfDoc.getPages();
  console.log(`Total Pages: ${pages.length}`);
  pages.forEach((p, idx) => {
    const annots = p.node.Annots();
    const count = annots ? annots.size() : 0;
    console.log(`Page ${idx + 1}: size = ${p.getWidth()} x ${p.getHeight()}, annots = ${count}`);
  });
}

checkPages().catch(console.error);

