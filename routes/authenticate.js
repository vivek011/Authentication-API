var express = require('express');
var Authenticate = require('../controllers/authenticate.js');
var router = express.Router();


router.post('/create',Authenticate.create);
router.post('/login',Authenticate.login);
router.post('/reset',Authenticate.reset);
router.post('/forget',Authenticate.forget);



module.exports = router;
