"use client";

import { useState } from "react";
import { arrayUnion } from "firebase/firestore";
import { db } from "../../firebase/config";
import calculateUserExp from "../../utils/calculateUserExp";
// import withAuth from "../../hoc/withAuth";

const CreatePost = ({ activityId, activityName, user, classes }) => {
  const userId = user.uid;
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [postType, setPostType] = useState("reflection");
  const [postText, setPostText] = useState("");
  const [image, setImage] = useState(null);

  const handleAnonymousChange = (e) => {
    setIsAnonymous(e.target.checked);
  };

  const handlePostTypeChange = (e) => {
    setPostType(e.target.value);
  };

  const handlePostTextChange = (e) => {
    setPostText(e.target.value);
  };

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0];
    setImage(selectedImage);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const currentDate = new Date();

      const postRef = await db.collection("Posts").add({
        activity_id: activityId,
        activity_name: activityName,
        content: postText,
        datetime_posted: currentDate,
        isanonymous: isAnonymous,
        type: postType,
        image: "",
        user_id: userId,
      });

      const newPostId = postRef.id;

      const userRef = db.collection("Users").doc(userId);
      await userRef
        .update({
          posts: arrayUnion(newPostId),
        })
        .then(async () => {
          const newExp = await calculateUserExp(user);
          return userRef.update({
            exp_points: newExp,
          });
        });
    } catch (error) {
      console.error("Error updating field:", error);
    }
  };

  return (
    <div className={classes["postform"]}>
      <h1>Create a Post</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            <input
              type="checkbox"
              checked={isAnonymous}
              onChange={handleAnonymousChange}
            />
            Anonymous
          </label>
        </div>

        <div>
          <label>Post Type:</label>
          <select value={postType} onChange={handlePostTypeChange}>
            <option value="reflection">Reflection</option>
            <option value="feedback">Feedback</option>
          </select>
        </div>

        <div className={classes["postcontent"]}>
          <label>Post Text:</label>
          <textarea
            value={postText}
            onChange={handlePostTextChange}
            rows="4"
            cols="50"
          />
        </div>

        <div>
          <label>Upload Image:</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>

        <div>
          <button type="submit">Submit Post</button>
        </div>
      </form>
    </div>
  );
};

export default CreatePost;
