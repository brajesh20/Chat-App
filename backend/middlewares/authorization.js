const User = require("../models/user");
const wrapAsync = require("./wrapAsync");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

const authorization = wrapAsync(async (req, res, next) => {
	const authHeader = req.headers.authorization;
	const token = authHeader && authHeader.split(" ")[1];

	if (!token) {
		return res.status(401).json({ message: "Unauthorized - No token provided" });
	}

	let decodedToken;
	try {
		decodedToken = jwt.verify(token, JWT_SECRET);
	} catch (err) {
		return res.status(401).json({ message: "Unauthorized - Invalid token" });
	}

	const user = await User.findById(decodedToken.userId).select("-password");

	if (!user) {
		return res.status(404).json({ message: "User not found" });
	}

	req.user = user;
	next();
});

module.exports = { authorization };
