const bcrypt = require("bcrypt");
const { User } = require("../models/userModel.js");
const { createToken } = require("../middlewares/userAuth.js");



const signup = async (req, res, next) => {
	try {
		// Check if User exists, using email as an unique identifier, throw error if exist
		const userExists = await User.exists({ email: req.body.email });
		if (userExists) throw new Error("User Already Exists");

		// Bcrypt hash password, with generated salt from 10 rounds
		const hashedPassword = await bcrypt.hash(req.body.password, 10);

		// Create a new document, and add it the databse users collection
		const user = { email: req.body.email, password: hashedPassword };
		const u = await User.create(user);

		// If User created, create a Cookie and append it to the Resonse Object
		const token = createToken({ _id: u._id, fac: 1 }, "2h");
		res.cookie("engage_jwt", token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });
		res.status(200).json({ access: true, fac: 1, msg: "User Created Successfully" });
	} catch (err) {
		console.error(err);
		res.status(400).json({ access: false, fac: 1, msg: err.message });
	}
};

module.exports = { signup };
