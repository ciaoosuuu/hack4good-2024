"use client";

import { useEffect, useState } from "react";
import { arrayUnion, arrayRemove } from "firebase/firestore";
import {
	Button,
	Box,
	Grid,
	GridItem,
	Image,
	Text,
	Stack,
	Badge,
	Flex,
	Spacer,
	Icon,
} from "@chakra-ui/react";
import { db } from "../../firebase/config";
import calculateUserExp from "../../utils/calculateUserExp";
import { Roboto_Slab } from "next/font/google";
import { TiClipboard } from "react-icons/ti";

const roboto_slab = Roboto_Slab({
	weight: ["400", "700"],
	subsets: ["latin"],
	display: "swap",
});

const Attendance = ({ userRole, classes, activity, activityId }) => {
	if (userRole !== "admin") {
		return null;
	}

	console.log(activity);

	const signups = activity.participants_signups;
	const [attendees, setAttendees] = useState([]);
	const [marked, setMarked] = useState(activity.participants_attended);

	const activityInformation = {
		activity_id: activityId,
		activity_name: activity.activity_name,
		activity_hours: activity.activity_hours,
		activity_date: activity.datetime_start,
		activity_type: activity.activity_type,
	};

	useEffect(() => {
		const fetchSignups = async () => {
			if (!signups || !Array.isArray(signups)) {
				return;
			}
			const promises = signups.map(async (userID) => {
				try {
					const userDoc = await db
						.collection("Users")
						.doc(userID)
						.get();
					if (userDoc.exists) {
						// Access user details from the document data
						return { id: userID, ...userDoc.data() };
					} else {
						console.log(`User with ID ${userID} not found`);
						return null;
					}
				} catch (error) {
					console.error(
						`Error fetching user details for ${userID}:`,
						error
					);
					return null;
				}
			});

			const userResults = await Promise.all(promises);
			setAttendees(userResults.filter(Boolean));
		};

		fetchSignups();
		console.log(activityId);
	}, [signups, activityId]);

	const handleMark = async (attendeeId) => {
		try {
			const activityRef = db.collection("Activities").doc(activityId);
			await activityRef.update({
				participants_attended: arrayUnion(attendeeId),
			});

			const attendeeRef = db.collection("Users").doc(attendeeId);
			await attendeeRef
				.update({
					activities_attended: arrayUnion(activityInformation),
				})
				.then(async () => {
					const attendeeSnapshot = await attendeeRef.get();
					const attendee = attendeeSnapshot.data();
					const newExp = await calculateUserExp(attendee);
					return attendeeRef.update({
						exp_points: newExp,
					});
				});

			setMarked((prevMarked) => [...prevMarked, attendeeId]);

			console.log(
				`Attendance submitted successfully for user ${attendeeId}!`
			);
		} catch (error) {
			console.error("Error updating field:", error);
		}
	};

	const handleUnmark = async (attendeeId) => {
		try {
			const activityRef = db.collection("Activities").doc(activityId);
			await activityRef.update({
				participants_attended: arrayRemove(attendeeId),
			});

			const attendeeRef = db.collection("Users").doc(attendeeId);
			await attendeeRef
				.update({
					activities_attended: arrayRemove(activityInformation),
				})
				.then(async () => {
					const attendeeSnapshot = await attendeeRef.get();
					const attendee = attendeeSnapshot.data();
					const newExp = await calculateUserExp(attendee);
					return attendeeRef.update({
						exp_points: newExp,
					});
				});

			setMarked((prevMarked) =>
				prevMarked.filter((id) => id !== attendeeId)
			);

			console.log(
				`Unmarked attendance successfully for user ${attendeeId}!`
			);
		} catch (error) {
			console.error("Error updating field:", error);
		}
	};

	return (
		<div
			className={classes["postform"]}
			style={{ width: "80%", margin: "0 auto" }}
		>
			<h1
				style={{
					display: "flex",
					alignItems: "center",
				}}
			>
				{" "}
				<TiClipboard style={{ marginRight: "8px" }} />
				Attendance
			</h1>
			<br />
			{/* <ul className={classes["grid_list"]}> */}
			{attendees &&
				attendees
					.slice()
					.sort((a, b) => a.name.localeCompare(b.name))
					.map((attendee, index) => (
						<Flex
							key={attendee.id}
							className={classes["attendance-item"]}
							align={"center"}
						>
							<div
								style={{
									display: "flex",
									justifyContent: "space-between",
								}}
							>
								<div className={classes["index"]}>
									<p className={roboto_slab.className}>
										{index + 1}
									</p>
								</div>
								{/* <div className={classes["profilepic"]}> */}
								<img
									className={classes["profilepicimg"]}
									src={attendee.image}
									alt="Profile"
								/>
								{/* </div> */}
								<div className={classes["details"]}>
									<h1>{attendee.name}</h1>
									<p>{attendee.email}</p>
									<p>{attendee.contact}</p>
								</div>
							</div>
							<Spacer />
							<div className={classes["markattendance"]}>
								{marked.includes(attendee.id) ? (
									<button
										className={classes["marked"]}
										onClick={() =>
											handleUnmark(attendee.id)
										}
									>
										Unmark Attendance
									</button>
								) : (
									<button
										className={classes["unmarked"]}
										onClick={() => handleMark(attendee.id)}
									>
										Mark As Attended
									</button>
								)}
							</div>
						</Flex>
					))}
			{/* </ul> */}
			{/* <div className={classes["submitattendance"]}>
        <button onClick={handleSubmit}>Submit Attendance</button>
      </div> */}
		</div>
	);
};

export default Attendance;
