const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const session = require("express-session");
const { diskStorage } = require("multer");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(express.json());
const cors = require("cors");
app.use(
	cors({
		///because the frontend and backend are running on different servers
		credentials: true,
		///frontend path
		origin: "http://localhost:3000",
	})
);
app.use(
	session({
		secret: "session_secret",
		resave: true,
		saveUninitialized: true,
	})
);

//CREATING CONNECTION WITH DATABASE
const db = mongoose.createConnection("mongodb://localhost:27017/Profile", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});
db.on("connected", () => {
	console.log("connected to database.");
});

//DEFINING SCHEMA
const userSchema = new mongoose.Schema({
	userName: String,
	password: String,
	email: String,
	interest: String,
});
const userModel = db.model("user", userSchema);

/// function to check null or undefined
const nullOrUnd = (val) => val === null || val === undefined;
const salt = 9;

// API requests
// Add new user
app.post("/signup", async (req, res) => {
	const { userName, password, confirmPassword, email, interest } = req.body;
	if (password === confirmPassword) {
		// - in the model find a user with same name
		const existingUser = await userModel.findOne({ userName });
		// - null or undefined means not found
		if (nullOrUnd(existingUser)) {
			// - we can create a new user
			const hashedPw = bcrypt.hashSync(password, salt);
			//adding new user in db
			const newUser = new userModel({
				userName,
				password: hashedPw,
				email,
				interest,
			});
			await newUser.save();
			req.session.userId = newUser._id;
			// storing the current user id in session
			//storing it in during login or signup
			res.status(201).send({
				id: newUser._id,
				success: "Signed up",
			});
		} else {
			res.status(401).send({ error: "Username already exists" });
		}
	} else {
		res.status(401).send({ error: "Passwords don't match" });
	}
});

// login
app.post("/login", async (req, res) => {
	const { userName, password } = req.body;
	const existingUser = await userModel.findOne({ userName });
	if (nullOrUnd(existingUser)) {
		res.status(404).send({ error: "Username not found" });
	} else {
		const hashedPw = existingUser.password;
		if (bcrypt.compareSync(password, hashedPw)) {
			req.session.userId = existingUser._id;
			res.status(201).send({ success: "Signed in" });
		} else {
			res.status(401).send({ error: "Password incorrect" });
		}
	}
});

// authentication middleware
const authMw = async (req, res, next) => {
	if (nullOrUnd(req.session) || nullOrUnd(req.session.userId)) {
		res.status(401).send({ error: "Not logged in" });
		console.log("Auth not running", req.session, req.session.userId);
	} else {
		console.log("Auth running", req.session, req.session.userId);
		next();
	}
};

// get all users
app.get("/users", authMw, async (req, res) => {
	// finding all users
	const allUsers = await userModel.find({});
	res.status(201).send(allUsers);
});

//GET USER BY NAME
app.get("/users/:name", authMw, async (req, res) => {
	const searchName = req.params.name;
	const searchedResult = await userModel.find({ userName: searchName });
	if (!nullOrUnd(searchedResult)) {
		res.status(201).send(searchedResult);
		console.log("Found");
	} else {
		res.sendStatus(409);
		console.log("Not Found");
	}
});

//EDIT USER
app.put("/users/:userId", authMw, async (req, res) => {
	console.log("/put");
	const { userName, email, interest } = req.body;
	console.log("req body", req.body, req.body.userName, userName, email);
	const userId = mongoose.Types.ObjectId(req.params.userId);
	try {
		console.log("coming in try block");
		const existingUser = await userModel.findById(userId);
		if (nullOrUnd(existingUser)) {
			res.sendStatus(404);
		} else {
			//updating
			existingUser.userName = userName;
			existingUser.email = email;
			existingUser.interest = interest;

			await existingUser.save();
			res.status(201).send(existingUser);
		}
	} catch (e) {
		// searching elements  by _id may return exceptions that can only be handled through catch
		console.log("thisssssss", e);
		res.sendStatus(401);
	}
});

//DELETE AN EXISTING USER
app.delete("/users/:userId", authMw, async (req, res) => {
	console.log("/delete");
	const userId = req.params.userId;
	try {
		await userModel.deleteOne({ _id: userId });
		res.sendStatus(200);
	} catch (e) {
		res.sendStatus(404);
	}
});

// LOGOUT HANDLER
app.get("/logout", (req, res) => {
	if (!nullOrUnd(req.session)) {
		req.session.destroy(() => {
			res.sendStatus(200);
		});
	} else {
		res.sendStatus(200);
	}
});

// getting the name of the current user
app.get("/userinfo", authMw, async (req, res) => {
	// as req.session.userId can never be manipulated it means that the id will never be invalid
	// So we can omit using try-catch block
	console.log("/userInfo");
	const user = await userModel.findById(req.session.userId);
	res.send({
		userName: user.userName,
		id: user._id,
	});
});

//Storing image in server

//Storage Engine
const storage = multer.diskStorage({
	destination: "./upload/images",
	filename: (req, file, cb) => {
		return cb(null, `${file.id}${path.extname(file.originalname)}`);
	},
});

const upload = multer({
	storage: storage,
	//filter
	// fileFilter:
	//limits
	limits: {
		fileSize: 3 * 1000000,
	},
});

app.use("/profile", express.static("upload/images"));

app.post("/upload", upload.single("profile"), (req, res) => {
	req.file.id = req.session.userId;
	console.log("upload".req.session.userId);
	res.json({
		success: true,
		profile_url: `http://localhost:3000/profile/${req.file.filename}`,
	});
});

//error handler for exceeding image limit
function errHandler(err, req, res, next) {
	if (err instanceof multer.MulterError) {
		res.json({
			success: false,
			message: err.message,
		});
	}
}
app.use(errHandler);

app.listen(8080, () => {
	console.log("app listening on port 8080");
});
