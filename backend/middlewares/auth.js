const jwt = require('jsonwebtoken');

async function verifyAccessToken(req, res, next) {
    const authHeader = req.headers["authorization"];

    if (!authHeader) {
        return res.status(401).json({ msg: "No token provided" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return res.status(401).json({ msg: "Token missing" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded.user;  
        next();
    } catch (err) {
        console.error("JWT Error:", err.message);
        return res.status(403).json({ msg: "Invalid or expired token" });
    }
}

module.exports = {verifyAccessToken};