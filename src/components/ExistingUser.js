import React, { useState } from "react";
import { Button, FormGroup, Form, Input, Label } from "reactstrap";

function ExistingUser({ signInHandler, error }) {
	const [userName, setUsername] = useState("");
	const [password, setPassword] = useState("");
	return (
		<div className="App">
			<Form>
				<FormGroup>
					<Label for="userName">Username</Label>
					<Input
						type="text"
						name="userName"
						id="Name"
						value={userName}
						onChange={(e) => setUsername(e.target.value)}
						placeholder="Enter your name"
					/>
				</FormGroup>
				{/* PASSWORD */}
				<FormGroup>
					<Label for="Password">Password</Label>
					<Input
						type="password"
						name="password"
						id="Password"
						value={password}
						onChange={(e) => setPassword(e.target.value)}
						placeholder="Enter your password"
					/>
				</FormGroup>
			</Form>
			<p className="error">{error}</p>
			<Button color="danger" onClick={() => signInHandler(userName, password)}>
				Sign In
			</Button>
		</div>
	);
}

export default ExistingUser;
