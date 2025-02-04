const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require('./config');

const authMiddleware = (req, res, next) => {

    const authHeader = req.headers.authorization;
    console.log(authHeader);
    console.log(authHeader.split(' ')[1]);
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status().json({ msg: "error in bearer" });
    }

    const token = authHeader.split(' ')[1];

    try {
        const decodedToken = jwt.verify(token, JWT_SECRET);
        console.log(decodedToken);
        if (decodedToken) {
            req.userId = decodedToken.userId;
            console.log("inside if")
            next();
        }
        else {
            res.status(403).json({})
        }
    } catch (err) {
        console.log("inside err", err);
        res.status(403).json({})
    }
}

module.exports = {
    authMiddleware
}