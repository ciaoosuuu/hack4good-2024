"use client";

import { db } from "../../firebase/config";

const getVolunteerAttendanceByMonth = async (userId) => {
  try {
    const userData = await db.collection("Users").doc(userId).get();
    const activitiesAttended = userData.data().activities_attended;
    console.log(activitiesAttended);

    // const activitiesPromises = activitiesAttended.map(async (activity) => {
    //   const activitySnapshot = await db
    //     .collection("Activities")
    //     .doc(activity.activity_id)
    //     .get();
    //   return activitySnapshot.data();
    // });

    // const activitiesData = await Promise.all(activitiesPromises);

    const currentDate = new Date();

    const volunteerAttendanceCountByMonth = Array.from({ length: 12 }, () => 0);
    const volunteerAttendanceCountByMonthVolunteer = Array.from(
      { length: 12 },
      () => 0
    );
    const volunteerAttendanceCountByMonthWorkshop = Array.from(
      { length: 12 },
      () => 0
    );
    const volunteerAttendanceCountByMonthTraining = Array.from(
      { length: 12 },
      () => 0
    );

    activitiesAttended.forEach((activity) => {
      const activityDate = new Date(
        activity.activity_date.toDate().getFullYear(),
        activity.activity_date.toDate().getMonth(),
        1
      );
      console.log(activityDate);

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
          volunteerAttendanceCountByMonthVolunteer[monthIndex]++;
        } else if (activity.activity_type === "Workshop") {
          volunteerAttendanceCountByMonthWorkshop[monthIndex]++;
        } else if (activity.activity_type === "Training") {
          volunteerAttendanceCountByMonthTraining[monthIndex]++;
        }

        volunteerAttendanceCountByMonth[monthIndex]++;
      }
    });

    return [
      volunteerAttendanceCountByMonthVolunteer,
      volunteerAttendanceCountByMonthWorkshop,
      volunteerAttendanceCountByMonthTraining,
      volunteerAttendanceCountByMonth,
    ];
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [[], [], [], []];
  }
};

export default getVolunteerAttendanceByMonth;
