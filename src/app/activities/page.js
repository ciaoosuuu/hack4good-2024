"use client";

import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import { Box, Flex, Spacer, Stack } from "@chakra-ui/react";
import { Image as ChakraImage } from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import ActivityCard from "../../components/activities/ActivityCard";
import withAuth from "../../hoc/withAuth";
import classes from "./page.module.css";
import Image from "next/image";
import { FaCircleArrowRight } from "react-icons/fa6";
import { useRouter } from "next/navigation";

import {
	skills,
	interests,
	languages,
	capitalise,
} from "../../resources/skills-interests";

import { Roboto_Slab } from "next/font/google";
const roboto_slab = Roboto_Slab({
	weight: ["400", "700"],
	subsets: ["latin"],
	display: "swap",
});

const Activities = ({ user }) => {
	const router = useRouter();
	const currentTimestamp = new Date();
	const myActivitiesIds = user.activities_signedup;
	const [selectedView, setSelectedView] = useState("Upcoming");
	const [activities, setActivities] = useState([]);
	const [myActivities, setMyActivities] = useState([]);
	const [upcomingActivities, setUpcomingActivities] = useState([]);
	const [filteredUpcomingActivities, setFilteredUpcomingActivities] =
		useState([]);

	// Filter keys
	const [interestAreaKeys, setInterestAreaKeys] = useState([]);
	const [skillsKeys, setSkillsKeys] = useState([]);

	const [interestAreas, setInterestAreas] = useState(
		interests.map((interest) => {
			return {
				key: interest,
				value: interest,
				label: capitalise(interest),
			};
		})
	);
	const [skillsOptions, setSkillsOptions] = useState(
		skills.map((skill) => {
			return {
				key: skill,
				value: skill,
				label: capitalise(skill),
			};
		})
	);

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

				const upcomingActivitiesData = activitiesDataSorted.filter(
					(activity) =>
						activity.datetime_start.toDate() >= currentTimestamp
				);

				setActivities(activitiesDataSorted);
				setUpcomingActivities(upcomingActivitiesData);
				setFilteredUpcomingActivities(upcomingActivitiesData);
			} catch (error) {
				console.error("Error fetching activities:", error);
			}
		};

		// Call the fetch functions
		fetchActivities();
	}, []);

	useEffect(() => {
		const fetchMyActivities = async () => {
			if (!myActivitiesIds || !Array.isArray(myActivitiesIds)) {
				return;
			}
			const promises = myActivitiesIds.map(async (activityId) => {
				try {
					const activityDoc = await db
						.collection("Activities")
						.doc(activityId)
						.get();
					if (activityDoc.exists) {
						const activity_data = activityDoc.data();
						if (
							activity_data.datetime_start.toDate() >=
							currentTimestamp
						) {
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
			setMyActivities(activityResults.filter(Boolean));
		};

		fetchMyActivities(myActivitiesIds);
	}, []);

	useEffect(() => {
		let filtered = filteredUpcomingActivities;
		if (interestAreaKeys.length === 0 && skillsKeys.length === 0) {
			filtered = upcomingActivities;
		} else {
			filtered = upcomingActivities.filter((activity) => {
				if (!activity.tags) return false;
				return activity.tags.some(
					(tag) =>
						interestAreaKeys.some((key) => key === tag) ||
						skillsKeys.some((key) => key === tag)
				);
			});
		}
		// if (skillsKeys.length === 0) {
		// } else {
		// 	filtered = upcomingActivities.filter((activity) => {
		// 		if (!activity.tags) return false;
		// 		return activity.tags.some((tag) =>
		// 			skillsKeys.some((key) => key === tag)
		// 		);
		// 	});
		// }
		setFilteredUpcomingActivities(filtered);
	}, [interestAreaKeys, skillsKeys]);

	return (
		<>
			<div style={{ zIndex: 30 }}>
				<br />
				<div className={classes["page_layout"]}>
					<Box style={{ minWidth: "800px", maxWidth: "1000px" }}>
						<h1
							style={{ fontSize: "30px" }}
							className={roboto_slab.className}
						>
							Activities
						</h1>
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

						{selectedView === "Upcoming" && (
							<Stack gap={3}>
								<Box>
									<h1>Find by Volunteering Areas:</h1>
									{interestAreas && (
										<Select
											isMulti
											colorScheme="red"
											placeholder="Find by volunteering areas..."
											options={interestAreas}
											variant="outline"
											tagVariant="solid"
											value={interestAreaKeys.map(
												(interestAreaKey) => {
													return {
														value: interestAreaKey,
														label: capitalise(
															interestAreaKey
														),
													};
												}
											)}
											onChange={(
												selectedInterestAreaKeys
											) => {
												const newInterestAreaKeys =
													selectedInterestAreaKeys.map(
														(key) => key.value
													);
												setInterestAreaKeys(
													newInterestAreaKeys
												);
											}}
											style={{
												zIndex: 70,
												backgroundColor: "red",
											}}
										/>
									)}
								</Box>
								<Box>
									<h1>Find by Skills:</h1>
									{skillsOptions && (
										<Select
											isMulti
											placeholder="Find by skills..."
											options={skillsOptions}
											variant="outline"
											tagVariant="solid"
											value={skillsKeys.map((key) => {
												return {
													value: key,
													label: capitalise(key),
												};
											})}
											onChange={(
												selectedInterestAreaKeys
											) => {
												const newInterestAreaKeys =
													selectedInterestAreaKeys.map(
														(key) => key.value
													);
												setSkillsKeys(
													newInterestAreaKeys
												);
											}}
										/>
									)}
								</Box>
								{/* </Flex> */}
								<br />

								<ul className={classes["grid_list_horizontal"]}>
									{filteredUpcomingActivities &&
										filteredUpcomingActivities
											// .filter(
											// 	(activity) =>
											// 		activity.datetime_start.toDate() >=
											// 		currentTimestamp
											// )
											// .sort((activityA, activityB) => {
											// 	const startTimeA =
											// 		activityA.datetime_start.toDate();
											// 	const startTimeB =
											// 		activityB.datetime_start.toDate();
											// 	return startTimeA - startTimeB;
											// })
											.map((activity) => (
												<ActivityCard
													key={activity.id}
													activity={activity}
												/>
											))}
								</ul>
							</Stack>
						)}
						{selectedView === "Completed" && (
							<ul className={classes["grid_list_horizontal"]}>
								{activities &&
									activities
										.filter(
											(activity) =>
												activity.datetime_start.toDate() <=
												currentTimestamp
										)
										// .sort((activityA, activityB) => {
										// 	const startTimeA =
										// 		activityA.datetime_start.toDate();
										// 	const startTimeB =
										// 		activityB.datetime_start.toDate();
										// 	return startTimeB - startTimeA; // show newest first
										// })
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
							<h1 className={roboto_slab.className}>
								Announcements
							</h1>
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
						{user && user.role === "volunteer" && (
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
								<h1 className={roboto_slab.className}>
									My Activities
								</h1>
								<br />

								<ul
									className={classes["grid_list_horizontal"]}
									style={{ paddingLeft: "20px" }}
								>
									{myActivities && myActivities.length > 0 ? ( //replace this with list of actual activities just for this user
										myActivities //replace this with list of actual activities just for this user
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
											Upcoming activities you've signed up
											for will show up here!
										</div>
									)}
								</ul>

								<br />
							</div>
						)}
						{user && user.role !== "volunteer" && (
							<div
								style={{
									// position: "absolute",
									zIndex: -100,
									backgroundColor: "#2e2a2a",
									borderRadius: "20px",
									padding: "20px 20px 20px 20px",
									color: "#f7f2f2",
								}}
								className={
									classes["create-activities-shortcut"]
								}
								onClick={() =>
									router.push("/activities/create")
								}
							>
								<h1>
									<Flex align={"center"}>
										Post an Activity
										<Spacer />
										<FaCircleArrowRight size={27} />
									</Flex>
								</h1>
							</div>
						)}
						<Image
							src={require("../../resources/vector-building-2.png")}
							width={551}
							alt="Big At Heart"
							style={{ position: "absolute" }}
						/>
					</Box>
				</div>
			</div>
		</>
	);
};

export default withAuth(Activities);
