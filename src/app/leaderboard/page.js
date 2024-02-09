"use client";

import { useState, useEffect } from "react";
import { db } from "../../firebase/config";
import withAuth from "../../hoc/withAuth";
import { Box, Flex, Stack, Spacer, Divider } from "@chakra-ui/react";
import getUserLevel from "../../utils/gamify/getUserLevel";
import badges from "../../utils/gamify/badges";
import { RiVipCrown2Fill } from "react-icons/ri";
import Image from "next/image";
import classes from "./page.module.css";

import { Roboto_Slab } from "next/font/google";
const roboto_slab = Roboto_Slab({
	weight: ["400", "700"],
	subsets: ["latin"],
	display: "swap",
});

const Leaderboard = () => {
	const [topUsers, setTopUsers] = useState([]);

	useEffect(() => {
		const fetchTopUsers = async () => {
			try {
				const usersSnapshot = await db.collection("Users").get();

				const topUsersData = usersSnapshot.docs.map((doc) =>
					doc.data()
				);

				setTopUsers(topUsersData);

				console.log(topUsersData);
			} catch (error) {
				console.error("Error fetching activities:", error);
			}
		};

		fetchTopUsers();
	}, []);

	return (
		<div
			style={{
				marginLeft: "10%",
				marginRight: "10%",
				marginTop: "2%",
				marginBottom: "2%",
			}}
		>
			<Flex justifyContent={"center"}>
				<h1
					style={{
						display: "flex",
						fontSize: "30px",
						textAlign: "center",
					}}
					className={roboto_slab.className}
				>
					Leaderboard
				</h1>
				<Image
					src={require("../../resources/sparkling.png")}
					width={40}
					height={30}
				/>
			</Flex>

			<br />
			<div style={{ display: "flex", marginBottom: "10px" }}>
				<h1
					style={{
						flex: "7%",
						display: "flex",
						justifyContent: "center",
					}}
				>
					Rank
				</h1>
				<h1 style={{ flex: "23%" }}>Name</h1>
				<h1
					style={{
						flex: "5%",
						display: "flex",
						justifyContent: "center",
					}}
				>
					Exp
				</h1>
				<h1
					style={{
						flex: "10%",
						display: "flex",
						justifyContent: "center",
					}}
				>
					Level
				</h1>
				<h1 style={{ flex: "55%" }}>Badges</h1>
			</div>
			<div>
				{topUsers
					.filter((user) => user.role === "volunteer")
					.sort((userA, userB) => {
						const expA = userA.exp_points;
						const expB = userB.exp_points;
						return expB - expA;
					})
					.slice(0, 10)
					.map((user, index) => (
						<div
							key={user.uid}
							style={{
								display: "flex",
								height: "80px",
								alignItems: "center",
								justifyContent: "center",
								marginBottom: "10px",
								borderRadius: "10px",
								overflow: "hidden",
							}}
							className={classes["rank-card"]}
						>
							<div
								style={{
									flex: "7%",
									display: "flex",
									justifyContent: "center",
									fontSize: `${
										index === 0 ? "20px" : "15px"
									}`,
									fontWeight: `${index === 0 ? 700 : 400}`,
								}}
								className={roboto_slab.className}
							>
								{index + 1}
							</div>
							<div
								style={{
									display: "flex",
									flex: "23%",
									alignItems: "center",
								}}
							>
								<h1
									style={{
										fontSize: `${
											index === 0 ? "20px" : "15px"
										}`,
										fontWeight: 700,
									}}
									className={roboto_slab.className}
								>
									{user.name}
								</h1>
								{index === 0 && (
									<RiVipCrown2Fill
										size={25}
										style={{
											marginLeft: "12px",
											color: "#A84141",
										}}
									/>
								)}
							</div>
							<div
								style={{
									flex: "5%",
									display: "flex",
									justifyContent: "center",
								}}
							>
								<p
									style={{
										fontSize: `${
											index === 0 ? "20px" : "15px"
										}`,
										fontWeight: `${
											index === 0 ? 700 : 400
										}`,
									}}
									className={roboto_slab.className}
								>
									{user.exp_points}
								</p>
							</div>
							<div
								style={{
									flex: "10%",
									display: "flex",
									justifyContent: "center",
								}}
							>
								<p
									style={{
										fontSize: `${
											index === 0 ? "20px" : "15px"
										}`,
										fontWeight: `${
											index === 0 ? 700 : 400
										}`,
									}}
									className={roboto_slab.className}
								>
									{getUserLevel(user.exp_points)}
								</p>
							</div>
							<div style={{ flex: "55%", display: "flex" }}>
								{badges
									.slice(
										0,
										getUserLevel(user.exp_points) > 10
											? 10
											: getUserLevel(user.exp_points)
									)
									.reverse()
									.map((badge) => (
										<img
											src={badge}
											style={{
												height: "50px",
												width: "50px",
												marginRight: "10px",
												borderRadius: "50%",
											}}
										/>
									))}
							</div>
						</div>
					))}
			</div>
		</div>
	);
};

export default withAuth(Leaderboard);
