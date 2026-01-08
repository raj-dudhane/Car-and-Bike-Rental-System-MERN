const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// User Registration
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        await User.create({ name, email, password: hashedPassword });
        res.status(201).json({ message: "User Registered Successfully" });
    } catch (err) { res.status(400).json({ error: "Email already exists" }); }
};

// User Login
exports.login = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user || !(await bcrypt.compare(req.body.password, user.password))) {
            return res.status(400).json({ error: "Invalid Credentials" });
        }
        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET);
        res.json({ token, user: { name: user.name, role: user.role } });
    } catch (err) { res.status(500).json({ error: "Server Error" }); }
};



exports.getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        
        if (!user) return res.status(404).json({ error: "User not found" });
        res.json(user);
    } catch (err) {
        
        res.status(500).json({ error: "Server Error" });
    }
};




exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Don't show passwords
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: "Server Error" });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Failed to delete user" });
    }
};