import React, { useState } from "react";
import UserCard from "./UserCard";
import {
	Input,
	InputGroup,
	InputGroupAddon,
	Navbar,
	NavbarBrand,
	Button,
	NavItem,
	Nav,
} from "reactstrap";
import Pages from "./Pages";

function Users({
	allUsers,
	logoutHandler,
	userName,
	setAllUsers,
	getusername,
}) {
	const [startIndex, setStartIndex] = useState(0);
	const [endIndex, setEndIndex] = useState(10);
	const [searchText, setSearchText] = useState("");

	const sliceUsers = (currPage) => {
		setStartIndex(10 * (currPage - 1));
		setEndIndex(10 * (currPage - 1) + 10);
	};

	//SEARCG BUTTON HANDLER
	const searchHandler = () => {
		if (searchText.trim() !== "") {
			fetch(`http://localhost:8080/users/${searchText}`, {
				credentials: "include",
			})
				.then((r) => r.json())
				.then((r) => {
					setAllUsers(r);
				});
		}
	};

	return (
		<div className="App Users">
			<Navbar className="usersNav" color="danger" light expand="md">
				<NavbarBrand className="brand" onClick={getusername}>
					<b>Users</b>
				</NavbarBrand>
				<InputGroup className="searchBar">
					<Input
						placeholder="Search username"
						value={searchText}
						onChange={(e) => setSearchText(e.target.value)}
					/>
					<InputGroupAddon addonType="append">
						<Button color="primary" id="searchBtn" onClick={searchHandler}>
							Search
						</Button>
					</InputGroupAddon>
				</InputGroup>
				<Nav>
					<NavItem className="profileName">
						<span>
							<b>{` (${userName})`}</b>
						</span>
						<Button className="logoutBtn" size="sm" onClick={logoutHandler}>
							logout
						</Button>
					</NavItem>
				</Nav>
			</Navbar>
			<div className="CardDeck">
				{allUsers.slice(startIndex, endIndex).length > 0 ? (
					<>
						{allUsers.slice(startIndex, endIndex).map((item, idx) => (
							<UserCard
								key={item._id}
								item={item}
								idx={idx}
								allUsers={allUsers}
								setAllUsers={setAllUsers}
							/>
						))}
					</>
				) : (
					<h1 className="noFiles">No more results</h1>
				)}
			</div>
			<Pages sliceUsers={sliceUsers} />
		</div>
	);
}

export default Users;
