'use client'

import { useState } from 'react';
import { PDFDocument, PDFFont, rgb } from 'pdf-lib';
import { generateCertificateByActivity } from './helper';




const RequestCertificatePage = () => {
  const [selectedOption, setSelectedOption] = useState('');
  const [selectedActivity, setSelectedActivity] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Requesting Certificate:', { selectedOption, selectedActivity, startDate, endDate });

    const generatedPdfUrl = await generatePdf();
    setPdfUrl(generatedPdfUrl);
  };

  const generatePdf = async () => {
    const pdfBytes = await generateCertificateByActivity('Micaella Vivien He', 'Care for the elderly', '20 June 2024', 7);
    const previewBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    const previewUrl = URL.createObjectURL(previewBlob);
    return previewUrl;
  };

  const generatePdfBytes = async () => {
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage();

    const volunteerName = 'John Doe';
    const currentDate = new Date().toLocaleDateString();

    page.drawText(`Certificate of Appreciation\n\nThis is to certify that ${volunteerName} has volunteered on ${currentDate}.\n\nThank you for your dedication and hard work.`, {
      x: 50,
      y: 400,
      font: PDFFont.Helvetica,
      color: rgb(0, 0, 0),
      size: 12,
    });

    return pdfDoc.save();
  };

  return (
    <div style={styles.container}>
      <h1 style={styles.heading}>Request Certificate</h1>

      <form style={styles.form}>
        <label style={styles.radioLabel}>
          <input
            type="radio"
            value="byActivity"
            checked={selectedOption === 'byActivity'}
            onChange={() => setSelectedOption('byActivity')}
          />
          By Activity
        </label>

        <label>
          <input
            type="radio"
            value="byDateRange"
            checked={selectedOption === 'byDateRange'}
            onChange={() => setSelectedOption('byDateRange')}
          />
          By Date Range
        </label>
      </form>

      {selectedOption === 'byActivity' && (
        <section style={styles.section}>
          <h2 style={styles.sectionHeading}>By Activity</h2>
          <form onSubmit={handleSubmit}>
            <label style={styles.inputBlock}>
              Select Activity:
              <select
                value={selectedActivity}
                onChange={(e) => setSelectedActivity(e.target.value)}
                style={styles.input}
              >
                <option value="">Select Activity</option>
                <option value="activity1">Activity 1</option>
                <option value="activity2">Activity 2</option>
              </select>
            </label>

            <button type="submit" style={styles.button}>
              Request Certificate
            </button>
          </form>
        </section>
      )}

      {selectedOption === 'byDateRange' && (
        <section style={styles.section}>
          <h2 style={styles.sectionHeading}>By Date Range</h2>
          <form onSubmit={handleSubmit}>
            <label style={styles.inputBlock}>
              Start Date:
              <input
                type="month"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={styles.input}
              />
            </label>

            <label style={styles.inputBlock}>
              End Date:
              <input
                type="month"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={styles.input}
              />
            </label>

            <button type="submit" style={styles.button}>
              Request Certificate
            </button>
          </form>
        </section>
      )}

      {/* PDF Preview */}
      {pdfUrl && <embed src={pdfUrl} type="application/pdf" width="100%" height="600px" />}
    </div>
  );
};

const styles = {
  container: {
    fontFamily: 'Arial, sans-serif',
    maxWidth: '800px',
    margin: 'auto',
    padding: '20px',
  },
  heading: {
    textAlign: 'center',
  },
  form: {
    marginBottom: '20px',
  },
  radioLabel: {
    marginRight: '20px',
  },
  section: {
    background: '#f5f5f5',
    padding: '15px',
    borderRadius: '5px',
    marginBottom: '20px',
  },
  sectionHeading: {
    color: '#333',
    marginBottom: '10px',
  },
  inputBlock: {
    display: 'block',
    marginBottom: '10px',
  },
  input: {
    marginLeft: '10px',
  },
  button: {
    background: '#4caf50',
    color: 'white',
    padding: '10px',
    border: 'none',
    cursor: 'pointer',
  },
  pdfPreview: {
    marginTop: '20px',
  },
};

export default RequestCertificatePage;
