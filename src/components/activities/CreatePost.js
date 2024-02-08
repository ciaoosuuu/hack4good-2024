"use client";

import { useState } from "react";
import { arrayUnion } from "firebase/firestore";
import { db } from "../../firebase/config";
import calculateUserExp from "../../utils/calculateUserExp";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { projectStorage } from "../../firebase/config";

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
	const router = useRouter();
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

	const handleImageChange = async (e) => {
		const file = e.target.files[0];

		if (file) {
			// Check if there's a previously uploaded image
			if (image) {
				// Delete the previous image
				try {
					const previousImageRef = projectStorage.refFromURL(
						image
					);
					await previousImageRef.delete();
				} catch (error) {
					console.error("Error deleting previous image:", error);
				}
			}

			// Upload the new image
			const storageRef = projectStorage.ref();
			const imageRef = storageRef.child(`Posts/${file.name}`);
			await imageRef.put(file);
			const imageUrl = await imageRef.getDownloadURL();

			setImage(imageUrl);
		}
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
				image: image,
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
			Swal.fire({
				title: "Success!",
				text: "Post successfully created!",
				icon: "success",
				timer: 1000,
				timerProgressBar: true,
				showConfirmButton: false,
				allowOutsideClick: false,
			});
			setTimeout(() => {
				location.reload();
			}, 1000);
		} catch (error) {
			console.error("Error updating field:", error);
			Swal.fire({
				title: "Error!",
				text: error,
				icon: "error",
				timer: 1000,
				timerProgressBar: true,
				showConfirmButton: false,
				allowOutsideClick: false,
			});
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
