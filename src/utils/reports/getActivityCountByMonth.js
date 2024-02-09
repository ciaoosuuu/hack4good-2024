"use client";

import { db } from "../../firebase/config";

const getActivityCountByMonth = async () => {
  try {
    const activitiesSnapshot = await db.collection("Activities").get();
    const activitiesData = activitiesSnapshot.docs.map((doc) => doc.data());

    const currentDate = new Date();

    const activityCountByMonth = Array.from({ length: 12 }, () => 0);

    const volunteeringCountByMonth = Array.from({ length: 12 }, () => 0);
    const workshopCountByMonth = Array.from({ length: 12 }, () => 0);
    const trainingCountByMonth = Array.from({ length: 12 }, () => 0);

    console.log(activitiesData);

    activitiesData.forEach((activity) => {
      const activityDate = new Date(
        activity.datetime_start.toDate().getFullYear(),
        activity.datetime_start.toDate().getMonth(),
        1
      );

      if (
        activityDate >
          new Date(currentDate.getFullYear() - 1, currentDate.getMonth(), 1) &&
        activityDate <=
          new Date(currentDate.getFullYear(), currentDate.getMonth(), 1)
      ) {
        const monthsApart =
          (currentDate.getFullYear() - activityDate.getFullYear()) * 12 +
          currentDate.getMonth() -
          activityDate.getMonth();
        const monthIndex = 11 - monthsApart;

        if (activity.activity_type === "Volunteering") {
          volunteeringCountByMonth[monthIndex]++;
        } else if (activity.activity_type === "Workshop") {
          workshopCountByMonth[monthIndex]++;
        } else if (activity.activity_type === "Training") {
          trainingCountByMonth[monthIndex]++;
        }

        activityCountByMonth[monthIndex]++;
      }
    });

    console.log(activityCountByMonth);
    return [
      volunteeringCountByMonth,
      workshopCountByMonth,
      trainingCountByMonth,
      activityCountByMonth,
    ];
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [[], [], [], []];
  }
};

export default getActivityCountByMonth;
