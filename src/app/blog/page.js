"use client";

import { useState, useEffect } from "react";
import { Box } from "@chakra-ui/react";
import { db } from "../../firebase/config";
import Entries from "../../components/blog/Entries";
import classes from "./page.module.css";
import Image from "next/image";

const Blog = () => {
	const [posts, setPosts] = useState();

	useEffect(() => {
		const fetchData = async () => {
			try {
				const postsSnapshot = await db.collection("Posts").get();

				const postsData = postsSnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				console.log(postsData);
				setPosts(postsData);
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
					<Box style={{ height: "350px" }}>
						<div>
							<Image
								src={require("../../resources/vector-helping.png")}
								width={831}
								height={50}
								alt="Big At Heart"
								style={{
									position: "absolute",
									// backgroundColor: "red",
									marginLeft: "100px",
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

					{posts && <Entries entries={posts} classes={classes} />}
				</div>{" "}
			</div>
		</>
	);
};

export default Blog;
