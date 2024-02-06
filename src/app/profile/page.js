"use client";

import { useEffect, useState } from "react";
import { Box, Image } from "@chakra-ui/react";
import { db } from "../../firebase/config";
import withAuth from "../../hoc/withAuth";
import calculateUserExp from "../../utils/calculateUserExp";

import ActivityCard from "../../components/activities/ActivityCard";
import UserBadges from "../../components/gamify/UserBadges";
import classes from "./page.module.css";

const Profile = ({ user }) => {
	console.log(user);
	const userId = user.uid;
	const userName = user.name;

	const currentTimestamp = new Date();
	const [selectedView, setSelectedView] = useState("Signed Up");
	const signedUpIds = user.activities_signedup;
	const [signedUp, setSignedUp] = useState([]);
	const attendedDetails = user.activities_attended;
	const [attended, setAttended] = useState([]);
	const postIds = user.posts;
	const [posts, setPosts] = useState([]);

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
			setSignedUp(activityResults.filter(Boolean));
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
					console.log(activityDoc);
					if (activityDoc.exists) {
						return {
							id: attended.activity_id,
							...activityDoc.data(),
						};
					} else {
						console.log(
							`Activity with ID ${attended.activity_id} not found`
						);
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
			setAttended(activityResults.filter(Boolean));
		};

		const fetchPosts = async () => {
			if (!postIds || !Array.isArray(postIds)) {
				return;
			}
			const promises = postIds.map(async (postId) => {
				try {
					const postDoc = await db
						.collection("Posts")
						.doc(postId)
						.get();
					console.log(postDoc);
					if (postDoc.exists) {
						return { id: postId, ...postDoc.data() };
					} else {
						console.log(`Post with ID ${postId} not found`);
						return null;
					}
				} catch (error) {
					console.error(
						`Error fetching post details for ${postId}:`,
						error
					);
					return null;
				}
			});

			const postResults = await Promise.all(promises);
			setPosts(postResults.filter(Boolean));
		};

		fetchSignedUp();
		fetchAttended();
		fetchPosts();
	}, []);

	return (
		<div className={classes["page_layout"]}>
			<Box
				style={{
					height: "500px",
					padding: "0 0.5rem",
					minWidth: "400px",
					//backgroundColor: "teal",
				}}
			>
				<br />
				<div>
					<Image
						style={{
							height: "400px",
							width: "100%",
							borderRadius: "30px",
							objectFit: "cover",
						}}
						src={user.image}
						alt={user.image}
					/>
					<br />
					<h1
						style={{
							fontSize: "26px",
							color: "maroon",
						}}
					>
						{user.name}
					</h1>
					<p>{user.description}</p>
					<h1>Total EXP: {user.exp_points}</h1>
					{user.exp_points && (
						<UserBadges userExp={user.exp_points} />
					)}
				</div>
				<br />
			</Box>
			<Box style={{ minWidth: "800px", maxWidth: "1000px" }}>
				<br />
				<Box
					style={{
						// position: "absolute",
						zIndex: -100,
						backgroundColor: "#662828",
						borderRadius: "20px",
						padding: "20px",
						color: "#f7f2f2",
						minHeight: "400px",
					}}
				>
					<h1>My Activities</h1>

					<div>
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
						{selectedView === "Signed Up" && (
							<ul className={classes["grid_list_horizontal"]}>
								{signedUp &&
									signedUp
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
						{selectedView === "Attended" && (
							<ul className={classes["grid_list_horizontal"]}>
								{attended &&
									attended
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
											return startTimeB - startTimeA; // show latest first
										})
										.map((activity) => (
											<ActivityCard
												key={activity.id}
												activity={activity}
											/>
										))}
							</ul>
						)}
						<p>Show 3 signed up / attended</p>
						<p>SEE MORE...</p>
						{/* make see more like a button users can click to see all their activities */}
					</div>
					<br />
				</Box>
				<br />
				<Box
					style={{
						// position: "absolute",
						zIndex: -100,
						backgroundColor: "#e2b7a6",
						borderRadius: "20px",
						padding: "20px",
					}}
				>
					<h1>Blog Posts</h1>
					<br />
					<ul className={classes["grid_list"]}>
						{posts && posts.length > 0 ? (
							posts.map((post) => (
								<div key={post.id} className={classes["item"]}>
									{post.image && (
										<img
											src={post.image}
											className={classes["image"]}
										/>
									)}
									<b>{post.activity_name}</b>
									<p>{post.content}</p>
								</div>
							))
						) : (
							<div
								style={{
									fontSize: "15px",
									opacity: "60%",
									textAlign: "center",
								}}
							>
								Check out other volunteers' posts!
							</div>
						)}
					</ul>
				</Box>
			</Box>
		</div>
	);
};

export default withAuth(Profile);
