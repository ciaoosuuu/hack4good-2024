"use client";

import { useState, useEffect } from "react";
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
	Select,
	Textarea,
	FormHelperText,
	FormErrorMessage,
} from "@chakra-ui/react";
import { Select as MultiSelect } from "chakra-react-select";
import {
	activityTypes as activityTypesData,
	capitalise,
	interests,
	skills,
} from "../../../resources/skills-interests";

import { Roboto_Slab } from "next/font/google";
const roboto_slab = Roboto_Slab({
	weight: ["400", "700"],
	subsets: ["latin"],
	display: "swap",
});

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

const CreateActivity = ({ user }) => {
	const router = useRouter();
	const [defaultImageUrl, setDefaultImageUrl] = useState("");

	useEffect(() => {
		const fetchActivities = async () => {
			try {
				const imageRef = projectStorage.ref(
					"General/default_activity_pic.png"
				);
				const defaultImage = await imageRef.getDownloadURL();
				setDefaultImageUrl(defaultImage);
			} catch (error) {
				console.error("Error fetching activities:", error);
			}
		};
		fetchActivities();
	}, []);

	useEffect(() => {
		if (user.role !== "admin") {
			Swal.fire({
				title: "Unauthorized Access!",
				text: "Redirecting ...",
				icon: "warning",
				timer: 1000,
				timerProgressBar: true,
				showConfirmButton: false,
				allowOutsideClick: false,
			}).then(() => {
				setTimeout(() => {
					router.push("/activities");
				}, 500);
			});
		}
	}, [user.role]);

	const [activityTypes, setActivityTypes] = useState(activityTypesData);
	const [tagOptions, setTagOptions] = useState(
		[...interests, ...skills].map((tag) => {
			return { key: tag, label: capitalise(tag), value: tag };
		})
	);
	const [formData, setFormData] = useState({
		datetime_start: null,
		datetime_end: null,
		description: "",
		image: "",
		location_address: "",
		location_name: "",
		location_postal: "",
		activity_name: "",
		activity_type: "",
		activity_hours: 0,
		organiser_id: "",
		organiser_name: "",
		participants_attended: [],
		participants_signups: [],
		tags: [],
		vacancy_total: 0,
		created_on: null,
	});
	const [formErrors, setFormErrors] = useState({
		datetime_end: false,
		signup_deadline: false,
		//set deadline error here
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
			const imageRef = storageRef.child(`Activities/${file.name}`);
			await imageRef.put(file);
			const imageUrl = await imageRef.getDownloadURL();

			setFormData((prevData) => ({
				...prevData,
				image: imageUrl,
			}));
		}
	};

	const handleChange = (e) => {
		const { name, value } = e.target;

		if (name.includes("datetime") || name.includes("deadline")) {
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
		} else if (name === "location_postal") {
			const newValue = value.replace(/\D/g, "").slice(0, 6);
			setFormData((prevData) => ({
				...prevData,
				location_postal: newValue,
			}));
		} else {
			const newValue =
				name === "vacancy_total" || name === "activity_hours"
					? parseFloat(value)
					: value;

			setFormData((prevData) => ({
				...prevData,
				[name]: newValue,
			}));
		}
	};

	useEffect(() => {
		console.log("activity types", activityTypes);
	}, []);

	const handleSubmit = async (e) => {
		e.preventDefault();

		// if (formData.datetime_start >= formData.datetime_end) {
		// 	setFormErrors((formErrors) => {
		// 		return {
		// 			...formErrors,
		// 			datetime_end: true,
		// 		};
		// 	});
		// 	return;
		// }
		// if (formData.signup_deadline < new Date().toISOString().split("T")[0]) {
		// 	setFormErrors((formErrors) => {
		// 		return {
		// 			...formErrors,
		// 			signup_deadline: true,
		// 		};
		// 	});
		// 	return;
		// }

		try {
			const updatedFormData = {
				...formData,
				vacancy_total: parseInt(formData.vacancy_total, 10),
				image: formData.image ? formData.image : defaultImageUrl,
				organiser_id: user.uid,
				created_on: Timestamp.fromDate(new Date()),
			};

			setFormData(updatedFormData);
			let res = await db.collection("Activities").add(updatedFormData);
			console.log("Activity added successfully!");
			console.log(res.id);
			const userRef = db.collection("Users").doc(user.uid);
			await userRef.update({
				activities_created: arrayUnion(res.id),
			});
			Swal.fire({
				title: "Success!",
				text: "Activity successfully created!",
				icon: "success",
				timer: 1000,
				timerProgressBar: true,
				showConfirmButton: false,
				allowOutsideClick: false,
			});
			setTimeout(function () {
				router.push("/");
			}, 1000);
		} catch (error) {
			console.log(error);
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

	return user.role === "admin" ? (
		<Box style={{ maxWidth: "600px", margin: "70px auto" }}>
			<h1
				style={{ textAlign: "center" }}
				className={roboto_slab.className}
			>
				Create new Activity
			</h1>
			<br />
			<form onSubmit={handleSubmit}>
				<FormControl isRequired>
					<FormLabel>Name:</FormLabel>
					<Input
						type="text"
						name="activity_name"
						value={formData.activity_name}
						onChange={handleChange}
						placeholder="Name"
						variant="filled"
					/>
				</FormControl>

				<br />
				<FormControl isRequired>
					<FormLabel>Activity Type:</FormLabel>
					{activityTypes && (
						<Select
							name="activity_type"
							value={formData.activity_type}
							onChange={handleChange}
							placeholder="Activity Type"
							variant="filled"
						>
							<option value="Volunteering">Volunteering</option>
							<option value="Training">Training</option>
							<option value="Workshop">Workshop</option>
						</Select>
					)}
				</FormControl>
				<br />
				<FormControl isRequired>
					<FormLabel>Description:</FormLabel>
					<Textarea
						variant={"filled"}
						name="description"
						value={formData.description}
						onChange={handleChange}
					></Textarea>
				</FormControl>
				<br />
				<FormControl>
					<FormLabel>Image:</FormLabel>
					<input
						type="file"
						accept="image/*"
						onChange={handleImageChange}
						style={styles.input}
					/>
				</FormControl>
				<br />
				<FormControl isRequired>
					<FormLabel>Location Name:</FormLabel>
					<Input
						type="text"
						name="location_name"
						value={formData.location_name}
						onChange={handleChange}
						placeholder="Location Name"
						variant="filled"
					/>
				</FormControl>
				<br />
				<FormControl isRequired>
					<FormLabel>Location Address:</FormLabel>
					<Input
						type="text"
						name="location_address"
						value={formData.location_address}
						onChange={handleChange}
						placeholder="Location Address"
						variant="filled"
					/>
				</FormControl>
				<br />
				<FormControl isRequired>
					<FormLabel>Postal code:</FormLabel>
					<Input
						type="text"
						name="location_postal"
						value={formData.location_postal}
						onChange={handleChange}
						placeholder="Location Postal Code"
						variant="filled"
					/>
				</FormControl>
				<br />
				<FormControl isRequired>
					<FormLabel>Organiser Name:</FormLabel>
					<Input
						type="text"
						name="organiser_name"
						value={formData.organiser_name}
						onChange={handleChange}
						placeholder="Organiser Name"
						variant="filled"
					/>
				</FormControl>
				<br />

				<FormControl>
					<FormLabel>Tags:</FormLabel>
					<MultiSelect
						isMulti
						value={formData.tags.map((tag) => {
							return {
								key: tag,
								value: tag,
								label: capitalise(tag),
							};
						})}
						options={tagOptions}
						variant="filled"
						tagVariant="solid"
						onChange={(selectedTags) => {
							setFormData((formData) => {
								const newTags = selectedTags.map(
									(selectedTag) => selectedTag.value
								);
								return {
									...formData,
									tags: newTags,
								};
							});
						}}
					/>
				</FormControl>
				<br />
				<FormControl isRequired>
					<FormLabel>Vacancy Total:</FormLabel>
					<Input
						type="number"
						name="vacancy_total"
						value={formData.vacancy_total}
						onChange={handleChange}
						placeholder="Vacancy Total"
						variant="filled"
					/>
				</FormControl>
				<br />

				<FormControl isRequired isInvalid={formErrors.datetime_end}>
					<FormLabel>Start Date and Time:</FormLabel>
					<Input
						type="datetime-local"
						name="datetime_start"
						value={formatDateForInput(formData.datetime_start)}
						onChange={handleChange}
						variant="filled"
					/>
				</FormControl>
				<br />
				<FormControl isRequired isInvalid={formErrors.datetime_end}>
					<FormLabel>End Date and Time:</FormLabel>
					<Input
						type="datetime-local"
						name="datetime_end"
						value={formatDateForInput(formData.datetime_end)}
						onChange={handleChange}
						variant="filled"
					/>
					{formErrors.datetime_end ? (
						<FormErrorMessage>
							End date and time must be after the start date and
							time.
						</FormErrorMessage>
					) : (
						<FormHelperText>
							End date and time must be after the start date and
							time.
						</FormHelperText>
					)}
				</FormControl>
				<br />
				<FormControl isRequired>
					<FormLabel>Total Activity Hours:</FormLabel>
					<Input
						type="number"
						name="activity_hours"
						value={formData.activity_hours}
						onChange={handleChange}
						placeholder="Activity Hours"
						variant="filled"
					/>
				</FormControl>
				<br />
				<FormControl isRequired isInvalid={formErrors.signup_deadline}>
					<FormLabel>Sign Up Deadline:</FormLabel>
					<Input
						type="datetime-local"
						name="signup_deadline"
						value={formatDateForInput(formData.signup_deadline)}
						onChange={handleChange}
						variant="filled"
						// min={new Date().toISOString().split("T")[0]}
					/>
					{formErrors.signup_deadline ? (
						<FormErrorMessage>
							Deadline must be after today.
						</FormErrorMessage>
					) : (
						<FormHelperText>
							Deadline must be after today.
						</FormHelperText>
					)}
				</FormControl>
				<br />
				<Button
					type="submit"
					colorScheme="red"
					variant={"outline"}
					style={{ width: "100%" }}
				>
					Submit
				</Button>
			</form>
		</Box>
	) : null;
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

export default withAuth(CreateActivity);
