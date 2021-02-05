import "./App.css";
import { useEffect, useState } from "react";
import AddUser from "./components/AddUser";
import Users from "./components/Users";
function App() {
	const [loggedIn, setLoggedIn] = useState(false);
	const [error, setError] = useState("");
	const [allUsers, setAllUsers] = useState([]);
	const [userName, setUsername] = useState(undefined);

	// Function to get the name of the current user
	const getusername = () => {
		return (
			fetch("http://localhost:8080/userinfo", { credentials: "include" })
				// credentials: "include" is necessary when frontend and backend runnin on different hosts
				.then((r) => {
					if (r.ok) {
						return r.json();
					} else {
						setLoggedIn(false);
						setUsername(undefined);
						return { success: false };
					}
				})
				.then((r) => {
					//if fetch was fulfilled
					if (r.success !== false) {
						setLoggedIn(true);
						setUsername(r.userName);
						fetch("http://localhost:8080/users", { credentials: "include" })
							.then((r) => r.json())
							.then((r) => {
								setAllUsers(r);
							});
					}
				})
		);
	};

	// USEEFFECT
	useEffect(() => {
		getusername();
	}, []);

	// ADD USER HANDLER
	const addUserHandler = (
		userName,
		password,
		confirmPassword,
		email,
		interest
	) => {
		if (
			userName.trim() !== "" &&
			password.trim() !== "" &&
			confirmPassword.trim() !== "" &&
			email.trim() !== "" &&
			interest.trim() !== ""
		) {
			fetch("http://localhost:8080/signup", {
				method: "POST",
				body: JSON.stringify({
					userName,
					password,
					confirmPassword,
					email,
					interest,
				}),
				headers: { "Content-Type": "application/json" },
				credentials: "include",
			})
				.then((r) => {
					if (r.ok) {
						return { success: true };
					} else {
						return r.json();
					}
				})
				.then((r) => {
					if (r.success === true) {
						return getusername();
						// console.log(userName, password, confirmPassword, email, interest);
					} else {
						setError(r.error);
					}
				});
		} else {
			setError("Please enter all fields");
		}
	};

	// SIGN IN HANDLER
	const signInHandler = (userName, password) => {
		fetch("http://localhost:8080/login", {
			method: "POST",
			body: JSON.stringify({ userName, password }),
			headers: { "Content-Type": "application/json" },
			credentials: "include",
		})
			.then((r) => {
				if (r.ok) {
					return { success: true };
				} else {
					return r.json();
				}
			})
			.then((r) => {
				if (r.success === true) {
					return getusername();
				} else {
					setError(r.error);
				}
			});
	};

	//LOGOUT HANDLER
	const logoutHandler = () => {
		return fetch("http://localhost:8080/logout", {
			credentials: "include",
		}).then((r) => {
			if (r.ok) {
				setLoggedIn(false);
				setUsername(undefined);
			}
		});
	};

	return loggedIn ? (
		<Users
			userName={userName}
			logoutHandler={logoutHandler}
			allUsers={allUsers}
			setAllUsers={setAllUsers}
			getusername={getusername}
		/>
	) : (
		<AddUser
			error={error}
			addUserHandler={addUserHandler}
			signInHandler={signInHandler}
		/>
	);
}

export default App;
