import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

async function mapPageFields() {
  const bytes = fs.readFileSync('template/charactersheet.pdf');
  const pdfDoc = await PDFDocument.load(bytes);
  const form = pdfDoc.getForm();
  const pages = pdfDoc.getPages();

  const pageFieldMap: Record<number, any[]> = { 1: [], 2: [] };

  pages.forEach((p, pIdx) => {
    const pageNum = pIdx + 1;
    const annots = p.node.Annots();
    if (!annots) return;
    for (let i = 0; i < annots.size(); i++) {
      const annotRef = annots.get(i);
      const annotDict = pdfDoc.context.lookup(annotRef) as any;
      if (annotDict) {
        const rect = annotDict.lookup(pdfDoc.context.obj('Rect'));
        const nameObj = annotDict.lookup(pdfDoc.context.obj('T'));
        const name = nameObj ? nameObj.value || nameObj.toString() : '';
        if (rect && rect.size && rect.size() === 4) {
          const x = Math.round(rect.get(0).asNumber());
          const y = Math.round(rect.get(1).asNumber());
          const x2 = Math.round(rect.get(2).asNumber());
          const y2 = Math.round(rect.get(3).asNumber());
          pageFieldMap[pageNum].push({
            name,
            x,
            y,
            w: x2 - x,
            h: y2 - y
          });
        }
      }
    }
  });

  // Sort Page 1 fields top to bottom
  pageFieldMap[1].sort((a, b) => {
    if (Math.abs(a.y - b.y) > 6) return b.y - a.y;
    return a.x - b.x;
  });

  // Sort Page 2 fields top to bottom
  pageFieldMap[2].sort((a, b) => {
    if (Math.abs(a.y - b.y) > 6) return b.y - a.y;
    return a.x - b.x;
  });

  fs.writeFileSync('scripts/mapped_pages.json', JSON.stringify(pageFieldMap, null, 2));
  console.log(`Page 1 mapped: ${pageFieldMap[1].length} fields`);
  console.log(`Page 2 mapped: ${pageFieldMap[2].length} fields`);
  
  console.log('\nPage 1 Key Fields:');
  pageFieldMap[1].forEach(f => console.log(`  P1: ${f.name} at (${f.x}, ${f.y}) w=${f.w} h=${f.h}`));
}

mapPageFields().catch(console.error);

