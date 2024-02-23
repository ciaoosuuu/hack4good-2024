"use client";

import { useState, useEffect } from "react";
import {
	Modal,
	ModalOverlay,
	ModalContent,
	ModalHeader,
	ModalFooter,
	ModalBody,
	ModalCloseButton,
	Button,
	useClipboard,
    Flex,
    Text
} from "@chakra-ui/react";
import Image from "next/image";
import { FcLink } from "react-icons/fc";
import { FaRegClipboard } from "react-icons/fa6";
import shortid from "shortid";
import { db } from "../../firebase/config.js";
import withAuth from "../../hoc/withAuth";

const ReferralModal = ({ user, isOpen, onClose }) => {
	const [referralCode, setReferralCode] = useState("");
	const { hasCopied, onCopy } = useClipboard(`https://bigheartshub.vercel.app/account/signup/volunteer?ref=${referralCode}`);
	// http://localhost:3000/account/signup/volunteer?ref=jof4EWNzvz
	// http://localhost:3000/account/signup/volunteer?ref=FTPSXoaeop // with referredIds for user 8g1iyQZ4p7Xu05bnxeRvDzI2jaY2
	// https://bigheartshub.vercel.app/account/signup/volunteer?ref=FTPSXoaeop

	// Function to generate referral code
	const generateReferralCode = async () => {
		if (!user) onClose();

		const thirtyDaysAgo = new Date();
		thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
		let referralCodeToUse = null;
		try {
			const querySnapshot = await db
				.collection("Referrals")
				.where("referrerId", "==", user.uid)
				.get();
			querySnapshot.forEach((doc) => {
				const referralData = doc.data();
				if (!referralData.referredIds || referralData.referredIds.length < 3) {
					referralCodeToUse = referralData.referralCode;
				}
			});
            if (referralCodeToUse) {
                setReferralCode(referralCodeToUse);
                return;
            }
		} catch (error) {}

		const newReferralCode = shortid.generate();
		try {
			const referralsRef = await db.collection("Referrals");
			await referralsRef.add({
			    referrerId: user.uid,
			    referralCode: newReferralCode,
			    created: new Date(),
				referredIds: [],
			});
			setReferralCode(newReferralCode);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	// Function to generate referral link
	const generateReferralLink = () => {
		return `https://bigheartshub.vercel.app/account/signup/volunteer?ref=${referralCode}`;
	};

	useEffect(() => {
		generateReferralCode();
	}, []);

	return (
		<Modal isOpen={isOpen} onClose={onClose} >
			<ModalOverlay />
			<ModalContent style={{minWidth: "500px"}}>
				<ModalHeader>
                    <Flex justify="center">
                        Invite to Big Hearts Hub <FcLink size={28} style={{marginLeft: "8px"}}/>
                    </Flex>
                </ModalHeader>
				<ModalCloseButton />
                <br/>
				<ModalBody>
					{referralCode && (
                        <>
							<Flex justify="center">
							<Image
								src={require("../../resources/refer.png")}
								width={150}
								height={30}
							/></Flex>
                            <br/>
							<Flex justify="center">
                                <Text as='b' align={"center"}>
                                    Share the link below with your friends. Gain EXP's when they sign up with us!
                                </Text>
                            </Flex>
							<br/>
                            <Flex justify="center" gap={3}>
                                <Button onClick={onCopy} style={{ width: "100%", overflow: "hidden", textOverflow: "ellipsis" }}>
                                    <Text isTruncated  as='u'>
                                    {`https://bigheartshub.vercel.app/account/signup/volunteer?ref=${referralCode}`}
                                    </Text>
                                </Button>
                                <Button colorScheme="blue" mr={3} onClick={onCopy}>
                                    <FaRegClipboard />
                                </Button>
                            </Flex>
                        </>
					)}
                    {hasCopied &&
                        <>
                        <br/>
                        <Flex justify="center">
                            <Text isTruncated as='b' align={"center"} style={{color: "green"}}>
                                Link copied to clipboard!
                            </Text>
                        </Flex>
                        </>
                    }
				</ModalBody>
                <br/>
			</ModalContent>
		</Modal>
	);
};

export default withAuth(ReferralModal);