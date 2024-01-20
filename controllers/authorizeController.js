const authorizeController = (req, res, next) => {
	const user = {
		email: res.locals.user._doc.email,
		createdAt: res.locals.user._doc.createdAt,
		
	};
	res.status(200).json({ user, fac: res.locals.user.fac, msg: "You can access the page" });
};

module.exports.authorizeController = authorizeController;