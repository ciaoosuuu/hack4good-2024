"use client";

import { db } from "../../firebase/config";

const getAttendanceCountByMonth = async () => {
  try {
    const activitiesSnapshot = await db.collection("Activities").get();
    const activitiesData = activitiesSnapshot.docs.map((doc) => doc.data());

    const currentDate = new Date();

    const attendanceCountByMonth = Array.from({ length: 12 }, () => 0);
    const attendanceCountByMonthVolunteer = Array.from({ length: 12 }, () => 0);
    const attendanceCountByMonthWorkshop = Array.from({ length: 12 }, () => 0);
    const attendanceCountByMonthTraining = Array.from({ length: 12 }, () => 0);

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
          (11 - Math.abs(currentDate.getMonth() - activityDate.getMonth())) %
          12;

        if (activity.activity_type === "Volunteering") {
          attendanceCountByMonthVolunteer[monthIndex]++;
        } else if (activity.activity_type === "Workshop") {
          attendanceCountByMonthWorkshop[monthIndex]++;
        } else if (activity.activity_type === "Training") {
          attendanceCountByMonthTraining[monthIndex]++;
        }

        attendanceCountByMonth[monthIndex] +=
          activity.participants_attended.length;
      }
    });

    console.log(attendanceCountByMonth);
    return [
      attendanceCountByMonthVolunteer,
      attendanceCountByMonthWorkshop,
      attendanceCountByMonthTraining,
      attendanceCountByMonth,
    ];
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [[], [], [], []];
  }
};

export default getAttendanceCountByMonth;
