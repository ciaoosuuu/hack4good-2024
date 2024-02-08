"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
	Box,
	Button,
	FormControl,
	FormLabel,
	Input,
	Flex,
	Alert,
} from "@chakra-ui/react";
import { Link } from '@chakra-ui/next-js'
import NextLink from 'next/link'
import { FcGoogle } from "react-icons/fc";
import { FiAlertCircle } from "react-icons/fi";
import { AiOutlineArrowRight } from "react-icons/ai";
import { RiUserLine } from "react-icons/ri";
import Swal from "sweetalert2";

import {
	emailPwSignUp,
	googleSignIn,
} from "../../../../firebase/functions";

import { UserAuth } from "../../../context/AuthContext";
import { db } from "../../../../firebase/config";
import { Timestamp } from "firebase/firestore";

const addAdminToDb = async (userCredential, name) => {
	const data = {
		uid: userCredential.user.uid,
		email: userCredential.user.email,
		role: "admin",
		name: name,
		created_on: Timestamp.fromDate(new Date()),
		activities_created: [],
	};
	try {
		await db.collection("Users").doc(userCredential.user.uid).set(data);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

const AdminSignup = () => {
	const router = useRouter();
	const { user , isLoading } = UserAuth();
	const [isJustSignedUp, setIsJustSignedUp] = useState(false);
	const [name, setName] = useState("");
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loginError, setLoginError] = useState(null);

	useEffect(() => {
		if (user) {
		  Swal.fire({
			title: "You have logged in.",
			text: "Redirecting ...",
			icon: "success",
			timer: 1000,
			timerProgressBar: true,
			showConfirmButton: false,
			allowOutsideClick: false,
		  }).then(() => {
			// setTimeout(() => {
				if (!isJustSignedUp) {
					router.push("/activities");
				}
			//   }, 500);
		  });
		}
	  }, [user]);

	const handleEmailSignUp = async (e) => {
		e.preventDefault();
		emailPwSignUp(email, password)
			.then(async (userCredential) => {
				await addAdminToDb(userCredential, name);
				setIsJustSignedUp(true);
				// here can push to somewhere else to configure admin settings
				router.push("/activities");
			})
			.catch((error) => {
				const errorMessage = error.message;
				console.log(`Email sign up error: ${errorMessage}`);
				setLoginError(errorMessage);
			});
	};

	const handleGoogleSignUp = async (e) => {
		e.preventDefault();
		googleSignIn()
			.then(async (userCredential) => {
				await addAdminToDb(userCredential, name);
				setIsJustSignedUp(true);
				// here can push to somewhere else to configure admin settings
				router.push("/activities");
			})
			.catch((error) => {
				const errorMessage = error.message;
				console.log(`Email login error: ${errorMessage}`);
				setLoginError(errorMessage);
			});
	};

	return isLoading || user ? null : (
		<>
			<Button
				style={{ top: "1.5rem", right: "1.5rem", position: "fixed" }}
				variant={"outline"}
				colorScheme={"red"}
				onClick={() => router.push("/account/signup/volunteer")}
			>
				<RiUserLine style={{ marginRight: "10px" }} />
				User Sign Up
				<AiOutlineArrowRight style={{ marginLeft: "10px" }} />
			</Button>
			<Box style={{ maxWidth: "600px", margin: "80px auto" }}>
				<h1 style={{ textAlign: "center" }}>Admin Sign Up Page</h1>
				<br />
				<form onSubmit={handleEmailSignUp}>
					<FormControl isRequired style={{ marginBottom: "8px" }}>
						<FormLabel>Name:</FormLabel>
						<Input
							value={name}
							onChange={(e) => setName(e.target.value)}
							variant="filled"
						/>
					</FormControl>
					<FormControl isRequired style={{ marginBottom: "8px" }}>
						<FormLabel>Email:</FormLabel>
						<Input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							variant="filled"
						/>
					</FormControl>
					<FormControl isRequired>
						<FormLabel>Password:</FormLabel>
						<Input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							variant="filled"
						/>
					</FormControl>
					<br />
					<Button
						type="submit"
						style={{ width: "100%" }}
						colorScheme="red"
					>
						Sign Up
					</Button>
				</form>
				<br />
				<Flex justify={"center"}>
					<p>
						or{" "}
						<Button
							onClick={handleGoogleSignUp}
							colorScheme="red"
							variant={"outline"}
						>
							{" "}
							<FcGoogle style={{ marginRight: "10px" }} />
							Sign Up with Google
						</Button>
					</p>
				</Flex>
				<br />
				<Box>
					{loginError && (
						<Alert status="error">
							<FiAlertCircle style={{ marginRight: "10px" }} />
							{loginError}{" "}
						</Alert>
					)}
				</Box>
				<div
					style={{
						backgroundColor: "black",
						opacity: "10%",
						width: "100%",
						height: "1px",
						margin: "15px 0",
					}}
				></div>
				<br />
				<Flex justify={"center"}>
					<p>
						Already have an account?{" "}
						<Link as={NextLink} color="red.500" href="/account/login">
							Log in here.
						</Link >
					</p>
				</Flex>
			</Box>
		</>
	);
};

export default AdminSignup;
