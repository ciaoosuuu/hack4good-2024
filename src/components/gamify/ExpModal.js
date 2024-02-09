import {
	Button,
	Box,
	Flex,
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalCloseButton,
	ModalBody,
	useDisclosure,
	ModalFooter,
} from "@chakra-ui/react";
import Image from "next/image";

import { Roboto_Slab } from "next/font/google";
const roboto_slab = Roboto_Slab({
	weight: ["400", "700"],
	subsets: ["latin"],
	display: "swap",
});

const ExpModal = () => {
	const { isOpen, onOpen, onClose } = useDisclosure();
	return (
		<>
			<Button
				onClick={onOpen}
				style={{
					marginBottom: "8px",
					borderRadius: "100px",
					padding: "21px 21px",
				}}
				variant="outline"
				colorScheme={"teal"}
			>
				Find out more about EXP's
			</Button>

			<Modal isOpen={isOpen} onClose={onClose}>
				<ModalOverlay />
				<ModalContent>
					<ModalHeader>
						<Flex justifyContent={"center"}>
							<h1
								style={{
									display: "flex",
									fontSize: "30px",
									textAlign: "center",
								}}
								className={roboto_slab.className}
							>
								EXP's
							</h1>
							<Image
								src={require("../../resources/sparkling.png")}
								width={40}
								height={30}
							/>
						</Flex>
					</ModalHeader>
					<ModalCloseButton />
					<ModalBody>
						<text style={{ fontWeight: "700" }}>Volunteering:</text>{" "}
						<p>
							No. of hours x{" "}
							<text style={{ fontWeight: "700" }}>25 EXP's</text>
						</p>
						<br />
						<text style={{ fontWeight: "700" }}>
							Trainings/Workshops:
						</text>{" "}
						<p>
							No. of hours x{" "}
							<text style={{ fontWeight: "700" }}>15 EXP's</text>
						</p>
						<br />
						<text style={{ fontWeight: "700" }}>
							Reflections/Feedbacks:
						</text>{" "}
						<p>
							<text style={{ fontWeight: "700" }}>10 EXP's</text>{" "}
							each
						</p>
					</ModalBody>

					<ModalFooter>
						<Flex justify={"center"} style={{ width: "100%" }}>
							<Button
								colorScheme={"teal"}
								mr={3}
								onClick={onClose}
							>
								Close
							</Button>
						</Flex>
					</ModalFooter>
				</ModalContent>
			</Modal>
		</>
	);
};

export default ExpModal;
