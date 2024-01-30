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
import { FaChevronDown, FaRegUser } from "react-icons/fa";
import Image from "next/image";
import theme from "../../theme.js";

export default function NavBar() {
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
				<p
					style={{
						fontWeight: 600,
					}}
				>
					hack4good
				</p>
			</Flex>
			<Tabs
				style={{
					width: "30%",
					display: "flex",
					justifyContent: "center",
				}}
				colorScheme={"red"}
			>
				<Flex style={{ width: "100%" }}>
					{items.map((navItem) => (
						<>
							<Tab>{navItem.label}</Tab>
							<Spacer />
						</>
					))}
				</Flex>
			</Tabs>{" "}
			<Menu>
				{({ isOpen }) => (
					<>
						<MenuButton
							ghost
							isActive={isOpen}
							as={Button}
							style={{
								backgroundColor: "transparent",
								width: "200px",
							}}
							leftIcon={<FaRegUser />}
							rightIcon={<FaChevronDown />}
						>
							username
						</MenuButton>
						<MenuList colorScheme={"red"}>
							<MenuItem>Profile</MenuItem>
							<MenuItem>Log in</MenuItem>
						</MenuList>
					</>
				)}
			</Menu>
		</div>
	);
}
