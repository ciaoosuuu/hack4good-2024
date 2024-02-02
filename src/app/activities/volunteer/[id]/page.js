"use client";

import { useEffect, useState } from "react";
import { db } from "../../../../firebase/config";

import classes from "./page.module.css";

const Volunteer = ({ params }) => {
  const { id } = params;
  const userId = "mGNzGgpP0ZNwxbDDcTsvFGboPtD2";
  const userRole = "admin";

  const [activity, setActivity] = useState();
  const [isSignedUp, setIsSignedUp] = useState(false);
  const [vacancyRemaining, setVacancyRemaining] = useState(0);
  const [signups, setSignups] = useState([]);

  const [attended, setAttended] = useState([]);

  const attendees = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
      contact: "+1234567890",
      picture:
        "https://firebasestorage.googleapis.com/v0/b/hackforgood-mvc.appspot.com/o/Users%2Fcuterabbit.png?alt=media&token=50ae6081-5abe-4c96-905a-7190597fe4a0",
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane.smith@example.com",
      contact: "+9876543210",
      picture:
        "https://firebasestorage.googleapis.com/v0/b/hackforgood-mvc.appspot.com/o/Users%2Fcuterabbit.png?alt=media&token=50ae6081-5abe-4c96-905a-7190597fe4a0",
    },
    {
      id: 3,
      name: "Bob Johnson",
      email: "bob.johnson@example.com",
      contact: "+1112223333",
      picture:
        "https://firebasestorage.googleapis.com/v0/b/hackforgood-mvc.appspot.com/o/Users%2Fcuterabbit.png?alt=media&token=50ae6081-5abe-4c96-905a-7190597fe4a0",
    },
    {
      id: 4,
      name: "Alice Brown",
      email: "alice.brown@example.com",
      contact: "+4445556666",
      picture:
        "https://firebasestorage.googleapis.com/v0/b/hackforgood-mvc.appspot.com/o/Users%2Fcuterabbit.png?alt=media&token=50ae6081-5abe-4c96-905a-7190597fe4a0",
    },
    {
      id: 5,
      name: "Charlie Wilson",
      email: "charlie.wilson@example.com",
      contact: "+7778889999",
      picture:
        "https://firebasestorage.googleapis.com/v0/b/hackforgood-mvc.appspot.com/o/Users%2Fcuterabbit.png?alt=media&token=50ae6081-5abe-4c96-905a-7190597fe4a0",
    },
  ];

  useEffect(() => {
    const fetchActivityContent = async () => {
      if (id) {
        try {
          const activityDoc = await db.collection("Activities").doc(id).get();
          if (activityDoc.exists) {
            const activityData = activityDoc.data();
            setActivity(activityData);
            setIsSignedUp(activityData.participants_signups.includes(userId));
            setSignups(activityData.participants_signups);
            setVacancyRemaining(
              activityData.vacancy_total -
                activityData.participants_signups.length
            );
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
      //   const userRef = db.collection("Users").doc(userId);

      if (!signups.includes(userId)) {
        setSignups((prevSignups) => [...prevSignups, userId]);

        const activityRef = db.collection("Activities").doc(id);
        await activityRef.update({
          participants_signups: [...signups, userId],
        });

        // await userRef.update({

        // })

        console.log("Signed up successfully!");
        setIsSignedUp(true);
        setVacancyRemaining(
          activity.vacancy_total - (activity.participants_signups.length + 1)
        );
      } else {
        console.log("Already signed up.");
      }
    } catch (error) {
      console.error("Error updating field:", error);
    }
  };

  const handleMark = (attendeeId) => {
    if (!attended.includes(attendeeId)) {
      setAttended((prevAttended) => [...prevAttended, attendeeId]);
    }
    // console.log(attended);
  };

  useEffect(() => {
    console.log(attended);
  }, [attended]);

  const handleSubmit = async () => {
    try {
      const activityRef = db.collection("Activities").doc(id);

      await activityRef.update({
        ["participants_attended"]: attended,
      });

      console.log("Attendance submitted successfully!");

      setAttended([]);
    } catch (error) {
      console.error("Error updating field:", error);
    }
  };

  return (
    <div>
      {activity && (
        <div>
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
          {userRole == "admin" && (
            <div className={classes["container"]}>
              <h1>Attendance</h1>
              <ul className={classes["grid_list"]}>
                {attendees
                  .slice()
                  .sort((a, b) => a.name.localeCompare(b.name))
                  .map((attendee, index) => (
                    <li key={attendee.id} className={classes["item"]}>
                      <div className={classes["index"]}>
                        <p>{index}</p>
                      </div>
                      <div className={classes["profilepic"]}>
                        <img src={attendee.picture} />
                      </div>
                      <div className={classes["details"]}>
                        <h1>{attendee.name}</h1>
                        <p>{attendee.email}</p>
                        <p>{attendee.contact}</p>
                      </div>
                      <div className={classes["markattendance"]}>
                        {attended.includes(attendee.id) ? (
                          <div className={classes["marked"]}>Marked</div>
                        ) : (
                          <button onClick={() => handleMark(attendee.id)}>
                            Mark As Attended
                          </button>
                        )}
                      </div>
                    </li>
                  ))}
              </ul>
              <div className={classes["submitattendance"]}>
                <button onClick={handleSubmit}>Submit Attendance</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Volunteer;
