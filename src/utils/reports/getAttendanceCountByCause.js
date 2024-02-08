"use client";

import { db } from "../../firebase/config";
import causes from "./causes"

const getAttendanceCountByCause = async () => {
  try {
    
    const activitiesSnapshot = await db.collection("Activities").get();
    const activitiesData = activitiesSnapshot.docs.map((doc) => doc.data());

    const causeCounters = {};
    causes.forEach((cause) => (causeCounters[cause] = 0));

    activitiesData.forEach((activity) => {
      activity.tags.forEach((tag) => {
        if (causeCounters.hasOwnProperty(tag)) {
          causeCounters[tag] += activity.participants_attended.length;
        }
      });
    });

    const causeCountArray = causes.map((cause) => causeCounters[cause]);
    return causeCountArray;
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
};

export default getAttendanceCountByCause;
