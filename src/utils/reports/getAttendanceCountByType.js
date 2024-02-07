"use client";

import { db } from "../../firebase/config";

const getAttendanceCountByType = async () => {
  try {
    const activitiesSnapshot = await db.collection("Activities").get();
    const activitiesData = activitiesSnapshot.docs.map((doc) => doc.data());

    const activityCountByRegion = Array.from({ length: 3 }, () => 0); // Volunteering, Workshop, Training

    activitiesData.forEach((activity) => {
      const type = activity.activity_type;
      if (type === "Volunteering") {
        activityCountByRegion[0] += activity.participants_attended.length;
      } else if (type === "Workshop") {
        activityCountByRegion[1] += activity.participants_attended.length;
      } else if (type === "Training") {
        activityCountByRegion[2] += activity.participants_attended.length;
      }
    });

    console.log(activityCountByRegion);
    return activityCountByRegion;
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
};

export default getAttendanceCountByType;
