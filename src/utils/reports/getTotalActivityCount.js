"use client";

import { db } from "../../firebase/config";

const getTotalActivityCount = async () => {
  try {
    const activitiesSnapshot = await db.collection("Activities").get();
    const activitiesData = activitiesSnapshot.docs.map((doc) => doc.data());
    const totalActivityCount = activitiesData.length;
    return totalActivityCount;
  } catch (error) {
    console.error("Error fetching activities:", error);
    return 0;
  }
};

export default getTotalActivityCount;
