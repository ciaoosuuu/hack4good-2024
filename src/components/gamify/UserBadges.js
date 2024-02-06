"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase/config";

const UserBadges = ({ userExp }) => {
  const [userLevels, setUserLevels] = useState([]);

  useEffect(() => {
    const fetchUserLevels = async () => {
      try {
        const userLevelsSnapshot = await db.collection("Levels").get();

        if (userLevelsSnapshot.empty) {
          console.log("No badges found.");
          return;
        }

        const userLevelsData = userLevelsSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => a.level - b.level);

        setUserLevels(userLevelsData);
      } catch (error) {
        console.error("Error fetching badges:", error);
      }
    };

    fetchUserLevels();
  }, [userExp]);

  return (
    <div>
      <h3>Your Badges</h3>
      <ul style={{ display: "flex" }}>
        {userLevels &&
          userLevels
            .filter((level) => level.exp <= userExp)
            // .map((level) => (
            //   <div key={level.level}>
            //     <b>BADGE {level.level}</b>
            //     <p>{level.title}</p>
            //   </div>
            // ))}
            .map((level) => <Badge key={level.id} level={level} />)}
      </ul>
    </div>
  );
};

const Badge = ({ level }) => {
  const badgeUrl = level.badge;
  const badgeName = level.title;
  const badgeLevel = level.level;

  return (
    <li
      style={{
        // marginLeft: "20px",
        // marginRight: "20px",
        width: "200px",
        textAlign: "center",
        listStyle: "none",
      }}
    >
      <img
        src={badgeUrl}
        alt={badgeName}
        style={{
          marginLeft: "50px",
          marginBottom: "8px",
          // marginRight: "46px",
          width: "100px",
          height: "100px",
          borderRadius: "50%",
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        }}
      />
      <p style={{ fontSize: "small", fontWeight: "bold" }}>
        Level {badgeLevel}
      </p>
      <p style={{ fontSize: "small" }}>{badgeName}</p>
    </li>
  );
};

export default UserBadges;
