// const customers = require('../models/customer')
const User = require('../models/user')
const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
class AuthController {
    //GET /news
    login(req, res) {
        res.render("auth/login")
    }
    
    async handleLogin(req, res) {
        try {
            const formData = req.body
            const user = await User.findOne({ email: formData.email});
            console.log(user);
            if (user && bcrypt.compareSync(formData.password, user.password)) {
                const token = jwt.sign({ user }, process.env.TOKEN_SECRET_KEY);
                res.cookie('token', token); // Sử dụng res.cookie để lưu trữ token
                // Set success flash message
                req.flash('success', 'Successfull login.');
                return res.redirect('/'); 
            } else {
                return res.redirect('/login?error=Username+or+password+is+incorrect');
            }


        } catch (error) {
            res.redirect(`/login?error=${error}`);
        }
    }



    signup(req, res) {
        res.render("auth/signup")
    }

    //POST
    async handleSignup(req,res) {
        try {
            // Extract data from the request body
            const { full_name, email, password, phone, gender, dob } = req.body;
        
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
              return res.status(400).json({ message: 'User already exists' });
            }
        
            // Hash the password
            const hashedPassword = await bcrypt.hash(password, 10);
        
            // Create a new user instance
            const newUser = new User({
              full_name,
              email,
              password: hashedPassword,
              phone,
              gender,
              dob
            });
        
            // Save the new user to the database
            await newUser.save();
        
            // Redirect to the login page after successful sign-up
            res.redirect('/auth/login');
          } catch (error) {
            // Handle errors
            console.error('Error creating user:', error);
            res.status(500).json({ message: 'Internal server error' });
          }
    }

}


module.exports = new AuthController();
