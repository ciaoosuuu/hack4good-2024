"use client";

import { db } from "../../firebase/config";

const getAttendanceCountByMonth = async () => {
  try {
    const activitiesSnapshot = await db.collection("Activities").get();
    const activitiesData = activitiesSnapshot.docs.map((doc) => doc.data());

    const currentDate = new Date();

    const attendanceCountByMonth = Array.from({ length: 12 }, () => 0);

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
        const monthIndex =
          (currentDate.getMonth() - activityDate.getMonth() + 11) % 12;

        attendanceCountByMonth[monthIndex] +=
          activity.participants_attended.length;
      }
    });

    console.log(attendanceCountByMonth);
    return attendanceCountByMonth;
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
};

export default getAttendanceCountByMonth;
