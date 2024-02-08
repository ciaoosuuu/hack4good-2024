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
	HStack,
	Spacer,
} from "@chakra-ui/react";
import { FaRegCalendarAlt, FaRegClock, FaMapPin } from "react-icons/fa";
import { LuUsers2 } from "react-icons/lu";
import { LiaChalkboardTeacherSolid } from "react-icons/lia";
import { MdOutlineVolunteerActivism, MdMenuBook } from "react-icons/md";
import classes from "../../app/activities/page.module.css";
import { useRouter } from "next/navigation";

const ActivityCard = ({
	activity,
	mini,
	allowReq = false,
	inProfile = false,
}) => {
	// const allowReq = allowRequest ? allowRequest : false;
	const router = useRouter();

	const handleCertReq = async (activity_id, event) => {
		event.stopPropagation();
		console.log("click cert");
		console.log(activity_id);
		router.push(`/certificate/request?reqActivityId=${activity_id}`);
	};
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
							color: "#fff",
							boxShadow: "2px 2px 2px #00000020",
						}}
						justify={"center"}
						align={"center"}
					>
						<LiaChalkboardTeacherSolid size={27} />
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
							backgroundColor: "#74ab8e",
							borderRadius: "100px",
							color: "#fff",
							boxShadow: "2px 2px 2px #00000020",
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
							color: "#fff",
							boxShadow: "2px 2px 2px #00000020",
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
					overflow="hidden"
					boxShadow="md"
					p={3}
					style={{
						height: "190px",
						textAlign: "left",
						minWidth: "700px",
						borderRadius: "10px",
						position: "relative",
					}}
					className={classes["item_horizontal"]}
					onClick={() =>
						router.push(`/activities/volunteer/${activity.id}`)
					}
				>
					{allowReq && (
						<Flex
							style={{
								width: "100%",
								position: "absolute",
								paddingRight: "25px",
							}}
						>
							<Spacer />
							<Button
								onClick={(event) =>
									handleCertReq(activity.id, event)
								}
								variant="outline"
								colorScheme={"teal"}
								style={{
									borderRadius: "100px",
									padding: "0 20px",
								}}
							>
								Request Certificate
							</Button>
						</Flex>
					)}
					<Grid
						h="175px"
						templateRows="repeat(4, 1fr)"
						templateColumns="repeat(12, 1fr)"
						gap={3}
					>
						<GridItem
							rowSpan={4}
							colSpan={3}
							style={{ minWidth: "250px" }}
						>
							{ActivityTypeIcon(activity.activity_type)}
							<Image
								style={{
									height: "100%",
									width: "100%",
									borderRadius: "8px",
									objectFit: "cover",
								}}
								src={activity.image}
								alt={activity.activity_name}
							/>
						</GridItem>
						<GridItem rowSpan={3} colSpan={7}>
							<Stack spacing="2">
								<Text fontWeight="bold">
									{activity.activity_name}
								</Text>
								<div
									style={{ opacity: "80%", fontSize: "14px" }}
								>
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
								</div>
							</Stack>
						</GridItem>

						<GridItem rowSpan={1} colSpan={2}></GridItem>

						<GridItem rowSpan={1} colSpan={2}></GridItem>
						{/* <GridItem rowSpan={2} colSpan={2}>
							<Flex align={"center"}>
								<LuUsers2 style={{ marginRight: "4px" }} />
								Vacancy:{" "}
								{activity.vacancy_total
									? activity.vacancy_total
									: "TBA"}
							</Flex>
						</GridItem> */}
						<GridItem rowSpan={1} colSpan={7}>
							<UnorderedList styleType="none" ml="0">
								<HStack>
									{activity.tags.map((tag, index) => (
										<ListItem key={index}>
											<Badge colorScheme="green">
												{tag}
											</Badge>
										</ListItem>
									))}
								</HStack>
							</UnorderedList>
						</GridItem>
						<GridItem rowSpan={2} colSpan={2}>
							{!inProfile && (
								<div
									style={{
										opacity: "50%",
										fontSize: "14px",
										marginTop: "-7px",
									}}
								>
									<Flex align={"center"}>
										<LuUsers2
											style={{ marginRight: "5px" }}
										/>
										Vacancy:{" "}
										{activity.vacancy_total
											? activity.vacancy_total
											: "TBA"}
									</Flex>
									<Flex align={"center"}>
										<LuUsers2
											style={{ marginRight: "5px" }}
										/>
										Slots left:{" "}
										{activity.vacancy_total &&
										activity.participants_signups
											? activity.vacancy_total -
											  activity.participants_signups
													.length
											: "TBA"}
									</Flex>
								</div>
							)}
						</GridItem>
					</Grid>
				</Box>
			) : (
				<Box
					key={activity.id}
					borderRadius="lg"
					overflow="hidden"
					p={3}
					style={{
						height: "100px",
						textAlign: "left",
						boxShadow: "3px 3px 3px #00000060",
					}}
					className={classes["item_horizontal_dark"]}
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
									{activity.activity_name}
								</Text>
								<div
									style={{
										opacity: "80%",
										fontSize: "14px",
										opacity: "50%",
									}}
								>
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
								</div>
							</Stack>
						</GridItem>
					</Grid>
				</Box>
			)}
		</>
	);
};

export default ActivityCard;
