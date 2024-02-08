"use client";

import { useEffect, useState } from "react";
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
import { db } from "../../firebase/config";
import withAuth from "../../hoc/withAuth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import calculateUserExp from "../../utils/calculateUserExp";

import ActivityCard from "../../components/activities/ActivityCard";
import UserBadges from "../../components/gamify/UserBadges";
import Entries from "../../components/blog/Entries";
import classes from "./page.module.css";

const Profile = ({ user }) => {
	const router = useRouter();
	const userId = user.uid;
	const userName = user.name;

	useEffect(() => {
		if (user.role !== "volunteer") {
			router.push("/profile/edit-settings");
		}
	}, [user]);

	const currentTimestamp = new Date();
	const [selectedMainView, setSelectedMainView] = useState("Activities");
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
			const activitySorted = activityResults
				.filter(Boolean)
				.sort((activityA, activityB) => {
					const startTimeA = activityA.datetime_start.toDate();
					const startTimeB = activityB.datetime_start.toDate();
					return startTimeB - startTimeA; // show latest first
				});

			setAttended(activitySorted);
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
			const postsSorted = postResults
				.filter(Boolean)
				.sort((entryA, entryB) => {
					const postTimeA = entryA.datetime_posted.toDate();
					const postTimeB = entryB.datetime_posted.toDate();
					return postTimeA - postTimeB;
				});
			setPosts(postsSorted);
		};

		fetchSignedUp();
		fetchAttended();
		fetchPosts();
	}, []);

	return (
		<>
			{" "}
			{user && user.role === "volunteer" && (
				<div className={classes["page_layout"]}>
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
									<UserBadges
										userExp={user.exp_points}
										best={true}
									/>
								</div>
								<ChakraImage
									style={{
										height: "400px",
										width: "100%",
										borderRadius: "30px",
										objectFit: "cover",
									}}
									src={user.image}
									alt={user.image}
								/>
							</div>
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
										src={require("../../resources/gem.png")}
										width={30}
										height={30}
										alt="Big At Heart"
										style={{ marginRight: "10px" }}
									/>
									<h1>Total EXP: {user.exp_points}</h1>
								</Flex>
								<br />
								{user.exp_points !== "0" && (
									<UserBadges userExp={user.exp_points} />
								)}
							</Box>
							<br />
							<Box
								style={{ marginBottom: "8px" }}
								className={classes["profile-button-dark"]}
								onClick={() =>
									router.push("/profile/edit-settings")
								}
							>
								Edit Settings
							</Box>
							<Box
								className={classes["profile-button"]}
								onClick={() =>
									router.push(
										"/profile/volunteer-preferences"
									)
								}
							>
								Edit Skills & Preferences
							</Box>
						</div>
						<br />
					</Box>
					<Box
						style={{
							minWidth: "800px",
							maxWidth: "1000px",
						}}
					>
						<br />
						<div className={classes["main-selection-bar"]}>
							<div
								className={
									selectedMainView === "Activities"
										? `${classes["main-option-selected"]}`
										: `${classes["main-option-unselected"]}`
								}
								onClick={() =>
									setSelectedMainView("Activities")
								}
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
										onClick={() =>
											setSelectedView("Signed Up")
										}
									>
										Signed Up
									</div>
									<div
										className={
											selectedView === "Attended"
												? `${classes["option-selected"]}`
												: `${classes["option-unselected"]}`
										}
										onClick={() =>
											setSelectedView("Attended")
										}
									>
										Attended
									</div>
								</div>

								{selectedMainView === "Activities" &&
									selectedView === "Signed Up" && (
										<ul
											className={
												classes["grid_list_horizontal"]
											}
											style={{
												maxHeight: "80vh",
												overflowY: "auto",
											}}
										>
											{signedUp &&
												signedUp
													.filter(
														(activity) =>
															activity.datetime_end.toDate() >=
															currentTimestamp
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
								{selectedMainView === "Activities" &&
									selectedView === "Attended" && (
										<ul
											className={
												classes["grid_list_horizontal"]
											}
											style={{
												maxHeight: "80vh",
												overflowY: "auto",
											}}
										>
											{attended &&
												attended
													.filter(
														(activity) =>
															activity.datetime_end.toDate() <
															currentTimestamp
													)
													.map((activity) => (
														<ActivityCard
															key={activity.id}
															activity={activity}
															allowReq={true}
															inProfile={true}
														/>
													))}
										</ul>
									)}
							</>
						)}
						{selectedMainView === "Blog" && (
							<div
								style={{
									maxHeight: "85vh",
									overflowY: "auto",
								}}
							>
								{posts && (
									<Entries
										entries={posts}
										classes={classes}
										numColsInput={3}
									/>
								)}
							</div>
						)}
						{/* <Box
				// style={{
				// 	// position: "absolute",
				// 	zIndex: -100,
				// 	backgroundColor: "#662828",
				// 	borderRadius: "20px",
				// 	padding: "20px",
				// 	color: "#f7f2f2",
				// 	minHeight: "400px",
				// }}
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
						<div
							style={{
								width: "100%",
								display: "flex",
								justifyContent: "center",
								color: "maroon",
								marginTop: "10px",
							}}
						>
							<button>
								<Link href="/profile/myactivities">
									SEE MORE...
								</Link>
							</button>
						</div>
					</div>
					<br />
				</Box>
				<br />
				<Box
				// style={{
				// 	// position: "absolute",
				// 	zIndex: -100,
				// 	backgroundColor: "#e2b7a6",
				// 	borderRadius: "20px",
				// 	padding: "20px",
				// }}
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
				</Box> */}
					</Box>
				</div>
			)}
		</>
	);
};

export default withAuth(Profile);

{
	/* <Tabs isFitted variant="soft-rounded" colorScheme="red">
	<TabList
		style={{
			borderRadius: "20px",
			boxShadow: "2px 2px 2px #00000020",
		}}
	>
		<Tab>Activities</Tab>
		<Tab>Blog Posts</Tab>
	</TabList>
	<TabPanels>
		<TabPanel>
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
	
			</div>
		</TabPanel>
		<TabPanel>
			{posts && (
				<Entries entries={posts} classes={classes} numColsInput={3} />
			)}
		</TabPanel>
	</TabPanels>
</Tabs>; */
}
