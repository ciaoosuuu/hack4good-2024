"use client";

import { useState, useEffect } from "react";
import { db, projectStorage } from "../../../firebase/config";
import { Timestamp, arrayUnion } from "firebase/firestore";
import withAuth from "../../../hoc/withAuth";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";

const formatDateForInput = (timestamp) => {
  if (!timestamp) return '';

  const date = timestamp.toDate();
  const year = date.getFullYear();
  const month = `0${date.getMonth() + 1}`.slice(-2);
  const day = `0${date.getDate()}`.slice(-2);
  const hours = `0${date.getHours()}`.slice(-2);
  const minutes = `0${date.getMinutes()}`.slice(-2);

  return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const CreateActivity = ({user}) => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    datetime_start: null,
    datetime_end: null,
    description: '',
    image: '',
    location_address: '',
    location_name: '',
    activity_name: '',
    activity_type: '',
    organiser_id: '',
    organiser_name: '',
    participants_attended: [],
    participants_signups: [],
    tags: [],
    vacancy_total: 0,
    created_on: null
  });

  const handleImageChange = async (e) => {
    const file = e.target.files[0];

    if (file) {
      // Check if there's a previously uploaded image
      if (formData.image) {
        // Delete the previous image
        try {
          const previousImageRef = projectStorage.refFromURL(formData.image);
          await previousImageRef.delete();
        } catch (error) {
          console.error('Error deleting previous image:', error);
        }
      }

      // Upload the new image
      const storageRef = projectStorage.ref();
      const imageRef = storageRef.child(`Activities/${file.name}`);
      await imageRef.put(file);
      const imageUrl = await imageRef.getDownloadURL();

      setFormData((prevData) => ({
        ...prevData,
        image: imageUrl,
      }));
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name.includes('datetime')) {
      // Handle date fields separately
      const timestampDate = value ? Timestamp.fromDate(new Date(value)) : Timestamp.fromDate(new Date());

      setFormData((prevData) => ({
        ...prevData,
        [name]: timestampDate,
      }));
    } else if (Array.isArray(formData[name])) {
      const newArray = value.split(',').map((item) => item.trim());

      setFormData((prevData) => ({
        ...prevData,
        [name]: newArray,
      }));
    } else {
      const newValue = value;

      setFormData((prevData) => ({
        ...prevData,
        [name]: newValue,
      }));
    }
  };

  const handleTagChange = (e) => {
    const value = e.target.value;

    if ((value.includes(',') || e.key === 'Enter')) {
      e.preventDefault();
  

      const newTag = value.replace(/[\n,]/g, '').trim();
      if (newTag !== '') {
        setFormData((prevData) => ({
          ...prevData,
          tags: [...prevData.tags, newTag],
        }));
        e.target.value = ''; // Clear the input
      }
    }
  };

  const handleRemoveTag = (index) => {
    const updatedTags = [...formData.tags];
    updatedTags.splice(index, 1);
    setFormData((prevData) => ({ ...prevData, tags: updatedTags }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const updatedFormData = {
        ...formData,
        organiser_id: user.uid,
        created_on: Timestamp.fromDate(new Date()),
      };
  
      setFormData(updatedFormData);
      let res = await db.collection('Activities').add(updatedFormData);
      console.log('Activity added successfully!');
      console.log(res.id);
      // TODO: Add acitivty id to user 
      const userRef = db.collection('Users').doc(user.uid);
      await userRef.update({
        activities_created: arrayUnion(res.id)
      });
      // Optionally, you can redirect the user or perform other actions after submission.
      Swal.fire({
        title: "Success!",
        text: "Activity successfully created!",
        icon: "success",
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false, 
        allowOutsideClick: false,
      }).then(
        router.push("/")
      );
      // setTimeout(function () {
      //   router.push("/");
      // }, 1000);
    } catch (error) {
      console.log(error);
      Swal.fire({
        title: "Error!",
        text: error,
        icon: "error",
        timer: 1000,
        timerProgressBar: true,
        showConfirmButton: false,
        allowOutsideClick: false,
      });
    }
  };

  return (
    <div style={styles.form}>
      <label style={styles.label}>
        Activity Name:
        <input type="text" name="activity_name" value={formData.activity_name} onChange={handleChange} style={styles.input} />
      </label>

      <label style={styles.label}>
        Activity Type:
        <select name="activity_type" value={formData.activity_type} onChange={handleChange} style={styles.input}>
          <option value="">Select Type</option>
          <option value="Volunteering">Volunteering</option>
          <option value="Training">Training</option>
          <option value="Workshop">Workshop</option>
        </select>
      </label>

      <label style={styles.label}>
        Description:
        <textarea name="description" value={formData.description} onChange={handleChange} style={{...styles.input, height: '80px'}} />
      </label>

      <label style={styles.label}>
        Image:
        <input type="file" accept="image/*" onChange={handleImageChange} style={styles.input} />
      </label>

      <label style={styles.label}>
        Location Name:
        <input type="text" name="location_name" value={formData.location_name} onChange={handleChange} style={styles.input} />
      </label>

      <label style={styles.label}>
        Location Address:
        <input type="text" name="location_address" value={formData.location_address} onChange={handleChange} style={styles.input} />
      </label>

      <label style={styles.label}>
        Organizer Name:
        <input type="text" name="organiser_name" value={formData.organiser_name} onChange={handleChange} style={styles.input} />
      </label>

      <label style={styles.label}>
        Tags:
        <div style={styles.tagContainer}>
          <input
                type="text"
                name="tags"
                onChange={handleTagChange}
                placeholder="Add tags (press , to add)"
                style={styles.tagInput}
              />
        </div>
        <div style={styles.tagContainer}>
          {formData.tags.map((tag, index) => (
            <div key={index} style={styles.tag}>
              {tag}
              <button type="button" onClick={() => handleRemoveTag(index)} style={styles.removeButton}>
                X
              </button>
            </div>
          ))}

        </div>
      </label>

      <label style={styles.label}>
        Vacancy Total:
        <input type="number" name="vacancy_total" value={formData.vacancy_total} onChange={handleChange} style={styles.input} />
      </label>

      <label style={styles.label}>
        Start Date and Time:
        <input type="datetime-local" name="datetime_start" value={formatDateForInput(formData.datetime_start)} onChange={handleChange} style={styles.input} />
      </label>

      <label style={styles.label}>
        End Date and Time:
        <input type="datetime-local" name="datetime_end" value={formatDateForInput(formData.datetime_end)} onChange={handleChange} style={styles.input} />
      </label>

      <button type="button" onClick={handleSubmit} style={styles.button}>
        Submit
      </button>
    </div>
  );
};

const styles = {
  form: {
    display: 'flex',
    flexDirection: 'column',
    maxWidth: '400px',
    margin: 'auto',
  },
  label: {
    margin: '10px 0',
  },
  input: {
    padding: '8px',
    margin: '5px 0',
    borderRadius: '4px',
    border: '1px solid #ccc',
    width: '100%',
  },
  button: {
    background: '#4caf50',
    color: '#fff',
    padding: '10px',
    borderRadius: '4px',
    border: 'none',
    cursor: 'pointer',
    marginTop: '10px',
  },
  tagContainer: {
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: '5px',
    flexWrap: 'wrap',  // Allow tags to wrap to the next line
    marginBottom: '5px',
  },

  tagInput: {
    padding: '8px',
    borderRadius: '5px',
    border: '1px solid #ccc',
    marginRight: '5px',  // Add marginRight to create spacing between tags
  },
  tag: {
    background: '#4caf50',
    color: '#fff',
    padding: '8px 12px',
    borderRadius: '5px',
    marginRight: '5px',
    marginBottom: '5px',
    display: 'flex',
    alignItems: 'center',
  },

  removeButton: {
    marginLeft: '5px',
    cursor: 'pointer',
    background: '#ff6f6f',
    border: 'none',
    borderRadius: '50%',
    padding: '5px',
    color: '#fff',
    fontWeight: 'bold',
    fontSize: '12px',
  },

};

export default withAuth(CreateActivity);
