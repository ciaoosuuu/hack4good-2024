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

  return activitiesExp + postsExp;
};

export default calculateUserExp;
