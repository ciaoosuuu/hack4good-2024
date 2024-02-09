"use client";

import { db } from "../../firebase/config";

const getUserCountByLanguages = async () => {
  try {
    const usersSnapshot = await db.collection("Users").get();
    const usersData = usersSnapshot.docs.map((doc) => doc.data());

    const userCountByLanguages = Array.from({ length: 5 }, () => 0); // EL, CL, ML, TL, OTHERS

    usersData.forEach((user) => {
      if (user.preferences && user.preferences.languages) {
        user.preferences.languages.forEach((language) => {
          if (language === "english") {
            userCountByLanguages[0]++;
          } else if (language === "mandarin") {
            userCountByLanguages[1]++;
          } else if (language === "malay") {
            userCountByLanguages[2]++;
          } else if (language === "tamil") {
            userCountByLanguages[3]++;
          } else if (language === "others") {
            userCountByLanguages[4]++;
          }
        });
      }
    });

    console.log(userCountByLanguages);
    return userCountByLanguages;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [0, 0, 0, 0, 0];
  }
};

export default getUserCountByLanguages;
