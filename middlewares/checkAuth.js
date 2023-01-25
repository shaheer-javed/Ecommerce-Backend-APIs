require('dotenv').config()
const JWT = require("jsonwebtoken")
// const ExtractJwt = require("passport-jwt").ExtractJwt;
const VALIDATION_TOKEN = process.env.VALIDATION_TOKEN

module.exports = async (req, res, next) => {
    
    if (req.headers.authorization){

        // let token = req.header.authorization.split(' ')[1]
        // const token = String(ExtractJwt.fromAuthHeaderAsBearerToken());
        // console.log(token)

//         const token = req.header("x-auth-token")
        const token = req.headers.authorization;
        if (!token) {
            return res.status(401).json({ msg: "Unable to Auth" })
        }
        try {
            //verify token
            let user = await JWT.verify(token, VALIDATION_TOKEN);
            req.user = user;
            next()
        } catch (err) {
            return res.status(401).json({ msg: "Unable to Auth " + err })
        }
    } else {
        res.status(404).json({ msg: "Unable to Auth" })
    }

}
