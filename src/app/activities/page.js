"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { db } from "../../firebase/config";
import { Box } from "@chakra-ui/react";
import { Image } from "@chakra-ui/react";
import { FaRegCalendarAlt, FaRegClock, FaMapPin } from "react-icons/fa";
import ActivityCard from "../../components/activities/ActivityCard";
import classes from "./page.module.css";

const Activities = () => {
	const [activities, setActivities] = useState(null);

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

				setActivities(activitiesData);

				console.log(activitiesData);
			} catch (error) {
				console.error("Error fetching activities:", error);
			}
		};

		// Call the fetch functions
		fetchActivities();
	}, []);

	return (
		<>
			<div style={{ zIndex: 30 }}>
				<br />
				<div className={classes["page_layout"]}>
					<Box style={{ maxWidth: "831px" }}>
						<h1 style={{ fontSize: "26px" }}>Activities</h1>
						{/* <Image
							src={require("../../resources/vector-building.png")}
							width={50}
							height={50}
							alt="Big At Heart"
						/> */}
						<br />
						<Image
							src={
								"https://static.wixstatic.com/media/11062b_905e23bb8e0b45a8ba27309aef66f3a9~mv2.jpeg/v1/fill/w_980,h_463,al_c,q_85,usm_0.66_1.00_0.01,enc_auto/11062b_905e23bb8e0b45a8ba27309aef66f3a9~mv2.jpeg"
							}
							className={classes["promo_slideshow"]}
						/>
						<br />
						<ul className={classes["grid_list_horizontal"]}>
							{activities &&
								activities
									.slice()
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

							{/* {activities &&
							activities
								.slice()
								.sort((activityA, activityB) => {
									const startTimeA =
										activityA.datetime_start.toDate();
									const startTimeB =
										activityB.datetime_start.toDate();
									return startTimeA - startTimeB;
								})
								.map((activity) => (
									<div
										key={activity.id}
										className={classes["item"]}
									>
										<Link
											href={`/activities/volunteer/${activity.id}`}
										>
											<img
												src={activity.image}
												className={classes["image"]}
											/>
											<div
												className={classes["type-tag"]}
											>
												{activity.type}
											</div>
											<p>{activity.name}</p>
											<div>
												<FaRegCalendarAlt />
												{activity.datetime_start
													.toDate()
													.toLocaleString("en-EN", {
														year: "numeric",
														month: "long",
														day: "numeric",
													}) +
													", " +
													activity.datetime_start
														.toDate()
														.toLocaleString(
															"en-EN",
															{
																weekday: "long",
															}
														)}
											</div>
											<div>
												<FaRegClock />
												{activity.datetime_start
													.toDate()
													.toLocaleString("en-EN", {
														hour: "numeric",
														minute: "numeric",
														hour12: true,
													}) +
													" to " +
													activity.datetime_end
														.toDate()
														.toLocaleString(
															"en-EN",
															{
																hour: "numeric",
																minute: "numeric",
																hour12: true,
															}
														)}
											</div>
											<div>
												<FaMapPin />
												{activity.location_name}
											</div>
											<div>
												<ul className={classes["tags"]}>
													{activity.tags.map(
														(tag, index) => (
															<li key={index}>
																{tag}
															</li>
														)
													)}
												</ul>
											</div>
										</Link>
									</div>
								))} */}
						</ul>
					</Box>
					<Box
						style={{
							height: "500px",
							padding: "0 0.5rem",
							// backgroundColor: "#8f3d3c",
							// borderRadius: "20px",
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

							{/* <ul className={classes["grid_list_horizontal"]}>
								{activities && //replace this with list of actual activities just for this user
									activities //replace this with list of actual activities just for this user
										.slice(0, 2)
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
										))}
							</ul> */}

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
							<h1>Upcoming Activities</h1>
							<br />

							<ul
								className={classes["grid_list_horizontal"]}
								style={{ paddingLeft: "20px" }}
							>
								{activities && //replace this with list of actual activities just for this user
									activities //replace this with list of actual activities just for this user
										.slice(0, 2)
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
										))}
							</ul>

							<br />
						</div>
					</Box>
				</div>
			</div>
		</>
	);
};

export default Activities;
