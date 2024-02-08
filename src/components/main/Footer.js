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
	const { user } = UserAuth();
	const router = useRouter();
	const pathname = usePathname();
	const [activeIndex, setActiveIndex] = useState(0);

	useEffect(() => {
		const path = pathname.split("/")[1];
		const activeIndex = items.findIndex((item) => item.key.includes(path));
		if (activeIndex) {
			console.log("matchingItem", activeIndex);
			setActiveIndex(activeIndex);
		} else {
			setActiveIndex(0);
		}
	}, [pathname]);

	const [loginStatus, setLoginStatus] = useState(true);
	const [isOpen, setIsOpen] = useState(false);
	const items = [
		{
			key: "",
			label: `Home`,
		},
		{
			key: "activities",
			label: `Activities`,
		},
		{
			key: "blog",
			label: `Blog`,
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
