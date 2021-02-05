import React, { useState } from "react";
import {
	Card,
	CardBody,
	CardImg,
	CardSubtitle,
	CardText,
	CardTitle,
	Button,
	Input,
	Form,
	FormGroup,
} from "reactstrap";

function UserCard({ item, idx, allUsers, setAllUsers }) {
	const [edit, setEdit] = useState(false);
	const [editedName, setEditedName] = useState(item.userName);
	const [editedEmail, setEditedEmail] = useState(item.email);
	const [editedInterest, setEditedInterest] = useState(item.interest);
	const [error, setError] = useState("");

	//DELETE BUTTON HANDLER
	const deletebtn = (id, index) => {
		console.log("delete", id, index);
		const idToDelete = id;
		fetch(`http://localhost:8080/users/${idToDelete}`, {
			method: "DELETE",
			credentials: "include",
		}).then((r) => {
			allUsers.splice(index, 1);
			setAllUsers([...allUsers]);
		});
	};

	//EDIT BUTTON HANDLER
	const toggleEdit = () => {
		setEdit(!edit);
	};

	//SAVE BUTTON HANDLER
	const saveBtnHandler = (id, index) => {
		// UPDATING THE FRONTEND ONLY
		if (
			editedEmail.trim() !== "" &&
			editedName.trim() !== "" &&
			editedInterest.trim() !== ""
		) {
			fetch(`http://localhost:8080/users/${id}`, {
				method: "PUT",
				body: JSON.stringify({
					userName: editedName,
					email: editedEmail,
					interest: editedInterest,
				}),
				headers: { "Content-Type": "application/json" },
				credentials: "include",
			})
				.then((r) => r.json())
				.then((resp) => {
					console.log("resp", resp);
					allUsers.splice(index, 1, resp);
					setAllUsers([...allUsers]);
					setEdit(false);
				});
			// allUsers.splice(idx, 1, {
			// 	userName: editedName,
			// 	email: editedEmail,
			// 	interest: editedInterest,
			// });
			// setAllUsers([...allUsers]);
			// setEdit(false);
		} else {
			setError("Please fill all fields");
		}
	};

	return (
		<>
			{edit === false ? (
				<Card className="card">
					<CardImg
						// top
						// width="10%"
						src="https://static.toiimg.com/photo/72975551.cms"
						alt="Card image cap"
					/>
					<CardBody>
						<CardTitle tag="h5">{item.userName}</CardTitle>
						<CardSubtitle tag="h6" className="mb-2 text-muted">
							{item.email}
						</CardSubtitle>
						<CardText>{`Interest: ${item.interest}`}</CardText>
						<Button color="primary" onClick={toggleEdit}>
							Edit
						</Button>
						<Button color="danger" onClick={() => deletebtn(item._id, idx)}>
							Delete
						</Button>
					</CardBody>
				</Card>
			) : (
				<Card>
					<Form>
						<FormGroup>
							<Input
								placeholder="Username"
								defaultValue={item.userName}
								onChange={(e) => setEditedName(e.target.value)}
							/>
						</FormGroup>
						<FormGroup>
							<Input
								placeholder="Email"
								defaultValue={item.email}
								onChange={(e) => setEditedEmail(e.target.value)}
							/>
						</FormGroup>
						<FormGroup>
							<Input
								type="select"
								onChange={(e) => setEditedInterest(e.target.value)}
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
					<p className="error">{error}</p>
					<Button color="danger" onClick={toggleEdit}>
						Cancel
					</Button>
					<Button color="primary" onClick={() => saveBtnHandler(item._id, idx)}>
						Save
					</Button>
				</Card>
			)}
		</>
	);
}

export default UserCard;
