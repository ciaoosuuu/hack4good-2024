"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { projectFirestore } from "../../firebase/config";

import { FaRegCalendarAlt, FaRegClock, FaMapPin } from "react-icons/fa";

import classes from "./page.module.css";

const Activities = () => {
  const [activities, setActivities] = useState(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const activitiesSnapshot = await projectFirestore
          .collection("Activities")
          .get();

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

  return (
    <div>
      <h1>Activities</h1>
      <ul className={classes["grid_list"]}>
        {activities &&
          activities.map((activity) => (
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
          ))}
      </ul>
    </div>
  );
};

export default Activities;
