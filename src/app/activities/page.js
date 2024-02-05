"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "../../firebase/config";
import { Box } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { FaRegCalendarAlt, FaRegClock, FaMapPin } from "react-icons/fa";
import ActivityCard from "../../components/activities/ActivityCard";
import withAuth from "../../hoc/withAuth";
import classes from "./page.module.css";

const Activities = ({ user }) => {
  const currentTimestamp = new Date();
  const upcomingActivitiesIds = user.activities_signedup;
  const [selectedView, setSelectedView] = useState("Upcoming");
  const [activities, setActivities] = useState(null);
  const [upcomingActivities, setUpcomingActivities] = useState([]);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activitiesSnapshot = await db.collection("Activities").get();

        if (activitiesSnapshot.empty) {
          console.log("No activities found.");
          setLoading(false);
          return;
        }

        const activitiesData = activitiesSnapshot.docs.map((doc) => ({
          id: doc.id,
          datetime_start: doc.data().datetime_start,
          ...doc.data(),
        }));

        setActivities(activitiesData);

        console.log(activitiesData);
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };

    // Call the fetch functions
    fetchActivities();
  }, []);

  useEffect(() => {
    const fetchUpcomingActivities = async () => {
      if (!upcomingActivitiesIds || !Array.isArray(upcomingActivitiesIds)) {
        return;
      }
      const promises = upcomingActivitiesIds.map(async (activityId) => {
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
      setUpcomingActivities(activityResults.filter(Boolean));
    };

    fetchUpcomingActivities(upcomingActivitiesIds);
  }, []);

  return (
    <div>
      <br />
      <div className={classes["page_layout"]}>
        <Box>
          <h1>Activities</h1>
          <br />
          <Image
            src={
              "https://static.wixstatic.com/media/11062b_905e23bb8e0b45a8ba27309aef66f3a9~mv2.jpeg/v1/fill/w_980,h_463,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/11062b_905e23bb8e0b45a8ba27309aef66f3a9~mv2.jpeg"
            }
            className={classes["promo_slideshow"]}
          />
          <br />
          <div className={classes["selection-bar"]}>
            <div
              className={
                selectedView === "Upcoming"
                  ? `${classes["option-selected"]}`
                  : `${classes["option-unselected"]}`
              }
              onClick={() => setSelectedView("Upcoming")}
            >
              Upcoming Activities
            </div>
            <div
              className={
                selectedView === "Completed"
                  ? `${classes["option-selected"]}`
                  : `${classes["option-unselected"]}`
              }
              onClick={() => setSelectedView("Completed")}
            >
              Completed Activities
            </div>
          </div>
          {selectedView === "Upcoming" && (
            <ul className={classes["grid_list_horizontal"]}>
              {activities &&
                activities
                  .filter(
                    (activity) =>
                      activity.datetime_end.toDate() >= currentTimestamp
                  )
                  .slice()
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
          {selectedView === "Completed" && (
            <ul className={classes["grid_list_horizontal"]}>
              {activities &&
                activities
                  .filter(
                    (activity) =>
                      activity.datetime_end.toDate() < currentTimestamp
                  )
                  //   .slice()
                  .sort((activityA, activityB) => {
                    const startTimeA = activityA.datetime_start.toDate();
                    const startTimeB = activityB.datetime_start.toDate();
                    return startTimeB - startTimeA; // show newest first
                  })
                  .map((activity) => (
                    <ActivityCard key={activity.id} activity={activity} />
                  ))}
            </ul>
          )}
        </Box>

        {/* {activities &&
          activities
            .slice()
            .sort((activityA, activityB) => {
              const startTimeA = activityA.datetime_start.toDate();
              const startTimeB = activityB.datetime_start.toDate();
              return startTimeA - startTimeB;
            })
            .map((activity) => (
              <div key={activity.id} className={classes["item"]}>
                <Link href={`/activities/volunteer/${activity.id}`}>
                  <img src={activity.image} className={classes["image"]} />
                  <div className={classes["type-tag"]}>{activity.type}</div>
                  <p>{activity.name}</p>
                  <div>
                    <FaRegCalendarAlt />
                    {activity.datetime_start.toDate().toLocaleString("en-EN", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    }) +
                      ", " +
                      activity.datetime_start.toDate().toLocaleString("en-EN", {
                        weekday: "long",
                      })}
                  </div>
                  <div>
                    <FaRegClock />
                    {activity.datetime_start.toDate().toLocaleString("en-EN", {
                      hour: "numeric",
                      minute: "numeric",
                      hour12: true,
                    }) +
                      " to " +
                      activity.datetime_end.toDate().toLocaleString("en-EN", {
                        hour: "numeric",
                        minute: "numeric",
                        hour12: true,
                      })}
                  </div>
                  <div>
                    <FaMapPin />
                    {activity.location_name}
                  </div>
                  <div>
                    <ul className={classes["tags"]}>
                      {activity.tags.map((tag, index) => (
                        <li key={index}>{tag}</li>
                      ))}
                    </ul>
                  </div>
                </Link>
              </div>
            ))} */}

        <Box
          style={{
            height: "500px",
            padding: "0 0.5rem",
          }}
        >
          <h1>Upcoming Activities</h1>
          <br />
          <ul className={classes["grid_list_horizontal"]}>
            {upcomingActivities &&
              upcomingActivities
                .filter(
                  (activity) =>
                    activity.datetime_end.toDate() >= currentTimestamp
                )
                .slice(0, 5)
                .sort((activityA, activityB) => {
                  const startTimeA = activityA.datetime_start.toDate();
                  const startTimeB = activityB.datetime_start.toDate();
                  return startTimeA - startTimeB;
                })
                .map((activity) => (
                  <ActivityCard
                    key={activity.id}
                    activity={activity}
                    mini={true}
                  />
                ))}
          </ul>
        </Box>
      </div>
    </div>
  );
};

export default withAuth(Activities);
