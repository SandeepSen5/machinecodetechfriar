const jwt = require('jsonwebtoken');

const verifyToken = async (req, res, next) => {
    const { Admintoken } = req.cookies;
    console.log(Admintoken, "Admintoken");
    if (!Admintoken) return res.status(400).json({ message: 'Admin Not Registered' });
    jwt.verify(Admintoken, process.env.ADMIN_JWTSECRET, {}, async (err, adminData) => {
        if (err) return res.status(400).json({ message: 'Token not valid' });
        req.name = adminData.name;
        req.Email = adminData.email;
        next();
    })
}

module.exports = verifyToken;

