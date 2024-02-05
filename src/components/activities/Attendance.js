"use client";

import { useEffect, useState } from "react";
import { arrayUnion, arrayRemove } from "firebase/firestore";
import { db } from "../../firebase/config";

const Attendance = ({ userRole, classes, activity, activityId }) => {
  if (userRole !== "admin") {
    return null;
  }

  console.log(activity);

  const signups = activity.participants_signups;
  const [attendees, setAttendees] = useState([]);
  const [marked, setMarked] = useState(activity.participants_attended);

  const activityInformation = {
    activity_id: activityId,
    activity_name: activity.activity_name,
    activity_hours: parseFloat(
      (
        (activity.datetime_end.toDate() - activity.datetime_start.toDate()) /
        (1000 * 60 * 60)
      ).toFixed(2)
    ),
    activity_date: activity.datetime_start,
    activity_type: activity.activity_type,
  };

  useEffect(() => {
    const fetchSignups = async () => {
      if (!signups || !Array.isArray(signups)) {
        return;
      }
      const promises = signups.map(async (userID) => {
        try {
          const userDoc = await db.collection("Users").doc(userID).get();
          console.log(userDoc);
          if (userDoc.exists) {
            // Access user details from the document data
            return { id: userID, ...userDoc.data() };
          } else {
            console.log(`User with ID ${userID} not found`);
            return null;
          }
        } catch (error) {
          console.error(`Error fetching user details for ${userID}:`, error);
          return null;
        }
      });

      const userResults = await Promise.all(promises);
      setAttendees(userResults.filter(Boolean));
    };

    fetchSignups();
    console.log(activityId);
  }, [signups, activityId]);

  const handleMark = async (attendeeId) => {
    try {
      const activityRef = db.collection("Activities").doc(activityId);
      await activityRef.update({
        participants_attended: arrayUnion(attendeeId),
      });

      const userRef = db.collection("Users").doc(attendeeId);
      await userRef.update({
        activities_attended: arrayUnion(activityInformation),
      });

      setMarked((prevMarked) => [...prevMarked, attendeeId]);

      console.log(`Attendance submitted successfully for user ${attendeeId}!`);
    } catch (error) {
      console.error("Error updating field:", error);
    }
  };

  const handleUnmark = async (attendeeId) => {
    try {
      const activityRef = db.collection("Activities").doc(activityId);
      await activityRef.update({
        participants_attended: arrayRemove(attendeeId),
      });

      const userRef = db.collection("Users").doc(attendeeId);
      await userRef.update({
        activities_attended: arrayRemove(activityInformation),
      });

      setMarked((prevMarked) => prevMarked.filter((id) => id !== attendeeId));

      console.log(`Unmarked attendance successfully for user ${attendeeId}!`);
    } catch (error) {
      console.error("Error updating field:", error);
    }
  };

  return (
    <div className={classes["container"]}>
      <h1>Attendance</h1>
      <ul className={classes["grid_list"]}>
        {attendees &&
          attendees
            .slice()
            .sort((a, b) => a.name.localeCompare(b.name))
            .map((attendee, index) => (
              <li key={attendee.id} className={classes["item"]}>
                <div className={classes["index"]}>
                  <p>{index}</p>
                </div>
                <div className={classes["profilepic"]}>
                  <img src={attendee.image} alt="Profile" />
                </div>
                <div className={classes["details"]}>
                  <h1>{attendee.name}</h1>
                  <p>{attendee.email}</p>
                  <p>{attendee.contact}</p>
                </div>
                <div className={classes["markattendance"]}>
                  {marked.includes(attendee.id) ? (
                    <button
                      className={classes["marked"]}
                      onClick={() => handleUnmark(attendee.id)}
                    >
                      Unmark Attendance
                    </button>
                  ) : (
                    <button
                      className={classes["unmarked"]}
                      onClick={() => handleMark(attendee.id)}
                    >
                      Mark As Attended
                    </button>
                  )}
                </div>
              </li>
            ))}
      </ul>
      {/* <div className={classes["submitattendance"]}>
        <button onClick={handleSubmit}>Submit Attendance</button>
      </div> */}
    </div>
  );
};

export default Attendance;
