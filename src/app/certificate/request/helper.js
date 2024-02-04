'use client'
import { PDFDocument, rgb, PDFFont, StandardFonts} from 'pdf-lib';
import { projectStorage } from '../../../firebase/config';
import fontkit from '@pdf-lib/fontkit';


const generateCertificateByActivity = async (volunteerName, eventName, eventDate, volunteerHours) => {
  const certificateRef = projectStorage.ref('General/certificate_template.pdf');

  try {
    const templateUrl = await certificateRef.getDownloadURL();
    const templateBytes = await fetch(templateUrl).then((res) => res.arrayBuffer());
    const pdfDoc = await PDFDocument.load(templateBytes);
    // This is for custom font (haven figure out)
    // pdfDoc.registerFontkit(fontkit);
    // const response = await fetch('../../Montserrat-Regular.otf');
    // const fontBytes = await response.arrayBuffer();
    // const customFont = await pdfDoc.embedFont(fontBytes);
    const page = pdfDoc.getPage(0);
    const certContent = `${eventName} on ${eventDate}, contributing ${volunteerHours} hrs of volunteering time.`;

    const nameFont = await pdfDoc.embedFont(StandardFonts.Helvetica)
    const pageWidth = page.getWidth();
    const textWidth1 = nameFont.widthOfTextAtSize(volunteerName, 40);
    const textWidth2 = nameFont.widthOfTextAtSize(certContent, 15);
    const centerX1 = (pageWidth - textWidth1) / 2;
    const centerX2 = (pageWidth - textWidth2) / 2;
    
    page.drawText(`${volunteerName}`, {
      x: centerX1,
      y: 300,
      font: PDFFont.Helvetica,
      color: rgb(0, 0, 0),
      size: 40,
    });

    page.drawText(certContent, {
      x: centerX2,
      y: 250,
      font: PDFFont.Helvetica,
      color: rgb(0, 0, 0),
      size: 15,
    });

    const modifiedPdfBytes = await pdfDoc.save();
    return modifiedPdfBytes;
  } catch (error) {
    console.error('Error generating certificate:', error);
  } 
};

export { generateCertificateByActivity };
