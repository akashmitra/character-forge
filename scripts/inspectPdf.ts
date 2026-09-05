import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

async function inspectPdf() {
  const bytes = fs.readFileSync('template/charactersheet.pdf');
  const pdfDoc = await PDFDocument.load(bytes);
  const form = pdfDoc.getForm();
  const fields = form.getFields();

  console.log(`Found ${fields.length} form fields in template/charactersheet.pdf:`);
  fields.forEach(f => {
    const name = f.getName();
    const type = f.constructor.name;
    console.log(`- Field: "${name}" (${type})`);
  });
}

inspectPdf().catch(console.error);

