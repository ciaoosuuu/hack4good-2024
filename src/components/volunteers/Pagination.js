import React, { useEffect, useState } from "react";
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

import classes from "../../app/volunteers/page.module.css";

const Pagination = ({
	usersPerPage,
	length,
	handlePagination,
	currentPage,
}) => {
	//const paginationNumbers = [];
	const [paginationNumbers, setPaginationNumbers] = useState([]);

	useEffect(() => {
		console.log("in pagination");
	}, []);
	useEffect(() => {
		const newPaginationNumbers = [];
		console.log("length", length);
		console.log("usersPerPage", usersPerPage);
		for (let i = 1; i <= Math.ceil(length / usersPerPage); i++) {
			newPaginationNumbers.push(i);
			console.log("pushing pag num", i);
		}
		setPaginationNumbers(newPaginationNumbers);
	}, [usersPerPage, length]);

	return (
		<Flex gap="2">
			<Spacer />
			{paginationNumbers.map((data) => (
				<Button
					key={data}
					onClick={() => handlePagination(data)}
					// colorScheme={"teal"}
					variant={`${currentPage === data ? "outline" : ""}`}
					//className={currentPage === data ? 'active' : ''}
				>
					{data}
				</Button>
			))}
		</Flex>
	);
};

export default Pagination;
