const mongoose = require('mongoose')
const { Schema } = mongoose;

const AdminSchema = new Schema({
    name: String,
    email: { type: String, unique: true },
    password: String,
}, {
    timestamps: true
});

const Admin = mongoose.model('Admin', AdminSchema);
module.exports = Admin;
