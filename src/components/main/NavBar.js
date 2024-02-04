"use client"; // This is a client component
import {
	Flex,
	Spacer,
	Tabs,
	Tab,
	Button,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
} from "@chakra-ui/react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { FaChevronDown, FaRegUser } from "react-icons/fa";
import Image from "next/image";
import theme from "../../theme.js";
import { UserAuth } from "../../app/context/AuthContext.js";
import {
	logOut
} from "../../firebase/functions.js";

export default function NavBar() {
	const { user } = UserAuth();
	const router = useRouter();
	const [loginStatus, setLoginStatus] = useState(true);
	const [isOpen, setIsOpen] = useState(false);
	const items = [
		{
			key: "home",
			label: `Home`,
		},
		{
			key: "activities",
			label: `Activities`,
		},
		{
			key: "profile",
			label: `Profile`,
		},
	];

	const navigateTo = (path) => {
		router.push(`/${path}`);
	};

	const handleLogout = () => {
		logOut();
		console.log("you have been logout");
		setLoginStatus((prevLoginStatus) => !prevLoginStatus);
		console.log("New login status:", loginStatus);
		navigateTo("");
  };

	const handleLogin = () => {
		navigateTo("account/login");
  };


	return (
		<div
			style={{
				top: 0,
				position: "sticky",
				display: "flex",
				zIndex: 1,
				width: "100%",
				justifyContent: "space-between",
				alignItems: "center",
				backgroundColor: "rgb(235,234,228)",
				padding: "0.5rem 1rem 0 1rem",

				boxShadow: "1px 1px 5px #00000010",
			}}
		>
			<Flex align={"center"}>
				<Image
					src={require("../../resources/public/big-at-heart-logo.png")}
					width={50}
					height={50}
					alt="Big At Heart"
				/>
				<div
					style={{
						width: "2px",
						height: "25px",
						backgroundColor: "#00000080",
						margin: "0 10px",
					}}
				/>
				<p className="tracking-wider">hack4good</p>
			</Flex>
			<Tabs
				style={{
					width: "30%",
					display: "flex",
					justifyContent: "center",
				}}
				colorScheme={"red"}
			>
				<Flex key={"tabs"} style={{ width: "100%" }}>
					{items &&
						items.map((navItem) => (
							<>
								<Tab
									key={navItem.key}
									onClick={() => navigateTo(navItem.key)}
								>
									{navItem.label}
								</Tab>
								<Spacer key={navItem.key} />
							</>
						))}
				</Flex>
			</Tabs>{" "}
			<Menu>
				{({ isOpen }) => (
					<>
						<MenuButton
							isActive={isOpen}
							as={Button}
							style={{
								backgroundColor: "transparent",
								width: "200px",
							}}
							leftIcon={<FaRegUser />}
							rightIcon={<FaChevronDown />}
						>
							{user? user.name : "Guest"}
						</MenuButton>
						<MenuList>
							{user ? (
								<>
									<MenuItem key={"profile"}>Profile</MenuItem>
									<MenuItem key={"account/logout"} onClick={handleLogout}>Log out</MenuItem>
								</>
							) : (
								<MenuItem key={"account/login"} onClick={handleLogin}>Log in</MenuItem>
							)}
						</MenuList>
					</>
				)}
			</Menu>
		</div>
	);
}
