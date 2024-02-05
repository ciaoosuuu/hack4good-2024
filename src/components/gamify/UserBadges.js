"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase/config";

const UserBadges = ({ userExp }) => {
  const [userBadges, setUserBadges] = useState([]);

  useEffect(() => {
    const fetchUserBadges = async () => {
      try {
        const userBadgesSnapshot = await db.collection("Levels").get();

        if (userBadgesSnapshot.empty) {
          console.log("No badges found.");
          return;
        }

        const userBadgesData = userBadgesSnapshot.docs
          .map((doc) => ({
            id: doc.id,
            ...doc.data(),
          }))
          .sort((a, b) => a.level - b.level);

        setUserBadges(userBadgesData);
      } catch (error) {
        console.error("Error fetching badges:", error);
      }
    };

    fetchUserBadges();
  }, [userExp]);

  return (
    <div>
      <h3>Your Badges</h3>
      <ul>
        {userBadges &&
          userBadges
            .filter((badge) => badge.exp <= userExp)
            .map((badge) => (
              <div key={badge.level}>
                <b>BADGE {badge.level}</b>
                <p>{badge.title}</p>
              </div>
            ))}
        {/* .map((badgeId) => <Badge key={badgeId} badgeId={badgeId} />)} */}
      </ul>
    </div>
  );
};

// const Badge = ({ badgeId }) => {
//   const [badgeInfo, setBadgeInfo] = useState(null);

//   useEffect(() => {
//     const fetchBadgeInfo = async () => {
//       const badgeRef = firestore.collection("badges").doc(badgeId);
//       const badgeSnapshot = await badgeRef.get();
//       const badgeData = badgeSnapshot.data();

//       if (badgeData) {
//         setBadgeInfo(badgeData);
//       }
//     };

//     fetchBadgeInfo();
//   }, [badgeId]);

//   return (
//     <li>
//       {badgeInfo && (
//         <>
//           <img src={badgeInfo.image} alt={badgeInfo.name} />
//           <p>{badgeInfo.name}</p>
//         </>
//       )}
//     </li>
//   );
// };

export default UserBadges;
