const fs = require('fs');
var Async = require('async')
var _ = require('underscore');
var bcrypt = require('bcrypt-nodejs');
const saltRounds = 10;
const Auth = require('../models/authenticate.js');



module.exports = {


    create: (req, res) => {
        console.log("Creating Profile APi ");
        if (req.body.name == "" || req.body.email == "" || req.body.password == "")
            return res.send({
                statusCode: 400,
                message: "Bad Request"
            })
        bcrypt.genSalt(saltRounds, function(err, salt) {
            bcrypt.hash(req.body.password, salt, null, function(err, hash) {
                if (err) return res.send({
                    status: 400,
                    message: "error to get password hash"
                });
                req.body["password"] = hash;
                Auth.create(req.body)
                    .then(success => {
                        return res.send({
                            statusCode: 200,
                            message: "Profile created Successfully"
                        })
                    })
                    .catch(error => {
                        return res.send({
                            statusCode: 500,
                            error: error.toString()
                        })
                    })
            })
        })
    },


    login: (req, res) => {
        console.log("login APi ");
        if (!req.body.email || !req.body.password)
            return res.send({
                statusCode: 400,
                message: "Bad Request"
            })
        Auth.findOne({
                email: req.body.email
            })
            .then(result => {
                console.log(result.password);
                if (result == null)
                    return res.send({
                        statusCode: 404,
                        message: "Data not found"
                    })
                bcrypt.compare(req.body.password, result.password, function(err, match) {
                    if (err)
                        return res.send({
                            statusCode: 200,
                            message: "login Successfully."
                        })
                    if (!match)
                        return res.send({
                            statusCode: 400,
                            message: "Please enter correct password"
                        })
                    return res.send({
                        statusCode: 200,
                        message: "login Successfully."
                    })
                })
            })
            .catch(error => {
                return res.send({
                    statusCode: 500,
                    message: "Server Error"
                })
            })
    },


    forget: (req, res) => {
        console.log('Reset');
        Auth.findOne({
            email: req.body.email
        }, function(err, success) {
            if (err) return res.send({
                statusCode: 400,
                message: "Error to find User"
            });
            if (!success) return res.send({
                status: 404,
                message: "Data not found.Please enter registered email!",
            });
            bcrypt.genSalt(saltRounds, function(err, salt) {
                bcrypt.hash(req.body.password, salt, null, function(err, hash) {
                    if (err) return res.send({
                        status: 400,
                        message: "error to get password hash"
                    });
                    else {
                        Auth.updateOne({
                            email: req.body.email
                        }, {
                            $set: {
                                password: hash
                            }
                        }, function(err, result) {
                            if (err) return res.send({
                                status: 400,
                                message: "db failed!"
                            });
                            return res.send({
                                status: 200,
                                message: "Password updated succesfully!"
                            });
                        })
                    }
                })
            });
        })
    },


    reset: (req, res) => {
        Auth.findOne({
            email: req.body.email
        }, function(err, user) {
            if (err) return res.json({
                statusCode: 500,
                message: "Error to find User",
            });
            if (!user) return res.send({
                statusCode: 400,
                message: "Please enter registered email.",
            });
            bcrypt.compare(req.body.oldPassword, user.password, function(err, result) {
                if (err) return res.send({
                    statusCode: 500,
                    message: "Error to match password"
                })
                if (!result) return res.json({
                    statusCode: 400,
                    message: "Please enter correct password."
                })
                bcrypt.genSalt(saltRounds, function(err, salt) {
                    bcrypt.hash(req.body.newpassword, salt, null, function(err, hash) {
                        if (err) return res.send({
                            status: 500,
                            message: "Error to get password hash."
                        });
                        else {
                            Auth.updateOne({
                                email: req.body.email
                            }, {
                                $set: {
                                    password: hash
                                }
                            }, function(err, result) {
                                if (err) return res.send({
                                    status: 400,
                                    message: "db failed!"
                                });
                                return res.send({
                                    statusCode: 200,
                                    message: "Password set succesfully!",
                                });
                            });
                        }
                    });
                });
            });
        });
    }
}
