"use client";

import { db } from "../../firebase/config";
import causes from "./causes";

const getActivityCountByCause = async () => {
  try {
    const activitiesSnapshot = await db.collection("Activities").get();
    const activitiesData = activitiesSnapshot.docs.map((doc) => doc.data());

    // Initialize counters for each cause
    const causeCounters = {};
    causes.forEach((cause) => (causeCounters[cause] = 0));

    // Iterate through activities and update counters
    activitiesData.forEach((activity) => {
      activity.tags.forEach((tag) => {
        if (causeCounters.hasOwnProperty(tag)) {
          causeCounters[tag]++;
        }
      });
    });

    // Convert object values to an array
    const causeCountArray = causes.map((cause) => causeCounters[cause]);
    return causeCountArray;
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
};

export default getActivityCountByCause;
