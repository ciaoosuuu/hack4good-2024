"use client";

import { db } from "../../firebase/config";

const getTotalVolunteerHours = async () => {
  try {
    const curentTimestamp = new Date();
    const activitiesSnapshot = await db.collection("Activities").get();
    const activitiesData = activitiesSnapshot.docs.map((doc) => doc.data());
    const activitiesOver = activitiesData.filter(
      (activity) => activity.datetime_end.toDate() < curentTimestamp
    );
    const totalVolunteerHours = activitiesOver.reduce((total, activity) => {
      return (
        total + activity.participants_attended.length * activity.activity_hours
      );
    }, 0);
    return totalVolunteerHours;
  } catch (error) {
    console.error("Error fetching activities:", error);
    return 0;
  }
};

export default getTotalVolunteerHours;
