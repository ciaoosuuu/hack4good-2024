"use client";

import { db } from "../../firebase/config";

const getUserCountByMonth = async () => {
  try {
    const usersSnapshot = await db.collection("Users").get();
    const usersData = usersSnapshot.docs.map((doc) => doc.data());

    const currentDate = new Date();

    const userCountByMonth = Array.from({ length: 12 }, () => 0);

    usersData.forEach((user) => {
      if (user.role === "volunteer") {
        const userCreateDate = new Date(
          user.created_on.toDate().getFullYear(),
          user.created_on.toDate().getMonth(),
          1
        );

        if (
          userCreateDate >
            new Date(
              currentDate.getFullYear() - 1,
              currentDate.getMonth(),
              1
            ) &&
          userCreateDate <=
            new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0)
        ) {
          const monthsApart =
            (currentDate.getFullYear() - userCreateDate.getFullYear()) * 12 +
            currentDate.getMonth() -
            userCreateDate.getMonth();
          const monthIndex = 11 - monthsApart;
          userCountByMonth[monthIndex]++;
        }
      }
    });

    console.log(userCountByMonth);
    return userCountByMonth;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export default getUserCountByMonth;
