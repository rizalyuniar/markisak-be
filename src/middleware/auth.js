const jwt = require("jsonwebtoken");
const createError = require("http-errors");

const protect = (req, res, next) => {
    try {
        let token;
        console.log(req.headers);
        if (req.headers.authorization) {
            token = req.headers.authorization.split(" ")[1];
            let decoded = jwt.verify(token, process.env.SECRET_KEY_JWT);
            req.payload = decoded;
            next();
        } else {
            res.json({ message: "server need token" });
        }
    } catch (error) {
        if (error && error.name === "JsonWebTokenError") {
            next(new createError(400, "Token invalid"));
        } else if (error && error.name === "TokenExpiredError") {
            next(new createError(400, "Token expired"));
        } else {
            next(new createError(400, "Token not active"));
        }
    }
};

const isIdValid = (req, res, next) => {
    const payload = req.payload;
    const queryId = req.params.id;
    if (payload) {
        if (payload.id == queryId) {
            next();
        } else {
            res.status(403).json({ message: "Your id did not match" });
        }
    } else {
        res.status(403).json({ message: "Id not found" });
    }
};

module.exports = { protect, isIdValid };
