"use client";

import { useState, useEffect } from "react";
import {
	Box,
	Tabs,
	TabList,
	Tab,
	TabPanels,
	TabPanel,
	Grid,
	Stack,
	Input,
	InputGroup,
	InputRightElement,
	Accordion,
} from "@chakra-ui/react";
import Swal from "sweetalert2";
import { db } from "../../firebase/config";
import withAuth from "../../hoc/withAuth";
import Entries from "../../components/blog/Entries";
import classes from "./page.module.css";
import { FaSearch } from "react-icons/fa";
import Image from "next/image";
import { useRouter } from "next/navigation";

import VolunteerCard from "../../components/volunteers/VolunteerCard";
import Pagination from "../../components/volunteers/Pagination";

const Volunteers = ({ user }) => {
	const router = useRouter();
	const [users, setUsers] = useState(null);
	const [filteredUsers, setFilteredUsers] = useState([]);
	const [pageNum, setPageNum] = useState(1);
	const [usersPerPage, setUsersPerPage] = useState(10);
	const [pageFilteredUsers, setPageFilteredUsers] = useState([]);
	const [search, setSearch] = useState("");

	useEffect(() => {
		if (user.role !== "admin") {
			Swal.fire({
				title: "Unauthorized Access!",
				text: "Redirecting ...",
				icon: "warning",
				timer: 1000,
				timerProgressBar: true,
				showConfirmButton: false,
				allowOutsideClick: false,
			}).then(() => {
				setTimeout(() => {
					router.push("/activities");
				}, 500);
			});
		}
	}, [user.role]);

	useEffect(() => {
		if (users) return;
		const fetchData = async () => {
			try {
				const usersSnapshot = await db.collection("Users").get();

				const usersData = usersSnapshot.docs.map((doc) => ({
					id: doc.id,
					...doc.data(),
				}));
				const volunteersData = usersData.filter(
					(user) => user.role !== "admin"
				);
				setUsers(volunteersData);
				setFilteredUsers(volunteersData);
				console.log("users", usersData);
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};
		fetchData();
	}, []);

	useEffect(() => {
		let searchValue = search.trim().toLowerCase();
		console.log("searchVal", searchValue);
		if (searchValue === "") {
			setFilteredUsers(users);
		} else {
			const filtered = users.filter((user) => {
				return (
					user.name.toLowerCase().includes(searchValue) ||
					user.emailyou.toLowerCase().includes(searchValue)
				);
			});
			setFilteredUsers(filtered);
		}
	}, [search, users]);

	useEffect(() => {
		if (!filteredUsers) return;
		const indexOfLastPost = pageNum * usersPerPage;
		const indexOfFirstPost = indexOfLastPost - usersPerPage;
		const currentFilteredUsers = filteredUsers.slice(
			indexOfFirstPost,
			indexOfLastPost
		);
		console.log("currentFilteredUsers", currentFilteredUsers);
		setPageFilteredUsers(currentFilteredUsers);
	}, [pageNum, filteredUsers]);

	const handlePagination = (pageNum) => {
		setPageNum(pageNum);
	};

	if (user.role !== "admin") {
		return null;
	}
	return (
		<>
			<div style={{ zIndex: 30 }}>
				<div className={classes["page_layout"]}>
					<div style={{ width: "80%", margin: "0 auto" }}>
						<br />
						<h1 style={{ fontSize: "24px" }}>Volunteers</h1>
						<br />
						<Stack>
							<InputGroup>
								<Input
									variant="filled"
									style={{
										backgroundColor: "white",
										boxShadow: "2px 2px 4px #00000020",
									}}
									onChange={(e) => setSearch(e.target.value)}
								></Input>
								<InputRightElement>
									<FaSearch />
								</InputRightElement>
							</InputGroup>
						</Stack>
						<br />
						<Grid
							style={{ borderRadius: "30px", overflow: "hidden" }}
						>
							<Accordion allowMultiple>
								{pageFilteredUsers &&
									pageFilteredUsers.map((user) => (
										<VolunteerCard
											key={user.id}
											volunteer={user}
										/>
									))}
							</Accordion>
						</Grid>
						<br />
						{usersPerPage && pageNum && (
							<Pagination
								usersPerPage={usersPerPage}
								length={2}
								handlePagination={handlePagination}
								currentPage={pageNum}
							/>
						)}
					</div>
				</div>{" "}
			</div>
		</>
	);
};

export default withAuth(Volunteers);
