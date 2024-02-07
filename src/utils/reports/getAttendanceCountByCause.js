"use client";

import { db } from "../../firebase/config";
import causes from "./causes";

const getAttendanceCountByCause = async () => {
  try {
    const activitiesSnapshot = await db.collection("Activities").get();
    const activitiesData = activitiesSnapshot.docs.map((doc) => doc.data());

    const causeCounters = {};
    const causeCountersVolunteering = {};
    const causeCountersWorkshop = {};
    const causeCountersTraining = {};
    causes.forEach((cause) => (causeCounters[cause] = 0));
    causes.forEach((cause) => (causeCountersVolunteering[cause] = 0));
    causes.forEach((cause) => (causeCountersWorkshop[cause] = 0));
    causes.forEach((cause) => (causeCountersTraining[cause] = 0));

    activitiesData.forEach((activity) => {
      if (activity.activity_type === "Volunteering") {
        activity.tags.forEach((tag) => {
          if (causeCounters.hasOwnProperty(tag)) {
            causeCounters[tag] += activity.participants_attended.length;
            causeCountersVolunteering[tag] +=
              activity.participants_attended.length;
          }
        });
      } else if (activity.activity_type === "Workshop") {
        activity.tags.forEach((tag) => {
          if (causeCounters.hasOwnProperty(tag)) {
            causeCounters[tag] += activity.participants_attended.length;
            causeCountersWorkshop[tag] += activity.participants_attended.length;
          }
        });
      } else if (activity.activity_type === "Training") {
        activity.tags.forEach((tag) => {
          if (causeCounters.hasOwnProperty(tag)) {
            causeCounters[tag] += activity.participants_attended.length;
            causeCountersTraining[tag] += activity.participants_attended.length;
          }
        });
      }
    });

    const causeCountArray = causes.map((cause) => causeCounters[cause]);
    const causeCountArrayVolunteering = causes.map(
      (cause) => causeCountersVolunteering[cause]
    );
    const causeCountArrayWorkshop = causes.map(
      (cause) => causeCountersWorkshop[cause]
    );
    const causeCountArrayTraining = causes.map(
      (cause) => causeCountersTraining[cause]
    );
    return [
      causeCountArrayVolunteering,
      causeCountArrayWorkshop,
      causeCountArrayTraining,
      causeCountArray,
    ];
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [[], [], [], []];
  }
};

export default getAttendanceCountByCause;
