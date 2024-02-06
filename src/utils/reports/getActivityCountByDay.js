import { db } from "../../firebase/config";

const getActivityCountByDay = async () => {
  try {
    const activitiesSnapshot = await db.collection("Activities").get();
    const activitiesData = activitiesSnapshot.docs.map((doc) => doc.data());

    // Initialize an array to store the count of activities for each day (Sunday to Saturday)
    const activityCountByDay = [0, 0, 0, 0, 0, 0, 0];

    // Iterate through activities and update the count for each day
    activitiesData.forEach((activity) => {
      const activityDate = new Date(activity.date);
      const dayOfWeek = activityDate.getDay(); // 0 (Sunday) to 6 (Saturday)

      // Increment the count for the corresponding day
      activityCountByDay[dayOfWeek]++;
    });

    return activityCountByDay;
  } catch (error) {
    console.error("Error fetching activities:", error);
    return [];
  }
};

export default getActivityCountByDay;
