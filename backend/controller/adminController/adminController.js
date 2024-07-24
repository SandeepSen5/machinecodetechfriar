const express = require("express");
const bcrypt = require('bcryptjs')
const bcryptSalt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken');
const Admin = require('../../models/adminModel');
const Vehicle = require("../../models/vehicleModel")


exports.adminLogin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const AdminDoc = await Admin.findOne({ email });

        if (!AdminDoc) {
            return res.status(400).json({ message: "Incorrect Email Entered" });
        }

        const passok = bcrypt.compareSync(password, AdminDoc.password);
        if (passok) {
            jwt.sign(
                { email: AdminDoc.email, name: AdminDoc.name, id: AdminDoc._id },
                process.env.ADMIN_JWTSECRET,
                {},
                (err, token) => {
                    if (err) {
                        return res.status(400).json({ message: "Error generating token" });
                    }
                    return res.cookie('Admintoken', token).json(AdminDoc);
                }
            );
        } else {
            return res.status(400).json({ message: "Incorrect Password Entered" });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error" });
    }
};

exports.admindetails = async (req, res) => {
    try {
        let admin = {
            name: req.name,
            email: req.Email
        }
        return res.status(200).json(admin);
    }
    catch (error) {
        console.log(error)
    }
}


exports.adminAddvehicle = async (req, res) => {
    const { name, description, price, model } = req.body;
    const image = req.file;
    
    if (!name || !description || !price || !model) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    
    if (name.trim() === '' || description.trim() === '' || model.trim() === '') {
        return res.status(400).json({ message: 'Name, description, and model cannot be empty' });
    }

    try {
        
        const newVehicle = new Vehicle({
            name,
            description,
            price,
            model,
            image: image ? image.path : null 
        });

    
        await newVehicle.save();

        res.status(200).json({ message: 'Vehicle added successfully', vehicle: newVehicle });
    } catch (error) {
        console.error('Error adding vehicle:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.getVehicle = async (req, res) => {
    try {
        const vehicles = await Vehicle.find();
        res.status(200).json(vehicles);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Internal server error" });
    }
}

// exports.adminLogin = async (req, res, next) => {
//     try {
//         const { name, email, password } = req.body;
//         console.log(name, email, password);
//         // const existingUser = await User.findOne({ email });
//         // if (existingUser) {
//         //     return next(createError(400, "User already registered"))
//         // }
//         const newUser = await Admin.create({
//             name,
//             email,
//             password: bcrypt.hashSync(password, bcryptSalt)
//         });
//         res.status(200).json(newUser);
//     } catch (err) {
//         next(err);
//     }
// }