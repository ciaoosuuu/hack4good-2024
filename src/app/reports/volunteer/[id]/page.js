"use client";

import { useEffect, useState } from "react";
import { db } from "../../../../firebase/config";
import {
  Box,
  Image as ChakraImage,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Flex,
} from "@chakra-ui/react";
import Image from "next/image";
// import { useRouter } from "next/navigation";

import ActivityCard from "../../../../components/activities/ActivityCard";
import UserBadges from "../../../../components/gamify/UserBadges";
import classes from "./page.module.css";
import withAuth from "../../../../hoc/withAuth";
import VolunteerPastYearAttendance from "../../../../components/reports/VolunteerPastYearAttendance";

const VolunteerReport = ({ user, params }) => {
  const { id } = params;
  const [volunteer, setVolunteer] = useState();

  const currentTimestamp = new Date();
  const [selectedMainView, setSelectedMainView] = useState("Activities");
  const [selectedView, setSelectedView] = useState("Signed Up");
  const [signedUpIds, setSignedUpIds] = useState([]);
  const [signedUp, setSignedUp] = useState([]);
  const attendedDetails = user.activities_attended;
  const [attended, setAttended] = useState([]);
  const postIds = user.posts;
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchVolunteer = async () => {
      try {
        const userData = await db.collection("Users").doc(id).get();
        setVolunteer(userData);
        // setSignedUpIds(userData)
      } catch (error) {
        console.error("Error fetching activities:", error);
      }
    };
    fetchVolunteer();
  }, []);

  useEffect(() => {
    const fetchSignedUp = async () => {
      if (!signedUpIds || !Array.isArray(signedUpIds)) {
        return;
      }
      const promises = signedUpIds.map(async (activityId) => {
        try {
          const activityDoc = await db
            .collection("Activities")
            .doc(activityId)
            .get();
          console.log(activityDoc);
          if (activityDoc.exists) {
            return { id: activityId, ...activityDoc.data() };
          } else {
            console.log(`Activity with ID ${activityId} not found`);
            return null;
          }
        } catch (error) {
          console.error(
            `Error fetching activity details for ${activityId}:`,
            error
          );
          return null;
        }
      });

      const activityResults = await Promise.all(promises);
      const activitySorted = activityResults
        .filter(Boolean)
        .sort((activityA, activityB) => {
          const startTimeA = activityA.datetime_start.toDate();
          const startTimeB = activityB.datetime_start.toDate();
          return startTimeA - startTimeB;
        });
      setSignedUp(activitySorted);
    };

    const fetchAttended = async () => {
      if (!attendedDetails || !Array.isArray(attendedDetails)) {
        return;
      }
      const promises = attendedDetails.map(async (attended) => {
        try {
          const activityDoc = await db
            .collection("Activities")
            .doc(attended.activity_id)
            .get();
          if (activityDoc.exists) {
            return {
              id: attended.activity_id,
              ...activityDoc.data(),
            };
          } else {
            console.log(`Activity with ID ${attended.activity_id} not found`);
            return null;
          }
        } catch (error) {
          console.error(
            `Error fetching activity details for ${attended.activity_id}:`,
            error
          );
          return null;
        }
      });

      const activityResults = await Promise.all(promises);
      const activitySorted = activityResults
        .filter(Boolean)
        .sort((activityA, activityB) => {
          const startTimeA = activityA.datetime_start.toDate();
          const startTimeB = activityB.datetime_start.toDate();
          return startTimeB - startTimeA; // show latest first
        });

      setAttended(activitySorted);
    };
    fetchSignedUp();
    fetchAttended();
  }, [volunteer]);

  return (
    <div className={classes["page_layout"]}>
      {volunteer && <div>
        <Box
          style={{
            padding: "0 0.5rem",
            minWidth: "400px",
          }}
        >
          <br />
          <div>
            <div>
              <div
                style={{
                  position: "absolute",
                  marginTop: "30px",
                  marginLeft: "-40px",
                }}
              >
                <UserBadges userExp={user.exp_points} best={true} />
              </div>
              <ChakraImage
                style={{
                  height: "400px",
                  width: "100%",
                  borderRadius: "30px",
                  objectFit: "cover",
                }}
                src={volunteer.image}
                alt={volunteer.image}
              />
            </div>
            <br />
            <h1
              style={{
                fontSize: "26px",
                color: "maroon",
              }}
            >
              {volunteer.name}
            </h1>
            <p>{volunteer.description}</p>
            <br />
            <Box
              style={{
                backgroundColor: "rgb(255,255,255,0.6",
                padding: "1rem",
                borderRadius: "20px",
              }}
            >
              <Flex align={"center"}>
                <Image
                  src={require("../../../../resources/gem.png")}
                  width={30}
                  height={30}
                  alt="Big At Heart"
                  style={{ marginRight: "10px" }}
                />
                <h1>Total EXP: {volunteer.exp_points}</h1>
              </Flex>
              <br />
              {volunteer.exp_points !== "0" && (
                <UserBadges userExp={volunteer.exp_points} />
              )}
            </Box>
            <br />
            <Box
              style={{ marginBottom: "8px" }}
              className={classes["profile-button-dark"]}
              onClick={() => router.push("/profile/edit-settings")}
            >
              Edit Settings
            </Box>
            <Box
              className={classes["profile-button"]}
              onClick={() => router.push("/profile/volunteer-preferences")}
            >
              Edit Skills & Preferences
            </Box>
          </div>
          <br />
        </Box>
        <Box style={{ minWidth: "800px", maxWidth: "1000px" }}>
          <br />
          <div className={classes["main-selection-bar"]}>
            <div
              className={
                selectedMainView === "Activities"
                  ? `${classes["main-option-selected"]}`
                  : `${classes["main-option-unselected"]}`
              }
              onClick={() => setSelectedMainView("Activities")}
            >
              Activities
            </div>
            <div
              className={
                selectedMainView === "Blog"
                  ? `${classes["main-option-selected"]}`
                  : `${classes["main-option-unselected"]}`
              }
              onClick={() => setSelectedMainView("Blog")}
            >
              Blog Posts
            </div>
          </div>
          <br />
          {selectedMainView === "Activities" && (
            <>
              <div className={classes["selection-bar"]}>
                <div
                  className={
                    selectedView === "Signed Up"
                      ? `${classes["option-selected"]}`
                      : `${classes["option-unselected"]}`
                  }
                  onClick={() => setSelectedView("Signed Up")}
                >
                  Signed Up
                </div>
                <div
                  className={
                    selectedView === "Attended"
                      ? `${classes["option-selected"]}`
                      : `${classes["option-unselected"]}`
                  }
                  onClick={() => setSelectedView("Attended")}
                >
                  Attended
                </div>
              </div>

              {selectedMainView === "Activities" &&
                selectedView === "Signed Up" && (
                  <ul className={classes["grid_list_horizontal"]}>
                    {signedUp &&
                      signedUp
                        .filter(
                          (activity) =>
                            activity.datetime_end.toDate() >= currentTimestamp
                        )
                        .map((activity) => (
                          <ActivityCard key={activity.id} activity={activity} />
                        ))}
                  </ul>
                )}
              {selectedMainView === "Activities" &&
                selectedView === "Attended" && (
                  <ul className={classes["grid_list_horizontal"]}>
                    {attended &&
                      attended
                        .filter(
                          (activity) =>
                            activity.datetime_end.toDate() < currentTimestamp
                        )
                        .map((activity) => (
                          <ActivityCard
                            key={activity.id}
                            activity={activity}
                            inProfile={true}
                          />
                        ))}
                  </ul>
                )}
            </>
          )}
          {selectedMainView === "Blog" && (
            <VolunteerPastYearAttendance volunteerId={id} />
          )}
        </Box>
      </div>}
    </div>
  );
};

export default withAuth(VolunteerReport);
