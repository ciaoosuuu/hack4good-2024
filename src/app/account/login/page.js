"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserAuth } from "../../context/AuthContext";
import { emailPwSignIn, googleSignIn } from "../../../firebase/functions";
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
import Swal from "sweetalert2";

const Login = () => {
	const router = useRouter();
	const { user, isLoading } = UserAuth();
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
				router.push("/");
				//   }, 500);
			});
		}
	}, [user]);

	const handleEmailLogin = async (e) => {
		e.preventDefault();
		emailPwSignIn(email, password)
			.then(() => {
				//successfully login
				router.push("/activities");
			})
			.catch((error) => {
				const errorMessage = error.message;
				console.log(`Email login error: ${errorMessage}`);
				setLoginError(errorMessage);
			});
	};

	const handleGoogleLogin = async (e) => {
		e.preventDefault();
		googleSignIn()
			.then(() => {
				//successfully login
				router.push("/activities");
			})
			.catch((error) => {
				const errorMessage = error.message;
				console.log(`Google login error: ${errorMessage}`);
				setLoginError(errorMessage);
			});
	};

	return isLoading || user ? null : (
		<Box style={{ maxWidth: "600px", margin: "80px auto" }}>
			<h1 style={{ textAlign: "center" }}>Log In</h1>
			<br />
			<form onSubmit={handleEmailLogin}>
				<FormControl isRequired>
					<FormLabel>Email:</FormLabel>
					<Input
						type="email"
						value={email}
						onChange={(e) => setEmail(e.target.value)}
						placeholder="Email"
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
						placeholder="Password"
						variant="filled"
					/>
				</FormControl>
				<br />
				<Button
					type="submit"
					style={{ width: "100%" }}
					colorScheme="red"
				>
					Login
				</Button>
			</form>
			<br />
			<Flex justify={"center"}>
				<p>
					or{" "}
					<Button
						onClick={handleGoogleLogin}
						colorScheme="red"
						variant={"outline"}
					>
						{" "}
						<FcGoogle style={{ marginRight: "10px" }} />
						Login with Google
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
				{!loginError && user && (
					<Alert status="error">
						<FiAlertCircle style={{ marginRight: "10px" }} />
						{user.email}
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
					No Account?{" "}
					<Link color="red.500" href="/account/signup/volunteer">
						Sign up here.
					</Link>
				</p>
			</Flex>
		</Box>
	);
};

export default Login;
