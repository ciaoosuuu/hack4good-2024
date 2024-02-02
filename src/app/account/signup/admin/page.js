"use client";
import { useState } from "react";
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
import { RiUserLine } from "react-icons/ri";
import { auth } from "../../../context/AuthContext";
import {
	emailPwSignIn,
	emailPwSignUp,
	logOut,
	googleSignIn,
} from "../../../../firebase/functions";
import withAuth from "../../../../hoc/withAuth";

const AdminSignup = ({ user }) => {
	const router = useRouter();
	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");
	const [loginError, setLoginError] = useState(null);
	// console.log("adminsignup");

	// console.log(user?.email);

	const handleEmailSignUp = async (e) => {
		e.preventDefault();
		emailPwSignUp(email, password)
			.then(() => {
				//successfully login
				// router.push('/');
				console.log("Sign up");
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
				// router.push('/');
				console.log("Log in.");
			})
			.catch((error) => {
				const errorCode = error.code;
				const errorMessage = error.message;
				console.log(`Email login error: ${errorMessage}`);
				setLoginError(errorMessage);
			});
	};

	return (
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
					<FormControl isRequired>
						<FormLabel>Email:</FormLabel>
						<Input
							type="email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							variant="filled"
						/>
					</FormControl>
					<br />
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

export default withAuth(AdminSignup);
