const express = require('express');
const router = express.Router();
const path = require('path');
const multer = require('multer');
const admincontroller = require("../../controller/adminController/adminController");
const verify = require("../../middleware/adminMiddleware")

// router.post("/register", admincontroller.adminRegister);

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads');
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + Date.now() + ".jpg");
    },
});

const upload = multer({ storage: storage });

router.post("/login", admincontroller.adminLogin);

router.get("/profile", verify, admincontroller.admindetails);

router.post('/vehicles', verify, upload.array('image', 1), admincontroller.adminAddvehicle);

router.delete('/deletevehicle/:id', verify, admincontroller.delVehicle)

router.get('/vehicles', admincontroller.getVehicle);

router.get('/editvehicle/:id', admincontroller.particularvehicle);

router.patch('/updatevehicle/:id', upload.array('image', 1), admincontroller.updatvehicle);

router.get('/logout', admincontroller.adminLogout)

module.exports = router;

module.exports = router;