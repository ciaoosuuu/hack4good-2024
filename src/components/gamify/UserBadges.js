"use client";

import { useEffect, useState } from "react";
import { db } from "../../firebase/config";

const UserBadges = ({ userExp, best }) => {
	const [userLevels, setUserLevels] = useState([]);
	const [bestUserLevel, setBestUserLevel] = useState(null);
	const returnBest = best ? best : false;

	useEffect(() => {
		const fetchUserLevels = async () => {
			try {
				const userLevelsSnapshot = await db.collection("Levels").get();

				if (userLevelsSnapshot.empty) {
					console.log("No badges found.");
					return;
				}

				const userLevelsData = userLevelsSnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				const userLevelsSorted = userLevelsData
					.filter((level) => level.exp <= userExp)
					.sort((a, b) => a.level - b.level);

				setUserLevels(userLevelsSorted);

				const bestUserLevel = userLevelsSorted.slice(-1);
				if (bestUserLevel && bestUserLevel[0]) {
					setBestUserLevel(bestUserLevel[0]);
				}
			} catch (error) {
				console.error("Error fetching badges:", error);
			}
		};

		fetchUserLevels();
	}, [userExp]);

	if (!returnBest) {
		return (
			<div>
				<ul
					style={{
						display: "flex",
						justifyContent: "center",
					}}
				>
					{userLevels &&
						userLevels.map((level) => (
							<li
								style={{
									// marginLeft: "20px",
									// marginRight: "20px",
									width: "200px",
									textAlign: "center",
									listStyle: "none",
								}}
							>
								<img
									src={level.badge}
									alt={level.title}
									style={{
										marginLeft: "50px",
										marginBottom: "8px",
										// marginRight: "46px",
										width: "100px",
										height: "100px",
										borderRadius: "50%",
										boxShadow:
											"0 4px 8px rgba(0, 0, 0, 0.1)",
									}}
								/>
								<p
									style={{
										fontSize: "small",
										fontWeight: "bold",
									}}
								>
									Level {level.level}
								</p>
								<p style={{ fontSize: "small" }}>
									{level.title}
								</p>
							</li>
						))}
				</ul>
			</div>
		);
	}

	return (
		<>
			{bestUserLevel && (
				<img
					src={bestUserLevel.badge}
					alt={bestUserLevel.title}
					style={{
						width: "100px",
						height: "100px",
						borderRadius: "50%",
						boxShadow: "2px 4px 3px rgba(0, 0, 0, 0.2)",
					}}
				/>
			)}
		</>
	);
};

const Badge = ({ level }) => {
	const badgeUrl = level.badge;
	const badgeName = level.title;
	const badgeLevel = level.level;

	return (
		<li
			style={{
				// marginLeft: "20px",
				// marginRight: "20px",
				width: "200px",
				textAlign: "center",
				listStyle: "none",
			}}
		>
			<img
				src={badgeUrl}
				alt={badgeName}
				style={{
					marginLeft: "50px",
					marginBottom: "8px",
					// marginRight: "46px",
					width: "100px",
					height: "100px",
					borderRadius: "50%",
					boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
				}}
			/>
			<p style={{ fontSize: "small", fontWeight: "bold" }}>
				Level {badgeLevel}
			</p>
			<p style={{ fontSize: "small" }}>{badgeName}</p>
		</li>
	);
};

export default UserBadges;
