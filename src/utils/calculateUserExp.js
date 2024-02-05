// import { db } from "../firebase/config";

const calculateUserExp = async (user) => {
  const activities = user.activities_attended;
  const posts = user.posts;
  const activitiesExp = activities.reduce((exp, activity) => {
    if (activity.activity_type === "Volunteering") {
      return exp + activity.activity_hours * 25;
    } else {
      return exp + activity.activity_hours * 15;
    }
  }, 0);
  const postsExp = posts.reduce((exp) => {
    return exp + 10;
  }, 0);

  //   const missionsRef = firestore.collection("userMissions").doc(userId);
  //   const missionsSnapshot = await missionsRef.get();
  //   const missionsData = missionsSnapshot.data();

  //   const missionsExp = missionsData
  //     ? Object.values(missionsData).reduce((totalExp, missionExp) => {
  //         return totalExp + missionExp;
  //       }, 0)
  //     : 0;

  return activitiesExp + postsExp;
};

export default calculateUserExp;
