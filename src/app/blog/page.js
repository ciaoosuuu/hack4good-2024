"use client";

import { useState, useEffect } from "react";
import { Box, Tabs, TabList, Tab, TabPanels, TabPanel } from "@chakra-ui/react";
import { db } from "../../firebase/config";
import Entries from "../../components/blog/Entries";
import classes from "./page.module.css";
import Image from "next/image";

const Blog = () => {
	const [posts, setPosts] = useState();
	const [selectedView, setSelectedView] = useState("all");

	useEffect(() => {
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
		<>
			<div style={{ zIndex: 30 }}>
				<div className={classes["page_layout"]}>
					<br />
					<Box style={{ height: "350px", minWidth: "1200px" }}>
						<div>
							<Image
								src={require("../../resources/vector-helping.png")}
								width={831}
								height={50}
								alt="Big At Heart"
								style={{
									position: "absolute",
									// backgroundColor: "red",
									marginLeft: "80px",
								}}
							/>
							<br />
							<br />
							<br />
							<br />
							<h1
								style={{
									fontSize: "30px",
									textAlign: "center",
								}}
							>
								Our Stories and Experiences
							</h1>
							<p
								style={{
									width: "400px",
									textAlign: "center",
									margin: "10px auto",
								}}
							>
								From their impactful contributions to heartfelt
								reflections, discover what{" "}
								<text style={{ fontWeight: "700" }}>
									our volunteers
								</text>{" "}
								have to say about their journeys with us.
							</p>
						</div>
					</Box>
					<Tabs
						isFitted
						variant="enclosed"
						colorScheme={"red"}
						style={{
							width: "80%",
							margin: "0 auto",
							borderColor: "#E4D5D5",
						}}
					>
						<TabList mb="1em">
							<Tab onClick={() => setSelectedView("reflection")}>
								All
							</Tab>
							<Tab onClick={() => setSelectedView("reflection")}>
								Reflections
							</Tab>
							<Tab onClick={() => setSelectedView("feedback")}>
								Feedback
							</Tab>
						</TabList>
						<TabPanels>
							<TabPanel></TabPanel>
							<TabPanel></TabPanel>
							<TabPanel></TabPanel>
						</TabPanels>
					</Tabs>

					{posts && (
						<>
							{selectedView === "all" && (
								<Entries
									entries={posts.slice()}
									classes={classes}
								/>
							)}
							{selectedView === "reflection" && (
								<Entries
									entries={posts
										.slice()
										.filter(
											(post) =>
												post.type.toLowerCase() ===
												"reflection"
										)}
									classes={classes}
								/>
							)}
							{selectedView === "feedback" && (
								<Entries
									entries={posts
										.slice()
										.filter(
											(post) =>
												post.type.toLowerCase() ===
												"feedback"
										)}
									classes={classes}
								/>
							)}
						</>
					)}
				</div>{" "}
			</div>
		</>
	);
};

export default Blog;
