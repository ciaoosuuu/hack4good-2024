"use client";

import { useEffect, useState } from "react";
import { db } from "../firebase/config";
import withAuth from "../hoc/withAuth";
import { Box, Flex, Stack, Spacer, Button } from "@chakra-ui/react";
import Link from "next/link";
import Image from "next/image";
import { Roboto_Slab } from "next/font/google";
import { useRouter } from "next/navigation";
import Entries from "../components/blog/Entries";
import classes from "../app/blog/page.module.css";
import { UserAuth } from "./context/AuthContext";

import ActivityCard from "../components/activities/ActivityCard";
import getTopActivities from "../utils/matching/getTopActivities"

export const roboto_slab = Roboto_Slab({
	weight: ["400", "700"],
	subsets: ["latin"],
	display: "swap",
});

const containerStyle = {
	maxWidth: "800px",
	margin: "0 auto",
	padding: "20px",
};

const paragraphStyle = {
	lineHeight: "1.6",
};

const upcomingActivitiesStyle = {
	marginTop: "20px",
};

const upcomingActivitiesHeaderStyle = {
	color: "#333",
};

const upcomingActivitiesListStyle = {
	listStyle: "none",
	padding: "0",
};

const upcomingActivitiesItemStyle = {
	marginBottom: "20px",
};

const upcomingActivitiesLinkStyle = {
	color: "#0070f3",
	textDecoration: "none",
	fontWeight: "bold",
};

const upcomingActivitiesLinkHoverStyle = {
	textDecoration: "underline",
};

const UpcomingActivities = () => (
	<div style={upcomingActivitiesStyle}>
		<h2 style={upcomingActivitiesHeaderStyle}>Upcoming Activities</h2>
		<ul style={upcomingActivitiesListStyle}>
			<li style={upcomingActivitiesItemStyle}>
				<strong>Event Title 1</strong> - Date/Time
				<p>Description of the event.</p>
			</li>
			<li style={upcomingActivitiesItemStyle}>
				<strong>Event Title 2</strong> - Date/Time
				<p>Description of the event.</p>
			</li>
			<li style={upcomingActivitiesItemStyle}>
				<strong>Event Title 3</strong> - Date/Time
				<p>Description of the event.</p>
			</li>
		</ul>
		{/* <Link href="/activities">
		<a style={upcomingActivitiesLinkStyle}>View All Upcoming Activities</a>
	  </Link> */}
	</div>
);

const Home = () => {
	const { user } = UserAuth();
	const router = useRouter();
	const [posts, setPosts] = useState();
	const [activities, setActivities] = useState([]);

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
		console.log("user", user);
		const fetchData = async () => {
			try {
				const postsSnapshot = await db.collection("Posts").get();

				const postsData = postsSnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				console.log(postsData);

				const postsSorted = postsData.sort((entryA, entryB) => {
					const postTimeA = entryA.datetime_posted.toDate();
					const postTimeB = entryB.datetime_posted.toDate();
					return postTimeA - postTimeB;
				});
				setPosts(postsSorted);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	return (
		<div style={{ zIndex: 30, padding: "20px 0" }}>
			<div
				style={{
					display: "grid",
					gridTemplateColumns: "3fr 2fr",
					height: "40vh",
					margin: "0 10%",
				}}
			>
				<div style={{ margin: "auto" }}>
					<h1
						style={{
							fontSize: "40px",
							color: "#333",
						}}
						className={roboto_slab.className}
					>
						Welcome to <br />
						<p style={{ fontSize: "45px" }}>Big At Heart</p>
					</h1>
					<br />
					<p style={paragraphStyle}>
						Big At Heart is a Non-Profit Social Service Organization
						inspiring GIVING through Volunteering,
						Donations-in-kind, and Fundraising. We help match
						volunteers and donors to curated causes, specifically
						those working for Children, Women, and Low Income
						communities. We create custom giving projects or connect
						you to existing causes that you can get involved in.
					</p>
				</div>
			</div>
			<br />
			<div
				style={{
					zIndex: 40,
					marginLeft: "-1rem",
					marginRight: "-1rem",
				}}
			>
				<Box
					style={{
						width: "100%",
						minHeight: "400px",
						backgroundColor: "#A84141",
						padding: "40px",
					}}
				>
					<h1
						style={{
							fontSize: "40px",
							color: "white",
							textAlign: "center",
						}}
						className={roboto_slab.className}
					>
						Ways to Give
					</h1>
					<br />
					<Flex
						style={{
							color: "white",
							textAlign: "center",
							width: "80%",
							margin: "0 auto",
						}}
						justify={"center"}
					>
						<Stack align={"center"}>
							<Image
								src={require("../resources/main/donate.png")}
								width={150}
								height={150}
								alt="Donate"
							/>
							<h1>Donate</h1>
							<p style={{ width: "80%" }}>
								Every contribution matters. We are grateful to
								each one of you for sparing your thoughts,
								showing empathy, and taking an action for the
								needy.
							</p>
						</Stack>
						<Spacer />
						<Stack align={"center"}>
							<Image
								src={require("../resources/main/volunteering.png")}
								width={150}
								height={150}
								alt="Donate"
							/>
							<h1>Volunteer</h1>
							<p style={{ width: "80%" }}>
								We do many on-ground volunteering activities in
								Singapore. If you are keen to join, please click
								below and be a part of our volunteer group.
							</p>
							{user ? (
								<Box
									className="give-button"
									onClick={() => router.push("activities")}
								>
									Check out Activities!
								</Box>
							) : (
								<Box
									className="give-button"
									onClick={() =>
										router.push("account/signup/volunteer")
									}
								>
									Sign up now!
								</Box>
							)}
						</Stack>
						<Spacer />
						<Stack align={"center"}>
							<Image
								src={require("../resources/main/collaboration.png")}
								width={150}
								height={150}
								alt="Donate"
							/>
							<h1>Collaborate</h1>
							<p style={{ width: "80%" }}>
								If you are an organization in Singapore working
								directly with causes of children and youth in
								education sector, please write to us with your
								collaboration ideas.
							</p>
						</Stack>
						<br />
					</Flex>
				</Box>
			</div>
			<br />
			<div style={{ width: "80%", margin: "0 auto" }}>
				<h1
					style={{
						fontSize: "40px",
						color: "#333",
						textAlign: "center",
					}}
					className={roboto_slab.className}
				>
						Recommended Activities For You
				</h1>
				<ul className={classes["grid_list_horizontal"]}>
					{activities &&
						getTopActivities(user, activities)
							.map((activity) => (
								<ActivityCard
									key={activity.id}
									activity={activity}
								/>
							))}
				</ul>
			</div>
			<br />
			<div style={{ width: "80%", margin: "0 auto" }}>
				<h1
					style={{
						fontSize: "40px",
						color: "#333",
						textAlign: "center",
					}}
					className={roboto_slab.className}
				>
					<p style={{ fontSize: "20px" }}>
						Something Inspirational, Something Informational
					</p>
					<br />
					Blog Posts From Our Volunteers
				</h1>
				<br />
				{posts && (
					<Entries
						entries={posts.slice(0, 3)}
						classes={classes}
						numColsInput={3}
					/>
				)}
				<Box
					className="more-button"
					onClick={() => router.push("blog")}
				>
					See More
				</Box>
			</div>

			{/* <p style={paragraphStyle}>
				Join us and start your giving journey in a fun, easy, and
				fulfilling way. Come find your volunasia with us!
			</p>
			<p style={paragraphStyle}>
				"VOLUNASIA is that moment when you forget you're volunteering to
				help change lives because it's changing yours."
			</p>
			<h2>Mission</h2>
			<p style={paragraphStyle}>
				Big At Heart is a Non-Profit Service Organization inspiring
				GIVING through Volunteering, Donations-in-kind, and Fundraising.
				We help match givers to curated causes. We also create custom
				giving projects or connect volunteers to existing causes that
				they can get involved in. We make the journey easy for the
				givers so that they taste the quintessential fulfillment which
				inspires them to keep giving. It becomes their volunasia, and
				the society has a giver for life.
			</p>
			<UpcomingActivities /> */}
		</div>
	);
};

export default Home;
