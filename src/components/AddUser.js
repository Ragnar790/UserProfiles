import React, { useState } from "react";
import ExistingUser from "./ExistingUser";
import { Link, Route, Switch } from "react-router-dom";
import { Button, Form, FormGroup, FormText, Input, Label } from "reactstrap";

function AddUser({
	addUserHandler,
	error,
	signInHandler,
	setFile,
	// uploadImage,
}) {
	const [name, setName] = useState("");
	const [password, setPassword] = useState("");
	const [confirmPassword, setConfirmPassword] = useState("");
	const [email, setEmail] = useState("");
	const [interest, setInterest] = useState("");

	return (
		<div className="App">
			<Switch>
				<Route path="/signIn">
					<ExistingUser signInHandler={signInHandler} error={error} />
				</Route>
				<Route path="/">
					{/* FORM */}
					<Form>
						{/* NAME */}
						<FormGroup>
							<Label for="userName">Username</Label>
							<Input
								type="text"
								name="userName"
								id="Name"
								placeholder="Enter your name"
								value={name}
								onChange={(e) => setName(e.target.value)}
								required
							/>
						</FormGroup>
						{/* PASSWORD */}
						<FormGroup>
							<Label for="Password">Password</Label>
							<Input
								type="password"
								name="password"
								id="Password"
								placeholder="Enter your password"
								value={password}
								onChange={(e) => setPassword(e.target.value)}
								required
							/>
						</FormGroup>
						<FormGroup>
							<Label for="cfrmPassword">Confirm Password</Label>
							<Input
								required
								type="password"
								name="password"
								id="cfrmPassword"
								placeholder="Re-enter your password"
								value={confirmPassword}
								onChange={(e) => setConfirmPassword(e.target.value)}
							/>
						</FormGroup>
						{/* EMAIL */}
						<FormGroup>
							<Label for="Email">Email</Label>
							<Input
								required
								type="email"
								name="email"
								id="Email"
								placeholder="Email"
								value={email}
								onChange={(e) => setEmail(e.target.value)}
							/>
						</FormGroup>
						{/* PROFILE IMAGE */}
						<FormGroup>
							<Label for="File">Upload profile picture</Label>
							<Input
								type="file"
								name="file"
								id="File"
								onChange={(e) => setFile(e.target.files[0])}
							/>
							<FormText color="muted">
								Only .jpeg and .png image files under 3mb are supported.
							</FormText>
						</FormGroup>
						{/* USER INTEREST */}
						<FormGroup>
							<Label for="userInterest">User Interest</Label>
							<Input
								required
								type="select"
								name="userInterest"
								id="userInterest"
								value={interest}
								onChange={(e) => setInterest(e.target.value)}
							>
								<option>Select</option>
								<option>Sports</option>
								<option>Technology</option>
								<option>News</option>
								<option>Music</option>
								<option>Movies</option>
							</Input>
						</FormGroup>
					</Form>
					{/* //DISPLAYING ERROR MESSAGE */}
					<p className="error">{error}</p>
					{/* //ADD USER BUTTON */}
					<Button
						color="danger"
						onClick={() =>
							addUserHandler(name, password, confirmPassword, email, interest)
						}
					>
						Add User
					</Button>
					{/* //LINK TO SIGN IN PAGE FOR WHEN USER ALREADY EXISTS */}
					<Link to="/signIn">
						<Button color="danger">Existing User</Button>
					</Link>
				</Route>
			</Switch>
		</div>
	);
}

export default AddUser;
