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
    const image = req.files;

    if (!name || !description || !price || !model) {
        return res.status(400).json({ message: 'All fields are required' });
    }
    console.log(image[0]?.filename, "imagecheck");

    if (name.trim() === '' || description.trim() === '' || model.trim() === '') {
        return res.status(400).json({ message: 'Name, description, and model cannot be empty' });
    }

    try {

        const newVehicle = new Vehicle({
            name,
            description,
            price,
            model,
            image: image[0].filename
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

exports.delVehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const deletedVehicle = await Vehicle.findByIdAndDelete(id);

        if (!deletedVehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        res.status(200).json({ message: 'Vehicle deleted successfully' });
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}

exports.particularvehicle = async (req, res) => {
    try {
        const { id } = req.params;
        const vehicle = await Vehicle.findById(id);

        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        res.status(200).json(vehicle);
    } catch (error) {
        console.error('Error fetching vehicle details:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
}


exports.updatvehicle = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Form Data:', req.body); // Log body fields
        console.log('File:', req.file); // Log the file
        const { name, description, price, model } = req.body;
        console.log(name, description, price, model)
        const files = req.files;

       
        const vehicle = await Vehicle.findById(id);
        if (!vehicle) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        
        const updatedVehicle = {
            name: name || vehicle.name,
            description: description || vehicle.description,
            price: price || vehicle.price,
            model: model || vehicle.model,
            image: files && files.length > 0 ? files[0].path : vehicle.image 
        };

       
        const updated = await Vehicle.findByIdAndUpdate(id, updatedVehicle, { new: true });

        res.status(200).json({ message: 'Vehicle updated successfully', vehicle: updated });
    } catch (error) {
        console.error('Error updating vehicle:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};

exports.adminLogout = async (req, res, next) => {
    try {
        res.cookie('Admintoken', '').json(true);
    }
    catch (err) {
        next(err);
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