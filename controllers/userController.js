const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const User = require('../models/userModel');

const registerUser = async (req, res) => {
    try {
        //get the username & password from the req.body
        const { username, password } = req.body;

        //check if the username is unique
        const uniqueCheck = await User.findOne({ username });
        if (uniqueCheck) {
            return res.status(403).json('Username already exists');
        }

        //hash password
        const salt = await bcrypt.genSalt(10);
        const hash = await bcrypt.hash(password, salt);

        //check all fields are filled
        if (!username || !password) {
            res.status(400).json('Please fill in all fields');
        } else {
            //create user with username & password that is assigned to the hash version of it
            const user = await User.create({ username, password: hash });
            //generate a token based off the user's id & username
            const token = generateToken(user._id, user.username); 
            res.status(201).json({ user, token });
        }        
    } catch (error) {
        res.status(500).json({ error: 'Problem registering user' }); 
        console.error(error);       
    }
}

const loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        //find an user based off their username
        const user = await User.findOne({ username });
        //check if all fields are filled in 
        if (!username || !password) {
            return res.status(400).json('Please fill in all fields')
        } 
        //compare the submitted password with the user's password
        const compare = await bcrypt.compare(password, user.password);
        if (!compare) {
            return res.status(401).json('Invalid credentials');
        }
        //if user not found throw a 404        
        if (!user) {
            res.status(404).json('Problem finding user');
        } else {
            //if user found, generate a token & return the user
            const token = generateToken(user._id, user.username);
            res.status(201).json({ user, token });
        }
    } catch (error) {
        res.status(500).json({ error: 'Problem logging in' });
    }

}

//function for token
function generateToken(_id, username) {
    const secret = process.env.JWT_SECRET;
    return jwt.sign({ _id, username }, secret, { expiresIn: '8h' });
}

module.exports = { registerUser, loginUser };