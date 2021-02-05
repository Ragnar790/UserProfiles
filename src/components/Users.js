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

function Users({ allUsers, logoutHandler, userName, setAllUsers }) {
	const [startIndex, setStartIndex] = useState(0);
	const [endIndex, setEndIndex] = useState(10);

	const sliceUsers = (currPage) => {
		setStartIndex(10 * (currPage - 1));
		setEndIndex(10 * (currPage - 1) + 10);
	};
	return (
		<div className="App Users">
			<Navbar className="usersNav" color="danger" light expand="md">
				<NavbarBrand className="brand">{userName}</NavbarBrand>
				<InputGroup className="searchBar">
					<Input placeholder="Search username" />
					<InputGroupAddon addonType="append">
						<Button color="primary" id="searchBtn">
							Search
						</Button>
					</InputGroupAddon>
				</InputGroup>
				<Nav>
					<NavItem>
						<Button size="sm" onClick={logoutHandler}>
							Logout
						</Button>
					</NavItem>
				</Nav>
			</Navbar>
			<div className="CardDeck">
				{/* {allUsers.slice(startIndex, endIndex).length > 0 ? () :} */}
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
