"use client";

import { useState, useEffect, useRef } from "react";
import { db, projectStorage } from "../../../firebase/config";
import { Timestamp, arrayUnion } from "firebase/firestore";
import withAuth from "../../../hoc/withAuth";
import Swal from "sweetalert2";
import { useRouter } from "next/navigation";
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	Image,
	Accordion,
	AccordionItem,
	AccordionButton,
	AccordionIcon,
	AccordionPanel,
} from "@chakra-ui/react";
import { Select as MultiSelect } from "chakra-react-select";
import {
	activityTypes as activityTypesData,
	capitalise,
	interests,
	skills,
} from "../../../resources/skills-interests";
import classes from "../page.module.css";
import { GrEdit } from "react-icons/gr";
import {
	getAuth,
	updatePassword,
	reauthenticateWithCredential,
	EmailAuthProvider,
} from "firebase/auth";

const formatDateForInput = (timestamp) => {
	if (!timestamp) return "";

	const date = timestamp.toDate();
	const year = date.getFullYear();
	const month = `0${date.getMonth() + 1}`.slice(-2);
	const day = `0${date.getDate()}`.slice(-2);
	const hours = `0${date.getHours()}`.slice(-2);
	const minutes = `0${date.getMinutes()}`.slice(-2);

	return `${year}-${month}-${day}T${hours}:${minutes}`;
};

const ProfileSettings = ({ user }) => {
	const auth = getAuth();
	const fileInput = useRef(null);
	const router = useRouter();
	const [activityTypes, setActivityTypes] = useState(activityTypesData);
	const [tagOptions, setTagOptions] = useState(
		[...interests, ...skills].map((tag) => {
			return { key: tag, label: capitalise(tag), value: tag };
		})
	);
	const [formChanged, setFormChanged] = useState(false);
	const [passwordFormChanged, setPasswordFormChanged] = useState(false);
	const [formData, setFormData] = useState({
		name: user.name ? user.name : null,
		email: user.email ? user.email : null,
		image: user.image ? user.image : null,
	});
	const [passwordFormData, setPasswordFormData] = useState({
		oldPassword: null,
		password: null,
		password2: null,
	});

	const handleImageChange = async (e) => {
		const file = e.target.files[0];

		if (file) {
			// Check if there's a previously uploaded image
			if (formData.image) {
				// Delete the previous image
				try {
					const previousImageRef = projectStorage.refFromURL(
						formData.image
					);
					await previousImageRef.delete();
				} catch (error) {
					console.error("Error deleting previous image:", error);
				}
			}

			// Upload the new image
			const storageRef = projectStorage.ref();
			const imageRef = storageRef.child(`Users/${file.name}`);
			await imageRef.put(file);
			const imageUrl = await imageRef.getDownloadURL();

			console.log("imageurl", imageUrl);
			setFormData((formData) => {
				return { ...formData, image: imageUrl };
			});
			const userRef = db.collection("Users").doc(user.uid);
			await userRef.update({
				image: imageUrl,
			});
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;
		setFormChanged(true);

		if (name.includes("datetime")) {
			// Handle date fields separately
			const timestampDate = value
				? Timestamp.fromDate(new Date(value))
				: Timestamp.fromDate(new Date());

			setFormData((prevData) => ({
				...prevData,
				[name]: timestampDate,
			}));
		} else if (Array.isArray(formData[name])) {
			const newArray = value.split(",").map((item) => item.trim());

			setFormData((prevData) => ({
				...prevData,
				[name]: newArray,
			}));
		} else {
			const newValue = value;

			setFormData((prevData) => ({
				...prevData,
				[name]: newValue,
			}));
		}
	};

	const handleChangePassword = (e) => {
		const { name, value } = e.target;
		setPasswordFormChanged(true);
		setPasswordFormData((prevData) => ({
			...prevData,
			[name]: value,
		}));
	};
	useEffect(() => {
		console.log("activity types", activityTypes);
	}, []);

	const handleTagChange = (e) => {
		const value = e.target.value;

		if (value.includes(",") || e.key === "Enter") {
			e.preventDefault();

			const newTag = value.replace(/[\n,]/g, "").trim();
			if (newTag !== "") {
				setFormData((prevData) => ({
					...prevData,
					tags: [...prevData.tags, newTag],
				}));
				e.target.value = ""; // Clear the input
			}
		}
	};

	const handleRemoveTag = (index) => {
		const updatedTags = [...formData.tags];
		updatedTags.splice(index, 1);
		setFormData((prevData) => ({ ...prevData, tags: updatedTags }));
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const userRef = db.collection("Users").doc(user.uid);
			await userRef.update({
				name: formData.name ? formData.name : null,
				email: formData.email ? formData.email : null,
			});
			// Optionally, you can redirect the user or perform other actions after submission.
			Swal.fire({
				title: "Success!",
				text: "Updated User Information!",
				icon: "success",
				timer: 1000,
				timerProgressBar: true,
				showConfirmButton: false,
				allowOutsideClick: false,
			});
		} catch (error) {
			console.log("error", error);
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

	const handleSubmitPassword = async (e) => {
		e.preventDefault();
		try {
			if (passwordFormData.password != passwordFormData.password2) {
				throw "Passwords do not match";
			}
			const currUser = auth.currentUser;

			const credential = EmailAuthProvider.credential(
				user.email,
				passwordFormData.oldPassword
			);
			await reauthenticateWithCredential(currUser, credential).then(() =>
				console.log("success")
			);

			await updatePassword(currUser, passwordFormData.password);

			// Optionally, you can redirect the user or perform other actions after submission.
			Swal.fire({
				title: "Success!",
				text: "Updated User Information!",
				icon: "success",
				timer: 1000,
				timerProgressBar: true,
				showConfirmButton: false,
				allowOutsideClick: false,
			}).then((result) => {
				// Reload the Page
				location.reload();
			});
		} catch (error) {
			console.log("error", error);
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
		setPasswordFormData({
			oldPassword: null,
			password: null,
			password2: null,
		});
		setPasswordFormChanged(false);
	};

	const handleClick = (event) => {
		fileInput.current.click();
	};

	return (
		<Box style={{ maxWidth: "600px", margin: "80px auto" }}>
			<h1 style={{ textAlign: "center" }}>Edit Profile</h1>
			<button
				className={classes["image_input"]}
				onClick={handleClick}
				style={{ margin: "0 auto" }}
			>
				<GrEdit
					size={45}
					style={{
						position: "absolute",
						translate: "52px 52px",
						color: "white",
					}}
				/>
				{formData.image && (
					<Image
						style={{
							height: "100%",
							width: "100%",
							borderRadius: "8px",
							objectFit: "cover",
						}}
						src={formData.image}
						alt={""}
					/>
				)}

				<input
					type="file"
					accept="image/*"
					onChange={handleImageChange}
					ref={fileInput}
					style={{ display: "none" }}
					// className={classes["image_input"]}
					// style={styles.input}
				/>
			</button>

			<form onSubmit={handleSubmit}>
				<br />

				<br />
				<FormControl isRequired>
					<FormLabel>Name:</FormLabel>
					<Input
						type="text"
						name="name"
						value={formData.name}
						onChange={handleChange}
						placeholder="Name"
						variant="filled"
					/>
				</FormControl>

				<br />

				<FormControl isRequired>
					<FormLabel>Email:</FormLabel>
					<Input
						type="text"
						name="email"
						value={formData.email}
						onChange={handleChange}
						placeholder="Email"
						variant="filled"
					/>
				</FormControl>

				<br />
				<Button
					type="submit"
					colorScheme="red"
					variant={"outline"}
					style={{ width: "100%" }}
					isDisabled={!formChanged}
					//onClick={handleSubmit}
				>
					Submit
				</Button>
			</form>
			<br />
			<br />
			<Accordion allowToggle={true}>
				<AccordionItem>
					<h2>
						<AccordionButton>
							<Box as="span" flex="1" textAlign="left">
								Change Password
							</Box>
							<AccordionIcon />
						</AccordionButton>
					</h2>
					<AccordionPanel pb={4}>
						<form onSubmit={handleSubmitPassword}>
							<FormControl isRequired>
								<FormLabel>Old password:</FormLabel>
								<Input
									type="password"
									name="oldPassword"
									value={passwordFormData.oldPassword}
									onChange={handleChangePassword}
									placeholder="Password"
									variant="filled"
								/>
							</FormControl>
							<br />
							<FormControl isRequired>
								<FormLabel>New password:</FormLabel>
								<Input
									type="password"
									name="password"
									value={passwordFormData.password}
									onChange={handleChangePassword}
									placeholder="Password"
									variant="filled"
								/>
							</FormControl>
							<br />
							<FormControl isRequired>
								<FormLabel>Re-Enter new password:</FormLabel>
								<Input
									type="password"
									name="password2"
									value={passwordFormData.password2}
									onChange={handleChangePassword}
									placeholder="Password"
									variant="filled"
								/>
							</FormControl>
							<br />
							<Button
								type="submit"
								colorScheme="red"
								variant={"outline"}
								style={{ width: "100%" }}
								isDisabled={!passwordFormChanged}
							>
								Confirm
							</Button>
						</form>
					</AccordionPanel>
				</AccordionItem>
			</Accordion>
		</Box>
	);
};

export default withAuth(ProfileSettings);
