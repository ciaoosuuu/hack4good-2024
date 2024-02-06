"use client";

import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import Entries from "../../components/blog/Entries";
import classes from "./page.module.css";

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
				<br />
				<div className={classes["page_layout"]}>
					Blog
					{posts && <Entries entries={posts} classes={classes} />}
				</div>{" "}
			</div>
		</>
	);
};

export default Blog;
