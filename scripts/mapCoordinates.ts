import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

async function mapCoordinates() {
  const bytes = fs.readFileSync('template/charactersheet.pdf');
  const pdfDoc = await PDFDocument.load(bytes);
  const form = pdfDoc.getForm();
  const fields = form.getFields();

  const fieldPositions: any[] = [];

  fields.forEach(f => {
    const name = f.getName();
    const type = f.constructor.name;
    const widgets = (f as any).acroField?.getWidgets?.() || [];
    widgets.forEach((w: any, idx: number) => {
      const rect = w.getRectangle();
      const page = pdfDoc.findPageForAnnotationRef(w.ref);
      const pageIdx = page ? pdfDoc.getPages().indexOf(page) : 0;
      fieldPositions.push({
        name,
        type,
        page: pageIdx + 1,
        x: Math.round(rect.x),
        y: Math.round(rect.y),
        width: Math.round(rect.width),
        height: Math.round(rect.height)
      });
    });
  });

  // Sort by page, then y descending (top to bottom), then x ascending (left to right)
  fieldPositions.sort((a, b) => {
    if (a.page !== b.page) return a.page - b.page;
    if (Math.abs(a.y - b.y) > 8) return b.y - a.y;
    return a.x - b.x;
  });

  fs.writeFileSync('scripts/pdf_positions.json', JSON.stringify(fieldPositions, null, 2));
  console.log(`Saved ${fieldPositions.length} widget positions to scripts/pdf_positions.json`);
  console.log('\nTop fields on Page 1 (Header):');
  console.log(fieldPositions.filter(f => f.page === 1).slice(0, 25));
}

mapCoordinates().catch(console.error);

