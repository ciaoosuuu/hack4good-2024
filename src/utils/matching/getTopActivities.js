const calculateSimilarity = (tags, interests) => {
  const commonInterests = tags.filter((tag) => interests.includes(tag));
  return commonInterests.length;
};

const getTopActivities = (user, activities) => {
  const currentTimestamp = new Date();
  const upcomingActivities = activities.filter(
    (activity) => activity.datetime_end.toDate() >= currentTimestamp
  );
  const topActivities = [];

  if (user && user.preferences && user.preferences.interestAreas) {
    upcomingActivities.forEach((activity) => {
      const activitySimilarity = user.preferences.interestAreas.reduce(
        (total, interest) => {
          return total + calculateSimilarity(activity.tags, [interest]);
        },
        0
      );

      topActivities.push({ ...activity, similarity: activitySimilarity });
    });

    topActivities.sort((a, b) => b.similarity - a.similarity);

    const top5Activities = topActivities.slice(0, 5);

    return top5Activities;
  }

  return upcomingActivities.slice(0.5);
};

export default getTopActivities;
