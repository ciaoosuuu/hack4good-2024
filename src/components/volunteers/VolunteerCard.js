import { useRouter } from "next/navigation";
import {
	Button,
	Box,
	Grid,
	GridItem,
	Image as ChakraImage,
	Badge,
	Flex,
	UnorderedList,
	Spacer,
	Wrap,
	WrapItem,
	AccordionIcon,
	AccordionItem,
	AccordionButton,
	AccordionPanel,
} from "@chakra-ui/react";
import Image from "next/image";
import { BsFillFileBarGraphFill } from "react-icons/bs";

import classes from "../../app/volunteers/page.module.css";

const VolunteerCard = ({ volunteer }) => {
	const router = useRouter();
	return (
		<AccordionItem>
			<Box
				className={classes["volunteer-card"]}
				style={{
					//backgroundColor: "white",
					minHeight: "90px",
				}}
			>
				<Flex gap={2} style={{ width: "100%" }}>
					<AccordionButton
						style={{
							backgroundColor: "transparent",
							height: "100%",
							padding: "1rem ",
						}}
						// className={classes["volunteer-card"]}
						// style={{
						// 	//backgroundColor: "white",
						// 	minHeight: "90px",
						// 	borderColor: "#00000020",
						// 	padding: "1rem ",
						// }}
					>
						<ChakraImage
							className={classes["profilepicimg"]}
							style={{ marginRight: "20px" }}
							src={
								volunteer?.image
									? volunteer.image
									: "https://firebasestorage.googleapis.com/v0/b/hackforgood-mvc.appspot.com/o/Users%2Fnoprofile.png?alt=media&token=e2fc8953-a256-423a-a720-24e3c8a729a1"
							}
							alt={volunteer?.image ? "volunteer" : ""}
						/>

						<div>
							<h1
								style={{
									textAlign: "left",
									fontSize: "15px",
								}}
							>
								{volunteer.name}
							</h1>

							{volunteer.preferences && (
								<UnorderedList styleType="none" ml="0">
									<Wrap spacing="2px">
										<div
											style={{
												fontSize: "13px",
												fontStyle: "italic",
												opacity: "60%",
											}}
										>
											Languages:
										</div>
										{volunteer.preferences.languages ? (
											volunteer.preferences.languages.map(
												(tag, index) => (
													<WrapItem key={index}>
														<Badge colorScheme="blackAlpha">
															{tag}
														</Badge>
													</WrapItem>
												)
											)
										) : (
											<>-</>
										)}
									</Wrap>
								</UnorderedList>
							)}
							{volunteer.preferences && (
								<UnorderedList styleType="none" ml="0">
									<Wrap spacing="2px">
										<div
											style={{
												fontSize: "13px",
												fontStyle: "italic",
												opacity: "60%",
											}}
										>
											Interest Areas:
										</div>
										{volunteer.preferences.interestAreas &&
											volunteer.preferences.interestAreas.map(
												(tag, index) => (
													<WrapItem key={index}>
														<Badge colorScheme="green">
															{tag}
														</Badge>
													</WrapItem>
												)
											)}
									</Wrap>
								</UnorderedList>
							)}
							{volunteer.preferences && (
								<UnorderedList styleType="none" ml="0">
									<Wrap spacing="2px">
										<div
											style={{
												fontSize: "13px",
												fontStyle: "italic",
												opacity: "60%",
											}}
										>
											Skills:
										</div>
										{volunteer.preferences.skills &&
											volunteer.preferences.skills.map(
												(tag, index) => (
													<WrapItem key={index}>
														<Badge colorScheme="teal">
															{tag}
														</Badge>
													</WrapItem>
												)
											)}
									</Wrap>
								</UnorderedList>
							)}
						</div>

						<Spacer />
					</AccordionButton>
					{/* <Tooltip label={"Go to Volunteer Report"} placement="top"> */}
					<Box style={{ margin: "auto 0", color: "#333" }}>
						<BsFillFileBarGraphFill
							size={27}
							className={classes["volunteer-report-button"]}
							onClick={() =>
								router.push(
									`/reports/volunteer/${volunteer.uid}`
								)
							}
						/>
					</Box>
					{/* </Tooltip> */}
					<Box style={{ margin: "auto 0" }}>
						<AccordionButton
							style={{ backgroundColor: "transparent" }}
						>
							<AccordionIcon boxSize={27} />
						</AccordionButton>
					</Box>
				</Flex>
			</Box>

			<AccordionPanel pb={4} style={{ backgroundColor: "#ffffff90" }}>
				<div
					className={classes["details"]}
					style={{
						display: "grid",
						gridTemplateColumns: "100px 1fr 100px 1fr",
					}}
				>
					<p style={{ fontWeight: "700" }}>Email:</p>
					<p>{volunteer.email}</p>
					<p style={{ fontWeight: "700" }}>Contact:</p>
					<p>{volunteer.contact ? volunteer.contact : "-"}</p>
					<p style={{ fontWeight: "700" }}>Description:</p>
					<p>{volunteer.description ? volunteer.description : "-"}</p>
				</div>
			</AccordionPanel>
		</AccordionItem>
	);
};

export default VolunteerCard;
