"use client";

import { db } from "../../firebase/config";
import getRegionFromPostal from "./getRegionFromPostal";

const getActivityCountByRegion = async () => {
  try {
    const activitiesSnapshot = await db.collection("Activities").get();
    const activitiesData = activitiesSnapshot.docs.map((doc) => doc.data());

    const activityCountByRegion = Array.from({ length: 5 }, () => 0); // NE, N, C, W, E

    // console.log(activitiesData);

    activitiesData.forEach((activity) => {
      const region = getRegionFromPostal(activity.location_postal);
      console.log(region);
      if (region === "North-East") {
        activityCountByRegion[0]++;
      } else if (region === "North") {
        activityCountByRegion[1]++;
      } else if (region === "Central") {
        activityCountByRegion[2]++;
      } else if (region === "West") {
        activityCountByRegion[3]++;
      } else if (region === "East") {
        activityCountByRegion[4]++;
      }
    });

    console.log(activityCountByRegion);
    return activityCountByRegion;
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
};

export default getActivityCountByRegion;
