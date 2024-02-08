"use client";

import { useState, useEffect } from "react";
import { Divider, Flex, Image } from "@chakra-ui/react";
import { FaCircleUser } from "react-icons/fa6";
import { getAuth } from "firebase/auth";
import { db } from "../../firebase/config";
import { useRouter } from "next/navigation";
import classes from "../../app/blog/page.module.css";

import Entry from "../blog/Entry";

const Entries = ({ entries, classes, numColsInput }) => {
	let numCols = numColsInput ? numColsInput : 4;

	const colsArr = Array.from({ length: numCols }, (item, index) => index);

	return (
		<>
			{entries.length > 0 ? (
				<div className={classes["four-column-container"]}>
					{colsArr.map((columnIndex) => (
						<div
							key={columnIndex}
							className={classes["column-four"]}
						>
							{entries.map(
								(entry, index) =>
									index % numCols === columnIndex &&
									Entry(entry, index)
							)}
						</div>
					))}
				</div>
			) : (
				<div style={{ textAlign: "center" }}>No entries here!</div>
			)}
		</>
	);
};

export default Entries;
