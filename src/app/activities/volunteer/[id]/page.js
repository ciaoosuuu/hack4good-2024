"use client";

import { useEffect, useState } from "react";
import { db } from "../../../../firebase/config";

import classes from "./page.module.css";

const Volunteer = ({ params }) => {
  const { id } = params;
  const userId = "mGNzGgpP0ZNwxbDDcTsvFGboPtD2";

  const [activity, setActivity] = useState();
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [vacancyRemaining, setVacancyRemaining] = useState(0);

  useEffect(() => {
    const fetchActivityContent = async () => {
      if (id) {
        try {
          const activityDoc = await db.collection("Activities").doc(id).get();
          if (activityDoc.exists) {
            const activityData = activityDoc.data();
            setActivity(activityData);
            setIsSignedUp(activityData.participants_signups.includes(userId));
            setVacancyRemaining(activityData.vacancy_remaining);
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

  const handleSignUp = async () => {
    try {
      const activityRef = db.collection("Activities").doc(id);
      const currentSignups = activity.participants_signups;
      const currentVacancy = activity.vacancy_remaining;

      //   const userRef = db.collection("Users").doc(userId);

      if (!currentSignups.includes(userId)) {
        const newSignups = [...currentSignups, userId]; //to change to var
        const newVacancy = activity.vacancy_remaining - 1;
        await activityRef.update({
          ["participants_signups"]: newSignups,
          ["vacancy_remaining"]: newVacancy,
        });

        // await userRef.update({

        // })

        console.log("Signed up successfully!");
        setIsSignedUp(true);
        setVacancyRemaining(currentVacancy - 1);
      } else {
        console.log("Already signed up.");
      }
    } catch (error) {
      console.error("Error updating field:", error);
    }
  };

  return (
    <div>
      {activity && (
        <div>
          <li className={classes["image_wrapper"]}>
            <img
              src={
                activity
                  ? activity.image
                  : "https://source.unsplash.com/VWcPlbHglYc"
              }
              className={classes["image"]}
            />
            <div className={classes["overlay-main"]}>
              <h1>{activity.name}</h1>
              <h2>{activity.organiser_name}</h2>
              <p>{activity.description}</p>
            </div>
            <div className={classes["overlay-container"]}>
              <h1>Date & Time</h1>
              <p>
                {activity.datetime_start.toDate().toLocaleString("en-EN", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
                ,{" "}
                {activity.datetime_start.toDate().toLocaleString("en-EN", {
                  weekday: "long",
                })}
              </p>
              <p>
                {activity.datetime_start.toDate().toLocaleString("en-EN", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
                {" to "}
                {activity.datetime_end.toDate().toLocaleString("en-EN", {
                  hour: "numeric",
                  minute: "numeric",
                  hour12: true,
                })}
              </p>
              <p>{vacancyRemaining} slots left</p>
              {isSignedUp ? (
                <div className={classes["signedup"]}>Signed Up</div>
              ) : (
                <button onClick={handleSignUp}>Sign Up Now</button>
              )}
            </div>
          </li>
          <div className={classes["two-column-container"]}>
            <div className={classes["column-left"]}>
              <h1>Description</h1>
              <p>{activity.description}</p>
            </div>
            <div className={classes["column-right"]}>
              <h1>Location</h1>
              <p>{activity.location_name}</p>
              <p>{activity.location_address}</p>
              <br />
              <h1>Tags</h1>
              <ul className={classes["tags"]}>
                {activity.tags.map((tag, index) => (
                  <li key={index}>{tag}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Volunteer;
