'use client'

import { useState } from 'react';
import { calcHrsGivenRange, generateCertificateByActivity, generateCertificateByTime } from './helper';
import withAuth from '../../../hoc/withAuth';
import { useSearchParams } from 'next/navigation';


const RequestCertificatePage = ({user}) => {
  const reqActivityId = useSearchParams().get('reqActivityId');
  const [selectedOption, setSelectedOption] = useState(reqActivityId ? 'byActivity' : '');
  const [selectedActivity, setSelectedActivity] = useState(reqActivityId ? user.activities_attended.find(activity => activity.activity_id === reqActivityId) : null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [pdfUrl, setPdfUrl] = useState(null);

  const handleSubmitActivity = async (e) => {
    e.preventDefault();
    console.log('Requesting Certificate:', { selectedOption, selectedActivity });

    const generatedPdfUrl = await generatePdfActivity();
    setPdfUrl(generatedPdfUrl);
  };

  const generatePdfActivity = async () => {
    const pdfBytes = await generateCertificateByActivity(user.name, selectedActivity.activity_name, selectedActivity.activity_date, selectedActivity.activity_hours);
    const previewBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    const previewUrl = URL.createObjectURL(previewBlob);
    return previewUrl;
  };

  const handleSubmitTime = async (e) => {
    e.preventDefault();
    console.log('Requesting Certificate:', { selectedOption, startDate, endDate });

    const generatedPdfUrl = await generatePdfTime();
    setPdfUrl(generatedPdfUrl);
  };

  const generatePdfTime = async () => {
    const hours = calcHrsGivenRange(user.activities_attended, startDate, endDate);
    const pdfBytes = await generateCertificateByTime(user.name, startDate, endDate, hours);
    const previewBlob = new Blob([pdfBytes], { type: 'application/pdf' });
    const previewUrl = URL.createObjectURL(previewBlob);
    return previewUrl;
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
          <form onSubmit={handleSubmitActivity}>
            <label style={styles.inputBlock}>
              Select Activity:
              <select
                value={selectedActivity ? selectedActivity.activity_id : ''}
                onChange={(e) => {
                  const selectedActivityId = e.target.value;
                  const selectedActivityObject = user.activities_attended.find(activity => activity.activity_id === selectedActivityId,);
                  setSelectedActivity(selectedActivityObject);
                }}
                style={styles.input}
              >
                <option value="">Select Activity</option>
                {user.activities_attended.map(activity => (
                  <option key={activity.activity_id} value={activity.activity_id}>
                    {activity.activity_name}
                  </option>
                ))}
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
          <form onSubmit={handleSubmitTime}>
            <label style={styles.inputBlock}>
              Start Date:
              <input
                type="month"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={styles.input}
                required
              />
            </label>

            <label style={styles.inputBlock}>
              End Date:
              <input
                type="month"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={styles.input}
                required
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

export default withAuth(RequestCertificatePage);
