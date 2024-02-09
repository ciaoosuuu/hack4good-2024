"use client";

import { useState } from "react";
import Entries from "../blog/Entries";
import {
	Accordion,
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
} from "@chakra-ui/react";

const Posts = ({ reflections, classes }) => {
	const [selectedView, setSelectedView] = useState("reflection");

	const reflectionsSorted = reflections.sort((reflectionA, reflectionB) => {
		const postTimeA = reflectionA.datetime_posted.toDate();
		const postTimeB = reflectionB.datetime_posted.toDate();
		return postTimeA - postTimeB;
	});

	// const gridItem = (reflection, index) => (
	// 	<div key={index} className={classes["grid-item"]}>
	// 		{reflection.image && (
	// 			<img src={reflection.image} alt="Reflection" />
	// 		)}
	// 		<h1>{reflection.isanonymous ? "Anonymous" : "Name"}</h1>
	// 		<p>{`${reflection.content
	// 			.split(" ")
	// 			.slice(0, 60)
	// 			.join(" ")}...`}</p>
	// 	</div>
	// );

	return (
		<div>
			<br />
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
					<Tab onClick={() => setSelectedView("all")}>All</Tab>
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
			{selectedView === "all" && (
				<Entries
					entries={reflectionsSorted.slice()}
					classes={classes}
				/>
			)}
			{selectedView === "reflection" && (
				<Entries
					entries={reflectionsSorted
						.slice()
						.filter(
							(post) => post.type.toLowerCase() === "reflection"
						)}
					classes={classes}
				/>
			)}
			{selectedView === "feedback" && (
				<Entries
					entries={reflectionsSorted
						.slice()
						.filter(
							(post) => post.type.toLowerCase() === "feedback"
						)}
					classes={classes}
				/>
			)}
		</div>
	);
};

export default Posts;
