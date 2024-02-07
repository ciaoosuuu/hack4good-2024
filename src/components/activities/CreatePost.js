"use client";

import { useState } from "react";
import { arrayUnion } from "firebase/firestore";
import { db } from "../../firebase/config";
import calculateUserExp from "../../utils/calculateUserExp";

import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Checkbox,
	Select,
	Textarea,
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionIcon,
	AccordionPanel,
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
} from "@chakra-ui/react";
import { FaPenFancy } from "react-icons/fa";
// import withAuth from "../../hoc/withAuth";

const CreatePost = ({ activityId, activityName, user, classes }) => {
	if (user.role !== "volunteer") {
		return null;
	}

	const userId = user.uid;
	const [isAnonymous, setIsAnonymous] = useState(false);
	const [postType, setPostType] = useState("reflection");
	const [postText, setPostText] = useState("");
	const [image, setImage] = useState(null);

	const handleAnonymousChange = (e) => {
		setIsAnonymous(e.target.checked);
	};

	const handlePostTypeChange = (e) => {
		setPostType(e.target.value);
	};

	const handlePostTextChange = (e) => {
		setPostText(e.target.value);
	};

	const handleImageChange = (e) => {
		const selectedImage = e.target.files[0];
		setImage(selectedImage);
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const currentDate = new Date();

			const postRef = await db.collection("Posts").add({
				activity_id: activityId,
				activity_name: activityName,
				content: postText,
				datetime_posted: currentDate,
				isanonymous: isAnonymous,
				type: postType,
				image: "",
				user_id: userId,
			});

			const newPostId = postRef.id;

			const userRef = db.collection("Users").doc(userId);
			await userRef
				.update({
					posts: arrayUnion(newPostId),
				})
				.then(async () => {
					const newExp = await calculateUserExp(user);
					return userRef.update({
						exp_points: newExp,
					});
				});
		} catch (error) {
			console.error("Error updating field:", error);
		}
	};

	return (
		<>
			<Accordion
				allowToggle={true}
				style={{
					width: "80%",
					margin: "0 auto",
					borderColor: "#E4D5D5",
				}}
			>
				<AccordionItem>
					<h2>
						<AccordionButton>
							<Box as="span" flex="1" textAlign="left">
								<h1
									style={{
										display: "flex",
										alignItems: "center",
									}}
								>
									<FaPenFancy
										style={{ marginRight: "12px" }}
									/>
									Create a Post
								</h1>
							</Box>
							<AccordionIcon />
						</AccordionButton>
					</h2>
					<AccordionPanel pb={4}>
						<form onSubmit={handleSubmit}>
							<div className={classes["postform"]}>
								<FormControl isRequired>
									<FormLabel>Post Type:</FormLabel>
									<Select
										name="postType"
										value={postType}
										onChange={handlePostTypeChange}
										placeholder="Activity Type"
										variant="filled"
									>
										<option value="reflection">
											Reflection
										</option>
										<option value="feedback">
											Feedback
										</option>
									</Select>
								</FormControl>
								<br />
								<FormControl isRequired>
									<FormLabel>Text:</FormLabel>
									<Textarea
										type="text"
										name="text"
										value={postText}
										onChange={handlePostTextChange}
										placeholder="Name"
										variant="filled"
									/>
								</FormControl>
								<br />
								<FormControl>
									<FormLabel>Upload Image:</FormLabel>
									<input
										type="file"
										accept="image/*"
										onChange={handleImageChange}
										style={styles.input}
									/>
								</FormControl>
								<br />
								<Checkbox
									colorScheme={"red"}
									defaultChecked
									isChecked={isAnonymous}
									onChange={handleAnonymousChange}
								>
									Post anonymously
								</Checkbox>
								{/* <div>
									<label>
										<input
											type="checkbox"
											checked={isAnonymous}
											onChange={handleAnonymousChange}
										/>
										Anonymous
									</label>
								</div> */}
							</div>
							<br />
							<Button
								type="submit"
								colorScheme="red"
								variant={"outline"}
								style={{ width: "100%" }}
								//onClick={handleSubmit}
							>
								Post
							</Button>
						</form>
					</AccordionPanel>
				</AccordionItem>
			</Accordion>
		</>
	);
};

const styles = {
	input: {
		padding: "8px",
		margin: "5px 0",
		borderRadius: "4px",
		border: "1px solid #ccc",
		width: "100%",
	},
};

export default CreatePost;
