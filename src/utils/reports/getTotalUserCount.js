"use client";

import { db } from "../../firebase/config";

const getTotalUserCount = async () => {
  try {
    const usersSnapshot = await db.collection("Users").get();
    const usersData = usersSnapshot.docs.map((doc) => doc.data());
    const volunteerUsers = usersData.filter(
      (user) => user.role === "volunteer"
    );
    const totalUserCount = volunteerUsers.length;
    return totalUserCount;
  } catch (error) {
    console.error("Error fetching users:", error);
    return 0;
  }
};

export default getTotalUserCount;
