"use client";

import { useEffect, useState } from "react";
import { db } from "../../../firebase/config";
import withAuth from "../../../hoc/withAuth";

import ActivityCard from "../../../components/activities/ActivityCard";
import classes from "../page.module.css";

const MyActivities = ({ user }) => {
  const currentTimestamp = new Date();
  const [selectedView, setSelectedView] = useState("Signed Up");
  const signedUpIds = user.activities_signedup;
  const [signedUp, setSignedUp] = useState([]);
  const attendedDetails = user.activities_attended;
  console.log(attendedDetails);
  const [attended, setAttended] = useState([]);

  useEffect(() => {
    const fetchSignedUp = async () => {
      if (!signedUpIds || !Array.isArray(signedUpIds)) {
        return;
      }
      const promises = signedUpIds.map(async (activityId) => {
        try {
          const activityDoc = await db
            .collection("Activities")
            .doc(activityId)
            .get();
          console.log(activityDoc);
          if (activityDoc.exists) {
            return { id: activityId, ...activityDoc.data() };
          } else {
            console.log(`Activity with ID ${activityId} not found`);
            return null;
          }
        } catch (error) {
          console.error(
            `Error fetching activity details for ${activityId}:`,
            error
          );
          return null;
        }
      });

      const activityResults = await Promise.all(promises);
      setSignedUp(activityResults.filter(Boolean));
    };

    const fetchAttended = async () => {
      if (!attendedDetails || !Array.isArray(attendedDetails)) {
        return;
      }
      const promises = attendedDetails.map(async (attended) => {
        try {
          const activityDoc = await db
            .collection("Activities")
            .doc(attended.activity_id)
            .get();
          console.log(activityDoc);
          if (activityDoc.exists) {
            return { id: attended.activity_id, ...activityDoc.data() };
          } else {
            console.log(`Activity with ID ${attended.activity_id} not found`);
            return null;
          }
        } catch (error) {
          console.error(
            `Error fetching activity details for ${attended.activity_id}:`,
            error
          );
          return null;
        }
      });

      const activityResults = await Promise.all(promises);
      setAttended(activityResults.filter(Boolean));
    };

    fetchSignedUp();
    fetchAttended();
  }, []);
  return (
    <div className={classes["page_layout"]}>
      <div style={{ display: "block" }}>
        <button type="button" onClick={() => window.history.back()}>
          Back
        </button>
      </div>
      <b>My Activities</b>
      <div>
        <div className={classes["selection-bar"]}>
          <div
            className={
              selectedView === "Signed Up"
                ? `${classes["option-selected"]}`
                : `${classes["option-unselected"]}`
            }
            onClick={() => setSelectedView("Signed Up")}
          >
            Signed Up
          </div>
          <div
            className={
              selectedView === "Attended"
                ? `${classes["option-selected"]}`
                : `${classes["option-unselected"]}`
            }
            onClick={() => setSelectedView("Attended")}
          >
            Attended
          </div>
        </div>
        {selectedView === "Signed Up" && (
          <ul className={classes["grid_list_horizontal"]}>
            {signedUp &&
              signedUp
                .filter(
                  (activity) =>
                    activity.datetime_end.toDate() >= currentTimestamp
                )
                .sort((activityA, activityB) => {
                  const startTimeA = activityA.datetime_start.toDate();
                  const startTimeB = activityB.datetime_start.toDate();
                  return startTimeA - startTimeB;
                })
                .map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
          </ul>
        )}
        {selectedView === "Attended" && (
          <ul className={classes["grid_list_horizontal"]}>
            {attended &&
              attended
                .sort((activityA, activityB) => {
                  const startTimeA = activityA.datetime_start.toDate();
                  const startTimeB = activityB.datetime_start.toDate();
                  return startTimeB - startTimeA; // show latest first
                })
                .map((activity) => (
                  <ActivityCard key={activity.id} activity={activity} />
                ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default withAuth(MyActivities);
