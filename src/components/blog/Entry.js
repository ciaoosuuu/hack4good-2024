"use client";

import { useState, useEffect } from "react";
import { Divider, Flex, Image } from "@chakra-ui/react";
import { FaCircleUser } from "react-icons/fa6";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase/config";
import { useRouter } from "next/navigation";
import classes from "../../app/blog/page.module.css";

const Entry = (entry, index) => {
	const router = useRouter();

	const [userData, setUserData] = useState(null);
	useEffect(() => {
		const fetchUser = async () => {
			if (!entry.isanonymous && entry.user_id) {
				// const userResponse = await getAuth().getUser(entry.user_id);
				// console.log("userRes", userResponse);
				const userDoc = await db
					.collection("Users")
					.doc(entry.user_id)
					.get();
				if (userDoc.exists) {
					setUserData(userDoc.data());
				}
			}
		};
		fetchUser();
	}, [entry]);

	const routeToActivity = () => {
		router.push(`/activities/volunteer/${entry.activity_id}`);
	};

	const randomOpacity = () => {
		return "" + (Math.floor(Math.random() * 33) + 55) / 100;
	};

	return (
		<div
			key={index}
			className={classes["grid-item"]}
			style={{
				backgroundColor: `${
					entry.type === "feedback"
						? "rgb(102, 40, 40, 95)"
						: "rgb(102, 40, 40," + randomOpacity() + ")"
				} `,
			}}
			onClick={routeToActivity}
		>
			{entry.image && <img src={entry.image} alt="Reflection" />}
			<p />
			<Divider />
			<div style={{ padding: "5px", fontWeight: 700 }}>
				{entry.activity_name}
			</div>
			<Divider />
			<p />
			<p>{`${entry.content.split(" ").slice(0, 100).join(" ")}...`}</p>
			<p />
			<p>
				{entry.isanonymous && (
					<Flex align={"center"}>
						<FaCircleUser
							size={23}
							style={{ marginRight: "8px" }}
						/>
						Anonymous
					</Flex>
				)}

				{userData && (
					<Flex align={"center"}>
						<Image
							style={{
								height: "24px",
								width: "24px",
								borderRadius: "30px",
								objectFit: "cover",
								marginRight: "8px",
								marginLeft: "-3px",
							}}
							src={userData.image}
							alt={userData.name}
						/>
						<text style={{ fontWeight: 700 }}>
							{userData.name ? userData.name : ""}
						</text>
					</Flex>
				)}
			</p>
		</div>
	);
};

export default Entry;
