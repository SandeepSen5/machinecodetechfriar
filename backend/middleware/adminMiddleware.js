const jwt = require('jsonwebtoken');


const verifyToken = async (req, res, next) => {
    const { Admintoken } = req.cookies;
    console.log(Admintoken, "Admintoken");
    if (!Admintoken) return next(createError(401, "User Not Registered"));
    jwt.verify(Admintoken, process.env.ADMIN_JWTSECRET, {}, async (err, adminData) => {
        if (err) return next(createError(401, 'Token not valid'));
        req.name = adminData.name;
        req.Email = adminData.email;
        next();
    })
}


module.exports = verifyToken;

