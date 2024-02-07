"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	Textarea,
	Flex,
	Spacer,
	Stepper,
	Step,
	StepIndicator,
	StepStatus,
	StepTitle,
	StepDescription,
	StepSeparator,
	StepIcon,
	StepNumber,
} from "@chakra-ui/react";
import { Select } from "chakra-react-select";
import { FiArrowLeft } from "react-icons/fi";
import withAuth from "../../../hoc/withAuth";
import { db } from "../../../firebase/config";
import Swal from "sweetalert2";
import {
	skills,
	interests,
	capitalise,
} from "../../../resources/skills-interests";
import classes from "../page.module.css";
import { Timestamp } from "firebase/firestore";

const formatDateForInput = (timestamp) => {
	if (!timestamp) return "";

	const date = timestamp.toDate();
	const year = date.getFullYear();
	const month = `0${date.getMonth() + 1}`.slice(-2);
	const day = `0${date.getDate()}`.slice(-2);
	return `${year}-${month}-${day}`;
};

const VolunteerPreferences = ({ stepIndex, user }) => {
	const router = useRouter();
	const [interestAreas, setInterestAreas] = useState(
		interests.map((interest) => {
			return {
				key: interest,
				value: interest,
				label: capitalise(interest),
			};
		})
	);
	const [skillsOptions, setSkillsOptions] = useState(
		skills.map((skill) => {
			return {
				key: skill,
				value: skill,
				label: capitalise(skill),
			};
		})
	);
	const [step1ChangesMade, setStep1ChangesMade] = useState(false);
	const [step2ChangesMade, setStep2ChangesMade] = useState(false);
	const [form1Data, setForm1Data] = useState({
		dateOfBirth: user.dateOfBirth ? user.dateOfBirth : null,
		description: user.description ? user.description : null,
	});
	const [form2Data, setForm2Data] = useState({
		languages: user.preferences?.languages
			? user.preferences.languages
			: null,
		experience: user.preferences?.experience
			? user.preferences.experience
			: null,
		skills: user.preferences?.skills ? user.preferences.skills : [],
		interestAreas: user.preferences?.interestAreas
			? user.preferences.interestAreas
			: [],
	});

	useEffect(() => {
		console.log("user", user);
		console.log("interests", form2Data.interestAreas);
	}, [user]);

	const steps = [
		{ title: "About you", description: "User Profile", count: "1" },
		{
			title: "Skills, Interests",
			description: "Volunteering Preferences",
			count: "2",
		},
	];

	const [activeStep, setActiveStep] = useState(stepIndex ? stepIndex : 1);

	const handleChangeStep1 = (e) => {
		setStep1ChangesMade(true);
		const { name, value } = e.target;
		if (name.includes("dateOfBirth")) {
			const timestampDate = value
				? Timestamp.fromDate(new Date(value))
				: null;
			setForm1Data((prevData) => ({
				...prevData,
				[name]: timestampDate,
			}));
		} else {
			setForm1Data((prevData) => ({
				...prevData,
				[name]: value,
			}));
		}
	};
	const handleChangeStep2 = (e) => {
		setStep2ChangesMade(true);
		const { name, value } = e.target;
		setForm2Data((prevData) => ({
			...prevData,
			[name]: value,
		}));
		// }
	};

	const handleSubmitStep1 = async (e) => {
		e.preventDefault();
		try {
			const userRef = db.collection("Users").doc(user.uid);
			await userRef.update({
				dateOfBirth: form1Data.dateOfBirth
					? form1Data.dateOfBirth
					: null,
				description: form1Data.description
					? form1Data.description
					: null,
			});
			// Optionally, you can redirect the user or perform other actions after submission.
			Swal.fire({
				title: "Success!",
				text: "Submitted Volunteer information",
				icon: "success",
				timer: 1000,
				timerProgressBar: true,
				showConfirmButton: false,
				allowOutsideClick: false,
			}).then(setActiveStep(2));
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

	const handleSubmitStep2 = async (e) => {
		e.preventDefault();
		console.log("submitting", form2Data);
		try {
			const userRef = db.collection("Users").doc(user.uid);
			await userRef.update({
				preferences: {
					...user.preferences,
					languages: form2Data.languages ? form2Data.languages : null,
					experience: form2Data.experience
						? form2Data.experience
						: null,
					interestAreas: form2Data.interestAreas
						? form2Data.interestAreas
						: null,
					skills: form2Data.skills ? form2Data.skills : null,
				},
			});
			// Optionally, you can redirect the user or perform other actions after submission.
			Swal.fire({
				title: "Success!",
				text: "Redirecting to Activities...",
				icon: "success",
				timer: 1000,
				timerProgressBar: true,
				showConfirmButton: false,
				allowOutsideClick: false,
			}).then(router.push("/activities"));
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

	return (
		<div
			style={{
				width: "80%",
				margin: "80px auto",
			}}
		>
			<Box
				style={{ width: "220px" }}
				className={classes["profile-button-dark"]}
				onClick={() => router.push("/profile")}
			>
				<FiArrowLeft style={{ marginRight: "16px" }} />
				Return to Profile
			</Box>
			<br />
			<br />
			<h1 style={{ fontSize: "24px" }}>Volunteer Preferences</h1>
			<br />
			{activeStep !== null && (
				<>
					<Stepper index={activeStep} colorScheme={"red"}>
						{steps.map((step, index) => (
							<Step key={index}>
								<StepIndicator>
									<StepStatus
										complete={<StepIcon />}
										incomplete={<StepNumber />}
										active={<StepNumber />}
									/>
								</StepIndicator>

								<Box flexShrink="0">
									<StepTitle>{step.title}</StepTitle>
									<StepDescription>
										{step.description}
									</StepDescription>
								</Box>

								<StepSeparator
									style={{ backgroundColor: "black" }}
								/>
							</Step>
						))}
					</Stepper>
					<br />
					{activeStep === 1 ? (
						<>
							<FormControl
								isRequired
								style={{ marginBottom: "8px" }}
							>
								<FormLabel>Date of Birth:</FormLabel>
								<Input
									type="date"
									variant={"filled"}
									name="dateOfBirth"
									value={formatDateForInput(form1Data.dateOfBirth)}
									onChange={handleChangeStep1}
								></Input>
							</FormControl>
							<FormControl style={{ marginBottom: "8px" }}>
								<FormLabel>
									Short Description: (Optional)
								</FormLabel>
								<Textarea
									variant={"filled"}
									name="description"
									value={form1Data.description}
									onChange={handleChangeStep1}
								></Textarea>
							</FormControl>
						</>
					) : (
						<>
							<Flex style={{ marginBottom: "8px" }} gap={6}>
								{/* <FormControl>
									<FormLabel>
										Language Proficiencies:
									</FormLabel>
									<Input
										type="text"
										variant={"filled"}
										name="languages"
										value={form2Data.languages}
										onChange={handleChangeStep2}
									></Input>
								</FormControl> */}
								<FormControl>
									<FormLabel>Technical Skills:</FormLabel>
									{skillsOptions && (
										<Select
											isMulti
											value={form2Data.skills.map(
												(skill) => {
													return {
														value: skill,
														label: capitalise(
															skill
														),
													};
												}
											)}
											options={skillsOptions}
											variant="filled"
											tagVariant="solid"
											onChange={(
												selectedSkillsOptions
											) => {
												setStep2ChangesMade(true);
												setForm2Data((form2Data) => {
													const newSkills =
														selectedSkillsOptions.map(
															(skillsOption) =>
																skillsOption.value
														);
													return {
														...form2Data,
														skills: newSkills,
													};
												});
											}}
										/>
									)}
								</FormControl>
								<FormControl>
									<FormLabel>
										Volunteering Interest Areas:
									</FormLabel>
									{interestAreas &&
										form2Data.interestAreas && (
											<Select
												isMulti
												value={form2Data.interestAreas.map(
													(interestArea) => {
														return {
															value: interestArea,
															label: capitalise(
																interestArea
															),
														};
													}
												)}
												options={interestAreas}
												variant="filled"
												tagVariant="solid"
												onChange={(
													selectedInterestAreas
												) =>
													setForm2Data(
														(form2Data) => {
															setStep2ChangesMade(
																true
															);
															const newInterestAreas =
																selectedInterestAreas.map(
																	(
																		interestArea
																	) =>
																		interestArea.value
																);
															return {
																...form2Data,
																interestAreas:
																	newInterestAreas,
															};
														}
													)
												}
											/>
										)}
								</FormControl>
							</Flex>
							<FormControl style={{ marginBottom: "8px" }}>
								<FormLabel>Volunteering Experience:</FormLabel>
								<Textarea
									type="text"
									variant={"filled"}
									name="experience"
									value={form2Data.experience}
									onChange={handleChangeStep2}
								/>
							</FormControl>
							<FormControl>
								<FormLabel>Languages:</FormLabel>
								<Input
									type="text"
									variant={"filled"}
									name="languages"
									value={form2Data.languages}
									onChange={handleChangeStep2}
								></Input>
							</FormControl>
						</>
					)}
				</>
			)}
			<br />
			<Box
				style={{
					// position: "fixed",
					bottom: "80px",
					margin: "0 auto",
					// width: "80%",
				}}
			>
				<Flex justify={"space-between"}>
					{activeStep === 1 ? (
						<>
							<Spacer />

							<Button
								style={{ marginRight: "8px" }}
								onClick={() => setActiveStep(2)}
							>
								Skip
							</Button>
							{user.dateOfBirth || user.description ? (
								<Button
									colorScheme={"red"}
									onClick={handleSubmitStep1}
									isDisabled={!step1ChangesMade}
								>
									Apply Changes
								</Button>
							) : (
								<Button
									colorScheme={"red"}
									onClick={handleSubmitStep1}
								>
									Submit
								</Button>
							)}
						</>
					) : (
						<>
							<Button onClick={() => setActiveStep(1)}>
								Back
							</Button>
							<p>
								<Button
									onClick={() => router.push("/activities")}
									style={{ marginRight: "8px" }}
								>
									Skip
								</Button>
								<Button
									colorScheme={"red"}
									onClick={handleSubmitStep2}
									isDisabled={!step2ChangesMade}
								>
									Submit
								</Button>
							</p>
						</>
					)}
				</Flex>
			</Box>
		</div>
	);
};

export default withAuth(VolunteerPreferences);
