'use client'
import { PDFDocument, rgb, PDFFont, StandardFonts} from 'pdf-lib';
import { projectStorage } from '../../../firebase/config';
import fontkit from '@pdf-lib/fontkit';


function formatDate(inputDateString) {
  const options = { day: 'numeric', month: 'short', year: 'numeric' };
  const date = new Date(inputDateString);
  return date.toLocaleDateString('en-US', options);
}

const generateCertificateByActivity = async (volunteerName, eventName, eventDate, volunteerHours) => {
  const certificateRef = projectStorage.ref('General/certificate_activity_template.pdf');

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
    const certContent = `${eventName} on ${formatDate(eventDate.toDate())}, contributing ${volunteerHours} hrs of volunteering time.`;
    
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

const formatYearMonth = (input) => {
  const [year, month] = input.split('-');
  const monthNames = [
    'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const formattedMonth = monthNames[parseInt(month, 10) - 1];
  return `${formattedMonth} ${year}`;
};

const generateCertificateByTime = async (volunteerName, startDate, endDate, volunteerHours) => {
  const certificateRef = projectStorage.ref('General/certificate_time_template.pdf');

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
    const fstartDate = formatYearMonth(startDate)
    const fendDate = formatYearMonth(endDate);

    const certContent = `${volunteerHours} hours of dedicated service between ${fstartDate} and ${fendDate}.`;

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

const isWithinRange = (timestamp, startCondition, endCondition) => {
  const date = new Date(timestamp);

  const startYear = parseInt(startCondition.split('-')[0], 10);
  const startMonth = parseInt(startCondition.split('-')[1], 10);
  const endYear = parseInt(endCondition.split('-')[0], 10);
  const endMonth = parseInt(endCondition.split('-')[1], 10);

  const yearToCheck = date.getFullYear();
  const monthToCheck = date.getMonth() + 1;

  return (
    yearToCheck >= startYear &&
    yearToCheck <= endYear &&
    (yearToCheck > startYear || monthToCheck >= startMonth) &&
    (yearToCheck < endYear || monthToCheck <= endMonth)
  );
};

const calcHrsGivenRange = (records, startDate, endDate) => {
  let totalHrs = 0;
  for (const record of records) {
    if (isWithinRange(record.activity_date.toDate(), startDate, endDate)) {
      totalHrs += record.activity_hours;
    }
  }
  console.log('total hours:');
  console.log(totalHrs);
  return totalHrs;
};

const getDateAndHoursByActivity = (records, activity_id) => {
  for (const record of records) {
    if (record.activity_id === activity_id) {
      return (record.activity_date.toDate(), record.activity_hours);
    }
  };
}

export { generateCertificateByActivity, generateCertificateByTime, calcHrsGivenRange,};
