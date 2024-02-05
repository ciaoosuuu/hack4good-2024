import React from "react";
import Link from "next/link";
import {
	Button,
	Box,
	Grid,
	GridItem,
	Image,
	Text,
	Stack,
	Badge,
	Flex,
	Icon,
	ListItem,
	UnorderedList,
	Tooltip,
	Spacer,
} from "@chakra-ui/react";
import { FaRegCalendarAlt, FaRegClock, FaMapPin } from "react-icons/fa";
import { LuUsers2 } from "react-icons/lu";
import { MdOutlineVolunteerActivism, MdMenuBook } from "react-icons/md";
import classes from "../../app/activities/page.module.css";
import { useRouter } from "next/navigation";

const ActivityCard = ({ activity, mini }) => {
	const router = useRouter();
	const ActivityTypeIcon = (activityType, marginTop, marginLeft) => {
		if (activityType === "Training") {
			return (
				<Tooltip label={activityType}>
					<Flex
						style={{
							position: "absolute",
							zIndex: 10,
							marginTop: `${marginTop ? marginTop : "-10px"}`,
							marginLeft: `${marginLeft ? marginLeft : "-10px"}`,
							width: "45px",
							height: "45px",
							textAlign: "center",
							backgroundColor: "#68bbde",
							borderRadius: "100px",
							color: "rgb(235,234,228)",
							boxShadow: "2px 2px 2px #00000020",
							opacity: "90%",
						}}
						justify={"center"}
						align={"center"}
					>
						<MdMenuBook size={27} />
					</Flex>
				</Tooltip>
			);
		} else if (activityType === "Workshop") {
			return (
				<Tooltip label={activityType}>
					<Flex
						style={{
							position: "absolute",
							zIndex: 10,
							marginTop: `${marginTop ? marginTop : "-10px"}`,
							marginLeft: `${marginLeft ? marginLeft : "-10px"}`,
							width: "45px",
							height: "45px",
							textAlign: "center",
							backgroundColor: "#68bbde",
							borderRadius: "100px",
							color: "rgb(235,234,228)",
							boxShadow: "2px 2px 2px #00000020",
							opacity: "90%",
						}}
						justify={"center"}
						align={"center"}
					>
						<MdMenuBook size={27} />
					</Flex>
				</Tooltip>
			);
		} else {
			return (
				<Tooltip label={activityType}>
					<Flex
						style={{
							position: "absolute",
							zIndex: 10,
							marginTop: `${marginTop ? marginTop : "-10px"}`,
							marginLeft: `${marginLeft ? marginLeft : "-10px"}`,
							width: "45px",
							height: "45px",
							textAlign: "center",
							backgroundColor: "#de7268",
							borderRadius: "100px",
							color: "rgb(235,234,228)",
							boxShadow: "2px 2px 2px #00000020",
							opacity: "90%",
						}}
						justify={"center"}
						align={"center"}
					>
						<MdOutlineVolunteerActivism size={27} />
					</Flex>
				</Tooltip>
			);
		}
	};
	return (
		<>
			{!mini ? (
				<Box
					key={activity.id}
					borderWidth="1px"
					borderRadius="lg"
					overflow="hidden"
					boxShadow="md"
					p={3}
					style={{
						height: "200px",
						textAlign: "left",
					}}
					className={classes["item_horizontal"]}
					onClick={() =>
						router.push(`/activities/volunteer/${activity.id}`)
					}
				>
					<Grid
						h="175px"
						templateRows="repeat(4, 1fr)"
						templateColumns="repeat(8, 1fr)"
						gap={3}
					>
						<GridItem rowSpan={4} colSpan={2}>
							{ActivityTypeIcon(activity.type)}
							<Image
								style={{
									height: "100%",
									width: "100%",
									borderRadius: "8px",
								}}
								src={activity.image}
								alt={activity.name}
							/>
						</GridItem>
						<GridItem rowSpan={3} colSpan={5}>
							<Stack spacing="2">
								<Text fontWeight="bold">{activity.name}</Text>
								<Text>
									<Icon as={FaRegCalendarAlt} mr="2" />
									{activity.datetime_start
										.toDate()
										.toLocaleString("en-EN", {
											year: "numeric",
											month: "long",
											day: "numeric",
										}) +
										", " +
										activity.datetime_start
											.toDate()
											.toLocaleString("en-EN", {
												weekday: "long",
											})}
								</Text>
								<Text>
									<Icon as={FaRegClock} mr="2" />
									{activity.datetime_start
										.toDate()
										.toLocaleString("en-EN", {
											hour: "numeric",
											minute: "numeric",
											hour12: true,
										}) +
										" to " +
										activity.datetime_end
											.toDate()
											.toLocaleString("en-EN", {
												hour: "numeric",
												minute: "numeric",
												hour12: true,
											})}
								</Text>
								<Text>
									<Icon as={FaMapPin} mr="2" />
									{activity.location_name}
								</Text>
							</Stack>
						</GridItem>

						<GridItem rowSpan={3} colSpan={1}></GridItem>

						<GridItem rowSpan={1} colSpan={5}>
							<Flex>
								<UnorderedList styleType="none" ml="0">
									{activity.tags.map((tag, index) => (
										<ListItem key={index}>
											<Badge colorScheme="green">
												{tag}
											</Badge>
										</ListItem>
									))}
								</UnorderedList>
							</Flex>
						</GridItem>
						<GridItem rowSpan={1} colSpan={1}>
							<p>
								<LuUsers2 /> Vacancy: 20
							</p>
						</GridItem>
					</Grid>
				</Box>
			) : (
				<Box
					key={activity.id}
					borderWidth="1px"
					borderRadius="lg"
					overflow="hidden"
					boxShadow="md"
					p={3}
					style={{
						height: "100px",
						textAlign: "left",
					}}
					className={classes["item_horizontal"]}
					onClick={() =>
						router.push(`/activities/volunteer/${activity.id}`)
					}
				>
					{ActivityTypeIcon(activity.type, "15px", "-29px")}
					{/* <Tooltip label={activity.type}>
						<Flex
							style={{
								position: "absolute",
								zIndex: 10,
								marginTop: "15px",
								marginLeft: "-29px",
								width: "45px",
								height: "45px",
								textAlign: "center",
								backgroundColor: `${
									activity.type !== "Volunteering"
										? "#68bbde"
										: "#de7268"
								}`,
								borderRadius: "100px",
								color: "rgb(235,234,228)",
								boxShadow: "2px 2px 2px #00000020",
								opacity: "90%",
							}}
							justify={"center"}
							align={"center"}
						>
							{activity.type !== "Volunteering" ? (
								<MdMenuBook size={27} />
							) : (
								<MdOutlineVolunteerActivism size={27} />
							)}
						</Flex>
					</Tooltip> */}
					<Grid
						h="80px"
						templateRows="repeat(4, 1fr)"
						templateColumns="repeat(12, 1fr)"
						gap={3}
					>
						<GridItem rowSpan={3} colSpan={1}></GridItem>
						<GridItem rowSpan={3} colSpan={11}>
							<Stack spacing="1">
								<Text fontWeight="bold" noOfLines={1}>
									{activity.name}
								</Text>
								<Text>
									<Icon as={FaRegCalendarAlt} mr="2" />
									{activity.datetime_start
										.toDate()
										.toLocaleString("en-EN", {
											year: "numeric",
											month: "long",
											day: "numeric",
										}) +
										", " +
										activity.datetime_start
											.toDate()
											.toLocaleString("en-EN", {
												weekday: "long",
											})}
								</Text>
								<Text>
									<Icon as={FaRegClock} mr="2" />
									{activity.datetime_start
										.toDate()
										.toLocaleString("en-EN", {
											hour: "numeric",
											minute: "numeric",
											hour12: true,
										}) +
										" to " +
										activity.datetime_end
											.toDate()
											.toLocaleString("en-EN", {
												hour: "numeric",
												minute: "numeric",
												hour12: true,
											})}
								</Text>
							</Stack>
						</GridItem>
					</Grid>
				</Box>
			)}
		</>
	);
};

export default ActivityCard;
