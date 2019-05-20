const express = require('express');
const router = express.Router();
const User = require('../../models/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signIn', (req, res) => {

    const Email = req.body.email;
    const Password = req.body.password;

    return User.findOne({ email: Email })
        .then(user => {

            if (user) {

                return bcrypt.compare(Password, user.password)
                    .then(handlePassword => {

                        if (handlePassword) {


                            const token = jwt.sign(
                                {
                                    name : user.name,
                                    email: user.email,
                                    userId: user._id    
                                },
                                'jwtSecret',
                                { expiresIn: 3600 }
                            )

                            return res.status(200).json({
                                token: token,
                                msg: 'sucessful',
                                user: {

                                    id: user._id,
                                    name: user.name,
                                    email: user.email

                                }
                            })
                        }
                        return res.status(404).json({

                            msg: "Invalid Password, Please Enter Again"
                        })
                    })
            }
            return res.status(400).json({

                msg: 'Invalid Email .Please Enter Again!'

            })


        })
})
router.get('/', (req, res) => {


    User.find()
        .select('name email date password')
        .sort({ date: -1 })
        .then(users => {
            res.status(200).json({
                dataUsers: users
            })
        })
        .catch(err => {
            res.status(500).json({
                message: err
            })


        })
})
router.post('/signUp', (req, res) => {

    const Name = req.body.name;
    const Email = req.body.email;
    const Password = req.body.password;

    // Simple Validation 
    if (!Name || !Email || !Password) {

        return res.status(400).json({ msg: 'Please enter all fields' });

    }
    // Check for Existing User

    User.findOne({ email: Email })
        .then(user => {

            if (user) {

                return res.status(400).json({ msg: 'Email Already Exist' });
            }
            return bcrypt.hash(Password, 12)
                .then(handlePassword => {
                    if (handlePassword) {

                        const user = new User({
                            name: Name,
                            email: Email,
                            password: handlePassword
                        })
                        return user.save()
                            .then(() => {
                                res.status(201).json({
                                    msg: "sucessful"
                                })

                            })
                            .catch(err => {

                                res.status(500).json({

                                    error: err

                                })


                            })

                    }
                    return res.status(404).redirect('/SignUp');
                })
                .catch(err => {

                    res.status(500).json({

                        msg: err

                    })
                })


        })
})
module.exports = router






