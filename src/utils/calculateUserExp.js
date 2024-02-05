// import { db } from "../firebase/config";

const calculateUserExp = async (user) => {
  const activities = user.activities_attended;
  const activitiesExp = activities.reduce((exp, activity) => {
    console.log(activity);
    if (activity.activity_type === "Volunteer") {
      return exp + activity.activity_hours * 25;
    } else {
      return exp + activity.activity_hours * 15;
    }
  }, 0);

  //   const missionsRef = firestore.collection("userMissions").doc(userId);
  //   const missionsSnapshot = await missionsRef.get();
  //   const missionsData = missionsSnapshot.data();

  //   const missionsExp = missionsData
  //     ? Object.values(missionsData).reduce((totalExp, missionExp) => {
  //         return totalExp + missionExp;
  //       }, 0)
  //     : 0;

  return activitiesExp;
};

export default calculateUserExp;
