"use client";

import { useState, useEffect } from "react";
import {
	calcHrsGivenRange,
	generateCertificateByActivity,
	generateCertificateByTime,
} from "./helper";
import {
	Box,
	Image as ChakraImage,
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
	FormControl,
	FormLabel,
	Button,
	Input,
	Flex,
	Alert,
	Select,
} from "@chakra-ui/react";
import withAuth from "../../../hoc/withAuth";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import classes from "../request/page.module.css";

const RequestCertificatePage = ({ user }) => {
	const router = useRouter();
	const reqActivityId = useSearchParams().get("reqActivityId");
	const [selectedOption, setSelectedOption] = useState(
		reqActivityId ? "byActivity" : "byActivity"
	);
	const [selectedActivity, setSelectedActivity] = useState(
		reqActivityId
			? user.activities_attended.find(
					(activity) => activity.activity_id === reqActivityId
			  )
			: null
	);
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [pdfUrl, setPdfUrl] = useState(null);

	useEffect(() => {
		if (user.role !== "volunteer") {
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

	const handleSubmitActivity = async (e) => {
		e.preventDefault();
		console.log("Requesting Certificate:", {
			selectedOption,
			selectedActivity,
		});

		const generatedPdfUrl = await generatePdfActivity();
		setPdfUrl(generatedPdfUrl);
	};

	const generatePdfActivity = async () => {
		const pdfBytes = await generateCertificateByActivity(
			user.name,
			selectedActivity.activity_name,
			selectedActivity.activity_date,
			selectedActivity.activity_hours
		);
		const previewBlob = new Blob([pdfBytes], { type: "application/pdf" });
		const previewUrl = URL.createObjectURL(previewBlob);
		return previewUrl;
	};

	const handleSubmitTime = async (e) => {
		e.preventDefault();
		console.log("Requesting Certificate:", {
			selectedOption,
			startDate,
			endDate,
		});

		const generatedPdfUrl = await generatePdfTime();
		setPdfUrl(generatedPdfUrl);
	};

	const generatePdfTime = async () => {
		const hours = calcHrsGivenRange(
			user.activities_attended,
			startDate,
			endDate
		);
		const pdfBytes = await generateCertificateByTime(
			user.name,
			startDate,
			endDate,
			hours
		);
		const previewBlob = new Blob([pdfBytes], { type: "application/pdf" });
		const previewUrl = URL.createObjectURL(previewBlob);
		return previewUrl;
	};

	return user.role === "volunteer" ? (
		<div style={{ width: "80%", margin: "0 auto" }}>
			<br />
			<h1 style={{ fontSize: "30px", textAlign: "center" }}>
				Request Certificate
			</h1>
			<br />
			<div className={classes["main-selection-bar"]}>
				<div
					className={
						selectedOption === "byActivity"
							? `${classes["main-option-selected"]}`
							: `${classes["main-option-unselected"]}`
					}
					onClick={() => setSelectedOption("byActivity")}
				>
					By Activity
				</div>
				<div
					className={
						selectedOption === "byDateRange"
							? `${classes["main-option-selected"]}`
							: `${classes["main-option-unselected"]}`
					}
					onClick={() => setSelectedOption("byDateRange")}
				>
					By Date Range
				</div>
			</div>
			<br />

			{/* <form style={styles.form}>
				<label style={styles.radioLabel}>
					<input
						type="radio"
						value="byActivity"
						checked={selectedOption === "byActivity"}
						onChange={() => setSelectedOption("byActivity")}
					/>
					By Activity
				</label>

				<label>
					<input
						type="radio"
						value="byDateRange"
						checked={selectedOption === "byDateRange"}
						onChange={() => setSelectedOption("byDateRange")}
					/>
					By Date Range
				</label>
			</form> */}
			<Box
				style={{
					backgroundColor: "rgb(255,255,255,0.6)",
					borderRadius: "20px",
					padding: "1rem",
				}}
			>
				{selectedOption === "byActivity" && (
					<section>
						<form onSubmit={handleSubmitActivity}>
							<FormControl isRequired>
								<FormLabel>Select Activity:</FormLabel>
								<Select
									value={
										selectedActivity
											? selectedActivity.activity_id
											: ""
									}
									onChange={(e) => {
										const selectedActivityId =
											e.target.value;
										const selectedActivityObject =
											user.activities_attended.find(
												(activity) =>
													activity.activity_id ===
													selectedActivityId
											);
										setSelectedActivity(
											selectedActivityObject
										);
									}}
									style={styles.input}
								>
									<option value="">Select Activity</option>
									{user.activities_attended.map(
										(activity) => (
											<option
												key={activity.activity_id}
												value={activity.activity_id}
											>
												{activity.activity_name}
											</option>
										)
									)}
								</Select>
							</FormControl>
							<br />
							<Flex justify={"center"}>
								<Button
									type="submit"
									colorScheme={"teal"}
									variant="outline"
									style={{
										borderRadius: "100px",
										padding: "0 20px",
									}}
								>
									Request Certificate
								</Button>
							</Flex>
						</form>
					</section>
				)}

				{selectedOption === "byDateRange" && (
					<section>
						<form onSubmit={handleSubmitTime}>
							<FormControl isRequired>
								<FormLabel>Start Date:</FormLabel>
								<Input
									type="date"
									value={startDate}
									onChange={(e) =>
										setStartDate(e.target.value)
									}
									style={styles.input}
									required
								/>
							</FormControl>
							<br />
							<FormControl isRequired>
								<FormLabel>End Date:</FormLabel>
								<Input
									type="date"
									alue={endDate}
									onChange={(e) => setEndDate(e.target.value)}
									style={styles.input}
									required
								/>
							</FormControl>
							<br />

							<Flex justify={"center"}>
								<Button
									type="submit"
									colorScheme={"teal"}
									variant="outline"
									style={{
										borderRadius: "100px",
										padding: "0 20px",
									}}
								>
									Request Certificate
								</Button>
							</Flex>
						</form>
					</section>
				)}
			</Box>
			<br />
			{/* PDF Preview */}
			{pdfUrl && (
				<embed
					src={pdfUrl}
					type="application/pdf"
					width="100%"
					height="600px"
				/>
			)}
		</div>
	) : null;
};

const styles = {
	container: {
		fontFamily: "Arial, sans-serif",
		maxWidth: "800px",
		margin: "auto",
		padding: "20px",
	},
	heading: {
		textAlign: "center",
	},
	form: {
		marginBottom: "20px",
	},
	radioLabel: {
		marginRight: "20px",
	},
	section: {
		background: "#f5f5f5",
		padding: "15px",
		borderRadius: "5px",
		marginBottom: "20px",
	},
	sectionHeading: {
		color: "#333",
		marginBottom: "10px",
	},
	inputBlock: {
		display: "block",
		marginBottom: "10px",
	},
	input: {
		marginLeft: "10px",
	},
	button: {
		background: "#4caf50",
		color: "white",
		padding: "10px",
		border: "none",
		cursor: "pointer",
	},
	pdfPreview: {
		marginTop: "20px",
	},
};

export default withAuth(RequestCertificatePage);
