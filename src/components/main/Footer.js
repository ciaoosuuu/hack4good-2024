"use client"; // This is a client component
import {
	Box,
	Flex,
	Image as ChakraImage,
	Spacer,
	Tabs,
	Tab,
	Button,
	Menu,
	MenuButton,
	MenuItem,
	MenuList,
} from "@chakra-ui/react";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { FaChevronDown, FaRegUser } from "react-icons/fa";
import Image from "next/image";
import theme from "../../theme.js";
import { UserAuth } from "../../app/context/AuthContext.js";
import { logOut } from "../../firebase/functions.js";
import { Roboto_Slab } from "next/font/google";

const roboto_slab = Roboto_Slab({
	weight: ["400", "700"],
	subsets: ["latin"],
	display: "swap",
});

export default function Footer() {
	const router = useRouter();

	return (
		<div
			style={{
				backgroundColor: "#ebe5df",
				padding: "2rem",
				marginTop: "4rem",
			}}
		>
			<Box
				style={{
					backgroundColor: "rgb(247, 246, 240)",
					borderRadius: "30px",
					padding: "2rem 10%",
				}}
			>
				<Flex align={"center"}>
					<Image
						src={require("../../resources/public/big-at-heart-logo.png")}
						width={80}
						height={60}
						alt="Big At Heart"
					/>
					<h1 className={roboto_slab.className}>Big At Heart</h1>
				</Flex>
				<br />
				<h1>Contact us at:</h1>
			</Box>
		</div>
	);
}
