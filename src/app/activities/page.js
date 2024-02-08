"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "../../firebase/config";
import { Box } from "@chakra-ui/react";
import { Image as ChakraImage } from "@chakra-ui/react";
import { FaRegCalendarAlt, FaRegClock, FaMapPin } from "react-icons/fa";
import ActivityCard from "../../components/activities/ActivityCard";
import withAuth from "../../hoc/withAuth";
import classes from "./page.module.css";
import Image from "next/image";

const Activities = ({ user }) => {
	const currentTimestamp = new Date();
	const upcomingActivitiesIds = user.activities_signedup;
	const [selectedView, setSelectedView] = useState("Upcoming");
	const [activities, setActivities] = useState([]);
	const [upcomingActivities, setUpcomingActivities] = useState([]);

	useEffect(() => {
		const fetchActivities = async () => {
			try {
				const activitiesSnapshot = await db
					.collection("Activities")
					.get();

				if (activitiesSnapshot.empty) {
					console.log("No activities found.");
					setLoading(false);
					return;
				}

				const activitiesData = activitiesSnapshot.docs.map((doc) => ({
					id: doc.id,
					datetime_start: doc.data().datetime_start,
					...doc.data(),
				}));

				const activitiesDataSorted = activitiesData.sort(
					(activityA, activityB) => {
						const startTimeA = activityA.datetime_start.toDate();
						const startTimeB = activityB.datetime_start.toDate();
						return startTimeA - startTimeB;
					}
				);

				setActivities(activitiesDataSorted);
			} catch (error) {
				console.error("Error fetching activities:", error);
			}
		};

		// Call the fetch functions
		fetchActivities();
	}, []);

	useEffect(() => {
		const fetchUpcomingActivities = async () => {
			if (
				!upcomingActivitiesIds ||
				!Array.isArray(upcomingActivitiesIds)
			) {
				return;
			}
			const promises = upcomingActivitiesIds.map(async (activityId) => {
				try {
					const activityDoc = await db
						.collection("Activities")
						.doc(activityId)
						.get();
					if (activityDoc.exists) {
						const activity_data = activityDoc.data();
						if (activity_data.datetime_start.toDate() >= currentTimestamp) {
							return { id: activityId, ...activityDoc.data() };
						}
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
			setUpcomingActivities(activityResults.filter(Boolean));
		};

		fetchUpcomingActivities(upcomingActivitiesIds);
	}, []);

	return (
		<>
			<div style={{ zIndex: 30 }}>
				<br />
				<div className={classes["page_layout"]}>
					<Box style={{ minWidth: "800px", maxWidth: "1000px" }}>
						<h1 style={{ fontSize: "30px" }}>Activities</h1>
						<div style={{ height: "380px" }}>
							<Image
								src={require("../../resources/vector-building-2.png")}
								width={831}
								height={50}
								alt="Big At Heart"
								style={{ position: "absolute" }}
							/>
							<br />
							<ChakraImage
								src={
									"https://static.wixstatic.com/media/11062b_905e23bb8e0b45a8ba27309aef66f3a9~mv2.jpeg/v1/fill/w_980,h_463,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/11062b_905e23bb8e0b45a8ba27309aef66f3a9~mv2.jpeg"
								}
								className={classes["promo_slideshow"]}
							/>
						</div>
						<br />
						<div className={classes["selection-bar"]}>
							<div
								className={
									selectedView === "Upcoming"
										? `${classes["option-selected"]}`
										: `${classes["option-unselected"]}`
								}
								onClick={() => setSelectedView("Upcoming")}
							>
								Upcoming Activities
							</div>
							<div
								className={
									selectedView === "Completed"
										? `${classes["option-selected"]}`
										: `${classes["option-unselected"]}`
								}
								onClick={() => setSelectedView("Completed")}
							>
								Past Activities
							</div>
						</div>
						<br />
						{selectedView === "Upcoming" && (
							<ul className={classes["grid_list_horizontal"]}>
								{activities &&
									activities
										.filter(
											(activity) =>
												activity.datetime_end.toDate() >=
												currentTimestamp
										)
										.sort((activityA, activityB) => {
											const startTimeA =
												activityA.datetime_start.toDate();
											const startTimeB =
												activityB.datetime_start.toDate();
											return startTimeA - startTimeB;
										})
										.map((activity) => (
											<ActivityCard
												key={activity.id}
												activity={activity}
											/>
										))}
							</ul>
						)}
						{selectedView === "Completed" && (
							<ul className={classes["grid_list_horizontal"]}>
								{activities &&
									activities
										.filter(
											(activity) =>
												activity.datetime_end.toDate() <
												currentTimestamp
										)
										.sort((activityA, activityB) => {
											const startTimeA =
												activityA.datetime_start.toDate();
											const startTimeB =
												activityB.datetime_start.toDate();
											return startTimeB - startTimeA; // show newest first
										})
										.map((activity) => (
											<ActivityCard
												key={activity.id}
												activity={activity}
											/>
										))}
							</ul>
						)}
					</Box>
					<Box
						style={{
							height: "500px",
							padding: "0 0.5rem",
							minWidth: "400px",
						}}
					>
						<div
							style={{
								// position: "absolute",
								zIndex: -100,
								backgroundColor: "#e2b7a6",
								borderRadius: "20px",
								padding: "20px",
							}}
						>
							<h1>Announcements</h1>
							<br />

							<div
								style={{
									fontSize: "15px",
									opacity: "60%",
									textAlign: "center",
								}}
							>
								Watch out for announcements here!
							</div>

							<br />
						</div>
						<br />
						<div
							style={{
								// position: "absolute",
								zIndex: -100,
								backgroundColor: "#2e2a2a",
								borderRadius: "20px",
								padding: "20px 20px 20px 20px",
								color: "#f7f2f2",
							}}
						>
							<h1>My Activities</h1>
							<br />

							<ul
								className={classes["grid_list_horizontal"]}
								style={{ paddingLeft: "20px" }}
							>
								{upcomingActivities &&
								upcomingActivities.length > 0 ? ( //replace this with list of actual activities just for this user
									upcomingActivities //replace this with list of actual activities just for this user
										.filter((activity) =>
											activity.datetime_end.toDate() >=
											currentTimestamp
										)
										.sort((activityA, activityB) => {
											const startTimeA =
												activityA.datetime_start.toDate();
											const startTimeB =
												activityB.datetime_start.toDate();
											return startTimeA - startTimeB;
										})
										
										.map((activity) => (
											<ActivityCard
												key={activity.id}
												activity={activity}
												mini={true}
											/>
										))
								) : (
									<div
										style={{
											fontSize: "15px",
											opacity: "60%",
											textAlign: "center",
										}}
									>
										Upcoming activities you've signed up for will
										show up here!
									</div>
								)}
							</ul>

							<br />
						</div>
					</Box>
				</div>
			</div>
		</>
	);
};

export default withAuth(Activities);
