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
  const remainingUpcomingActivities = upcomingActivities.filter(
    (activity) =>
      !top5Activities.some((topActivity) => topActivity.id === activity.id)
  );

  if (top5Activities.length < 5) {
    const remainingSlots = 5 - top5Activities.length;
    const additionalUpcomingActivities = remainingUpcomingActivities
      .sort((activityA, activityB) => {
        const startTimeA = activityA.datetime_start.toDate();
        const startTimeB = activityB.datetime_start.toDate();
        return startTimeA - startTimeB;
      })
      .slice(0, remainingSlots);
    top5Activities.push(...additionalUpcomingActivities);
  }

  return top5Activities;
};

export default getTopActivities;
