const jwt = require('jsonwebtoken')

module.exports = (req, res, next) => {
    const token = req.headers.authorization

    if (token) {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if(err){
                res.status(401).json(err);
            } else {
                next()
            }
        })
    } else {
        res.status(401).json('Authorization token required');
    }
}