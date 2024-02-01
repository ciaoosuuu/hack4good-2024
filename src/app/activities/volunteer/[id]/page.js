"use client";

import { useEffect, useState } from "react";
import { projectFirestore } from "../../../../firebase/config";

const Volunteer = ({ params }) => {
  const { id } = params;

  projectFirestore
  const [activity, setActivity] = useState();

  useEffect(() => {
    const fetchActivityContent = async () => {
      if (id) {
        try {
          const activityDoc = await projectFirestore
            .collection("Activities")
            .doc(id)
            .get();
          if (activityDoc.exists) {
            setActivity(activityDoc.data());
          } else {
            console.log("Activity not found");
          }
        } catch (error) {
          console.error("Error fetching activity content:", error);
        } finally {
          console.log(activity);
        }
      }
    };

    fetchActivityContent();
  }, [id]);

  return <p>{activity && activity.name}</p>;
}

export default Volunteer;
