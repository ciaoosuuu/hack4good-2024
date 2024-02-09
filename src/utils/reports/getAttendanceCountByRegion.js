"use client";

import { db } from "../../firebase/config";
import getRegionFromPostal from "./getRegionFromPostal";

const getAttendanceCountByRegion = async () => {
  try {
    const activitiesSnapshot = await db.collection("Activities").get();
    const activitiesData = activitiesSnapshot.docs.map((doc) => doc.data());

    const activityCountByRegion = Array.from({ length: 5 }, () => 0); // NE, N, C, W, E

    // console.log(activitiesData);

    activitiesData.forEach((activity) => {
      if (activity.location_postal) {
        const region = getRegionFromPostal(activity.location_postal);
        console.log(region);
        if (region === "North-East") {
          activityCountByRegion[0] += activity.participants_attended.length;
        } else if (region === "North") {
          activityCountByRegion[1] += activity.participants_attended.length;
        } else if (region === "Central") {
          activityCountByRegion[2] += activity.participants_attended.length;
        } else if (region === "West") {
          activityCountByRegion[3] += activity.participants_attended.length;
        } else if (region === "East") {
          activityCountByRegion[4] += activity.participants_attended.length;
        }
      }
    });

    console.log(activityCountByRegion);
    return activityCountByRegion;
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
};

export default getAttendanceCountByRegion;
