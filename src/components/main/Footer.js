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
	HStack,
	Stack,
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
import { MdOutlineMail, MdOutlinePhoneEnabled } from "react-icons/md";
import {
	FaFacebookSquare,
	FaInstagramSquare,
	FaYoutubeSquare,
} from "react-icons/fa";
import { SiGmail } from "react-icons/si";
import { Link } from "@chakra-ui/next-js";
import NextLink from "next/link";

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
				<Flex style={{ margin: "10px 0" }}>
					<Stack>
						<h1
							style={{ fontSize: "20px", margin: "3px 0 10px 0" }}
						>
							Contact us at:
						</h1>
						<h1 style={{ display: "flex", alignItems: "center" }}>
							<MdOutlineMail
								size={22}
								style={{ marginRight: "8px" }}
							/>
							team@bigatheart.org
						</h1>
						<h1 style={{ display: "flex", alignItems: "center" }}>
							<MdOutlinePhoneEnabled
								size={22}
								style={{ marginRight: "8px" }}
							/>
							+65 8776 5740
						</h1>
					</Stack>
					<Spacer />
					<Stack>
						<h1
							style={{ fontSize: "20px", margin: "3px 0 10px 0" }}
						>
							Follow us at:
						</h1>
						<HStack>
							<Link
								as={NextLink}
								href={"//facebook.com/TheBigAtHeart"}
								prefetch={false}
								className="foot-icon"
							>
								<FaFacebookSquare size={30} />
							</Link>
							<Link
								as={NextLink}
								href={"//instagram.com/thebigatheart"}
								prefetch={false}
								className="foot-icon"
							>
								<FaInstagramSquare size={30} />
							</Link>
							<Link
								as={NextLink}
								href={
									"//youtube.com/channel/UCgjJLFg85upAjk49uhrSTuQ"
								}
								prefetch={false}
								className="foot-icon"
							>
								<FaYoutubeSquare size={30} />
							</Link>
							<Link
								as={NextLink}
								href={"//facebook.com"}
								prefetch={false}
								className="foot-icon"
							>
								<SiGmail size={30} />
							</Link>
						</HStack>
					</Stack>
					<Spacer />
				</Flex>
			</Box>
		</div>
	);
}
