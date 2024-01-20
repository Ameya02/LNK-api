require("dotenv").config();
const jwt = require("jsonwebtoken");
const { User } = require("../models/userModel.js");



function createToken(cookiePayload, maxAge) {
	const token = jwt.sign(cookiePayload, "Authenticate", { expiresIn: maxAge });
	return token;
}



const isLoggedin = async function (req, res, next) {
	try {
		// Get corresponding cookie, and throw error if does'nt exits
		const token = req.cookies.engage_jwt;
		if (!token) throw new Error("Please Login");

		// Verify cookie signature, and query db if user exists
		const decodedToken = jwt.verify(token,"Authenticate");
		const user = await User.findById(decodedToken._id);
		if (!user) throw new Error("Could'nt find User");
		
		// Save user info to locals, and move to next middleware
		res.locals.user = { fac: decodedToken.fac, ...user };
		next();
	} catch (err) {
		console.error(err);
		res.status(400).json({ access: false, msg: err.message });
	}
};

module.exports = { createToken, isLoggedin };
