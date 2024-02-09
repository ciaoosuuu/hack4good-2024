"use client";

import { useState, useEffect } from "react";
import { Divider, Flex, Image } from "@chakra-ui/react";
import { FaCircleUser } from "react-icons/fa6";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase/config";
import { useRouter } from "next/navigation";
import classes from "../../app/blog/page.module.css";
import ReadMoreReact from "read-more-react";

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
		>
			{entry.image && (
				<img
					src={entry.image}
					alt="Reflection"
					onClick={routeToActivity}
				/>
			)}
			<p />
			<Divider />
			<div
				style={{ padding: "5px", fontWeight: 700 }}
				onClick={routeToActivity}
			>
				{entry.activity_name}
			</div>
			<Divider />
			<p />
			<p>
				<ReadMoreReact
					text={entry.content}
					min={100}
					ideal={180}
					max={200}
					readMoreText={
						<div className={classes["read-more"]}>Read more...</div>
					}
				/>
			</p>
			{/* <p>{`${entry.content.split(" ").slice(0, 100).join(" ")}...`}</p> */}
			<p />
			<div onClick={routeToActivity}>
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
								//marginLeft: "-3px",
							}}
							src={
								userData.image
									? userData.image
									: "https://firebasestorage.googleapis.com/v0/b/hackforgood-mvc.appspot.com/o/Users%2Fnoprofile.png?alt=media&token=e2fc8953-a256-423a-a720-24e3c8a729a1"
							}
							alt={userData.name}
						/>
						<text style={{ fontWeight: 700 }}>
							{userData.name ? userData.name : ""}
						</text>
					</Flex>
				)}
			</div>
		</div>
	);
};

export default Entry;
