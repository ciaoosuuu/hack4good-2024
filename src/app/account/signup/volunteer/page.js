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
	Link,
} from "@chakra-ui/react";
import { FcGoogle } from "react-icons/fc";
import { FiAlertCircle } from "react-icons/fi";
import { AiOutlineArrowRight } from "react-icons/ai";
import { RiAdminLine } from "react-icons/ri";
import { UserAuth } from "../../../context/AuthContext";
import Swal from "sweetalert2"
import {
	emailPwSignUp,
	googleSignIn,
} from "../../../../firebase/functions";
import { db } from "../../../../firebase/config";

const addVolunteerToDb = async (userCredential) => {
	const data = {
		uid: userCredential.user.uid,
		email: userCredential.user.email,
		role: "volunteer",
	};
	try {
		await db.collection("Users").doc(userCredential.user.uid).set(data);
		console.log("added");
	} catch (error) {
		console.log(error);
	}
};

const VolunteerSignup = () => {
	const router = useRouter();
	const { user, isLoading } = UserAuth();
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
				router.push("/activities");
			//   }, 500);
		  });
		}
	  }, [user]);

	const handleEmailSignUp = async (e) => {
		e.preventDefault();
		emailPwSignUp(email, password)
			.then(async (userCredential) => {
				await addVolunteerToDb(userCredential);
				router.push("/profile/volunteer-preferences");
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
			.then(() => {
				//successfully login
				router.push("/profile/volunteer-preferences");
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
				onClick={() => router.push("/account/signup/admin")}
			>
				<RiAdminLine style={{ marginRight: "10px" }} />
				Admin Sign Up
				<AiOutlineArrowRight style={{ marginLeft: "10px" }} />
			</Button>
			<Box style={{ maxWidth: "600px", margin: "80px auto" }}>
				<h1 style={{ textAlign: "center" }}>Volunteer Sign Up Page</h1>
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
					{/* {!loginError && user && (
					<Alert status="error">
						<FiAlertCircle style={{ marginRight: "10px" }} />
						{user.email}
					</Alert>
				)} */}
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
						<Link color="red.500" href="/account/login">
							Log in here.
						</Link>
					</p>
				</Flex>
			</Box>
		</>
	);
};

export default VolunteerSignup;
