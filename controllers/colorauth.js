const bcrypt = require("bcrypt");
const { User } = require("../models/userModel.js");
const { createToken } = require("../middlewares/userAuth.js");
const color_auth = async (req, res, next) => {
    try {
		if (!res.locals.user.fac) throw new Error("Can't Skip factor1");
			
        if (!res.locals.user._doc.colorSecret){
        const color_secret = await req.body.color_secret
        const hashedColor_Secret = await bcrypt.hash(color_secret, 10);
        await User.updateOne({ _id: res.locals.user._doc._id }, { colorSecret: hashedColor_Secret });
		} else {
            const color_secret = await req.body.color_secret
            const colormatch = await bcrypt.compare(color_secret, res.locals.user._doc.colorSecret);
            if (!colormatch) throw new Error("Color Doesn't matched, Try Again");
		}

		// If Color_Secrets matches, create a Cookie and append it to the Resonse Object
		const token = createToken({ _id: res.locals.user._doc._id, fac: 2 }, "2h");
		res.cookie("engage_jwt", token, { maxAge: 2 * 60 * 60 * 1000, httpOnly: true });
		res.status(200).json({ id:res.locals.user._doc._id,access: true, fac: 2, msg: "Authentication Successful" });
		
	} catch (err) {
		console.error(err);
		res.status(400).json({ access: false, fac: 2, msg: err.message }); 
	}
}

module.exports = { color_auth };