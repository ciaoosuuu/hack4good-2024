"use client";

import { useState, useEffect } from "react";

import { Flex, Spacer, Box } from "@chakra-ui/react";
import PastYearActivities from "../../components/reports/PastYearActivities";
import PastYearAttendees from "../../components/reports/PastYearAttendees";
import RegionActivities from "../../components/reports/RegionActivities";
import RegionAttendance from "../../components/reports/RegionAttendance";
import CauseActivities from "../../components/reports/CauseActivities";
import CauseAttendance from "../../components/reports/CauseAttendance";
import TypeActivities from "../../components/reports/TypeActivities";
import TypeAttendance from "../../components/reports/TypeAttendance";
import PastYearUsers from "../../components/reports/PastYearUsers";
import LanguagesUsers from "../../components/reports/LanguagesUsers"
import getTotalUserCount from "../../utils/reports/getTotalUserCount";
import getTotalActivityCount from "../../utils/reports/getTotalActivityCount";
import getTotalVolunteerHours from "../../utils/reports/getTotalVolunteerHours";


import { Roboto_Slab } from "next/font/google";

import classes from "./page.module.css";

const roboto_slab = Roboto_Slab({
	weight: ["700"],
	subsets: ["latin"],
	display: "swap",
});

const Reports = () => {
	const [selectedView, setSelectedView] = useState("Volunteers");

	const [totalUserCount, setTotalUserCount] = useState(0);
	const [totalVolunteerHours, setTotalVolunteerHours] = useState(0);
	const [totalActivityCount, setTotalActivityCount] = useState(0);

	useEffect(() => {
		setTotalUserCount(getTotalUserCount());
		setTotalVolunteerHours(getTotalVolunteerHours());
		setTotalActivityCount(getTotalActivityCount());
	}, []);

	const chartStyleLeft = {
		marginTop: "10px",
		marginBottom: "10px",
		marginRight: "10px",
		padding: "10px",
		backgroundColor: "white",
		borderRadius: "10px",
	};

	const chartStyleRight = {
		marginTop: "10px",
		marginBottom: "10px",
		padding: "10px",
		backgroundColor: "white",
		borderRadius: "10px",
	};

	return (
		<div
			style={{
				marginLeft: "10%",
				marginRight: "10%",
				marginTop: "2%",
				marginBottom: "2%",
				minWidth: "1000px",
			}}
		>
			<h1 style={{ fontSize: "30px" }} className={roboto_slab.className}>
				Reports
			</h1>
			<div className={classes["selection-bar"]}>
				<div
					className={
						selectedView === "Volunteers"
							? `${classes["option-selected"]}`
							: `${classes["option-unselected"]}`
					}
					onClick={() => setSelectedView("Volunteers")}
				>
					Volunteers
				</div>
				<div
					className={
						selectedView === "Activities"
							? `${classes["option-selected"]}`
							: `${classes["option-unselected"]}`
					}
					onClick={() => setSelectedView("Activities")}
				>
					Activities
				</div>
			</div>
			{selectedView === "Volunteers" && (
				<div style={{ display: "flex" }}>
					<div style={{ flex: "70%" }}>
						<div style={chartStyleLeft}>
							<PastYearUsers />
						</div>
						<div style={chartStyleLeft}>
							<PastYearAttendees />
						</div>
						<div style={chartStyleLeft}>
							<CauseAttendance />
						</div>
					</div>
					<div style={{ flex: "30%" }}>
						<div
							style={{
								marginTop: "10px",
								marginBottom: "10px",
								padding: "20px 10px 10px 10px",
								backgroundColor: "white",
								borderRadius: "10px",
								height: "140px",
							}}
						>
							<Flex>
								<Spacer />
								<Box
									style={{
										textAlign: "center",
										width: "40%",
									}}
								>
									<h1
										className={roboto_slab.className}
										style={{
											fontSize: "xx-large",
											color: "maroon",
										}}
									>
										{totalUserCount}
									</h1>
									<h1> Total Volunteers</h1>
								</Box>
								<Spacer />
								<Box
									style={{
										textAlign: "center",
										width: "40%",
									}}
								>
									<h1
										className={roboto_slab.className}
										style={{
											fontSize: "xx-large",
											color: "maroon",
										}}
									>
										{totalVolunteerHours}
									</h1>
									<h1> Total Volunteer Hours</h1>
								</Box>
								<Spacer />
							</Flex>
						</div>
						<div style={chartStyleRight}>
							<LanguagesUsers />
						</div>
						<div style={chartStyleRight}>
							<RegionAttendance />
						</div>
						<div style={chartStyleRight}>
							<TypeAttendance />
						</div>
					</div>
				</div>
			)}
			{selectedView === "Activities" && (
				<div style={{ display: "flex" }}>
					<div style={{ flex: "70%" }}>
						<div style={chartStyleLeft}>
							<PastYearActivities />
						</div>
						<div style={chartStyleLeft}>
							<CauseActivities />
						</div>
					</div>
					<div style={{ flex: "30%" }}>
						<div
							style={{
								marginTop: "10px",
								marginBottom: "10px",
								padding: "10px",
								backgroundColor: "white",
								borderRadius: "10px",
								height: "110px",
							}}
						>
							<Flex>
								<Spacer />
								<Box
									style={{
										textAlign: "center",
									}}
								>
									<h1
										className={roboto_slab.className}
										style={{
											fontSize: "xx-large",
											color: "maroon",
										}}
									>
										{totalActivityCount}
									</h1>
									<h1> Total Number of Activities</h1>
								</Box>
								<Spacer />
							</Flex>
						</div>
						<div style={chartStyleRight}>
							<RegionActivities />
						</div>
						<div style={chartStyleRight}>
							<TypeActivities />
						</div>
					</div>
				</div>
			)}
		</div>
	);
};

export default Reports;
