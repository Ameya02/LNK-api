const { User } = require("../models/userModel.js");
const { createToken } = require("../middlewares/userAuth.js");
const { compare, getFacialEmbeddings } = require("../face_recognition/recognize.js");


/**
 * User Controller, fires Asynchronously over /faceauth route
 *
 * Check if User exists and authentication step, and get the corresponding embedding vector 
 * now compare them with the generated embeddings, if similarity is greater than a threshold,
 * send a cookie else log error to console setting status code to 400.
 *
 */
const face_auth = async (req, res, next) => {
	try {
		// Check if facialEmbeddings exist, else a new one
		if (!res.locals.user.fac>3) throw new Error("Can't Skip factor3");

		if (!res.locals.user._doc.facialEmbeddings.length) {
			// Generate Unified Facial Embeddings corresponding to the image buffer
			const userEbd = await getFacialEmbeddings(req.file.buffer);
			const userEbdArr = await userEbd.array();

			// Update corresponding document, with the generated facialEmbeddings
			await User.updateOne({ _id: res.locals.user._doc._id }, { facialEmbeddings: userEbdArr });
		} else {
			// Get FacialEmbeddings from the File Buffer, and Compare them with the one from DB
			const anchorEbd = res.locals.user._doc.facialEmbeddings;
			const similar = await compare(anchorEbd, req.file.buffer);
			if (!similar) throw new Error("Face Doesn't matched, Try Again");
		}

		// If Face matches, create a Cookie and append it to the Resonse Object
		const token = createToken({ _id: res.locals.user._doc._id, fac: 4 }, "2h");
		res.cookie("engage_jwt", token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });
		user = await User.findOne({ _id: res.locals.user._doc._id });
		
		res.status(200).json({ access: true, fac: 3, user:{ email: user["email"],createdAt:user["createdAt"]},  msg: "Authentication Successful" });
	} catch (err) {
		console.error(err);
		res.status(400).json({ access: false, fac: 3, msg: err.message }); 
	}
};

module.exports = { face_auth };
