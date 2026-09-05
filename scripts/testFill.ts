import fs from 'fs';
import { PDFDocument } from 'pdf-lib';

async function testFill() {
  const bytes = fs.readFileSync('template/charactersheet.pdf');
  const pdfDoc = await PDFDocument.load(bytes);
  const form = pdfDoc.getForm();
  
  console.log(`Page count: ${pdfDoc.getPageCount()}`);
  
  // Fill each text field with its own name to easily see where each field is located on the page!
  const fields = form.getFields();
  let textCount = 0;
  fields.forEach(f => {
    if (f.constructor.name === 'PDFTextField') {
      try {
        const tf = form.getTextField(f.getName());
        tf.setText(f.getName());
        textCount++;
      } catch (e) {}
    }
  });

  const filledBytes = await pdfDoc.save();
  fs.writeFileSync('scripts/debug_filled.pdf', filledBytes);
  console.log(`Filled ${textCount} text fields with their own field names into scripts/debug_filled.pdf`);
}

testFill().catch(console.error);

