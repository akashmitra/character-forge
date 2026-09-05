import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

async function mapFields() {
  const bytes = fs.readFileSync('template/charactersheet.pdf');
  const pdfDoc = await PDFDocument.load(bytes);
  const form = pdfDoc.getForm();
  const fields = form.getFields();

  console.log(`Total fields: ${fields.length}`);
  const fieldList = fields.map(f => {
    return {
      name: f.getName(),
      type: f.constructor.name
    };
  });
  
  fs.writeFileSync('scripts/pdf_fields.json', JSON.stringify(fieldList, null, 2));
  console.log('Wrote fields to scripts/pdf_fields.json');
}

mapFields().catch(console.error);

