"use client";

import { useEffect, useState } from "react";
import { projectFirestore } from "../../../../firebase/config";

import classes from "./page.module.css";

const Volunteer = ({ params }) => {
  const { id } = params;

  const [activity, setActivity] = useState();

  useEffect(() => {
    const fetchActivityContent = async () => {
      if (id) {
        try {
          const activityDoc = await projectFirestore
            .collection("Activities")
            .doc(id)
            .get();
          if (activityDoc.exists) {
            setActivity(activityDoc.data());
          } else {
            console.log("Activity not found");
          }
        } catch (error) {
          console.error("Error fetching activity content:", error);
        } finally {
          console.log(activity);
        }
      }
    };

    fetchActivityContent();
  }, [id]);

  return (
    <div>
      <li className={classes["image_wrapper"]}>
        <img
          src={activity ? activity.image : "https://source.unsplash.com/VWcPlbHglYc"}
          className={classes["image"]}
        />
        <div className={classes["overlay-main"]}>
          <h1>{activity && activity.name}</h1>
          <h2>{activity && activity.organiser_name}</h2>
          <p>{activity && activity.description}</p>
        </div>
        <div className={classes["overlay-container"]}>
          <h1>Date & Time</h1>
          <p>
            {activity &&
              activity.datetime_start.toDate().toLocaleString("en-EN", {
                year: "numeric",
                month: "long",
                day: "numeric",
              })}
            ,{" "}
            {activity &&
              activity.datetime_start.toDate().toLocaleString("en-EN", {
                weekday: "long",
              })}
          </p>
          <p>
            {activity &&
              activity.datetime_start.toDate().toLocaleString("en-EN", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
            {" to "}
            {activity &&
              activity.datetime_end.toDate().toLocaleString("en-EN", {
                hour: "numeric",
                minute: "numeric",
                hour12: true,
              })}
          </p>
          <button>Sign Up Now</button>
        </div>
      </li>
      <div className={classes["two-column-container"]}>
        <div className={classes["column-left"]}>
          <h1>Description</h1>
          <p>{activity && activity.description}</p>
        </div>
        <div className={classes["column-right"]}>
          <h1>Location</h1>
          <p>{activity && activity.location_name}</p>
          <p>{activity && activity.location_address}</p>
          <br />
          <h1>Tags</h1>
          <ul className={classes["tags"]}>
            {activity &&
              activity.tags.map((tag, index) => <li key={index}>{tag}</li>)}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Volunteer;
