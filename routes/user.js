var express = require('express');
var router = express.Router();
const viedoHelper = require('../helpers/video-helpers')
const userHelper = require('../helpers/user-helpers')
const { response } = require('../app');

/* GET home page. */
let signupErr = null
let loginErr = null
router.get('/', function (req, res, next) {
    let user = req.session.user
    viedoHelper.getAllviedo().then((products) => {
        res.render('user/view-products', { products, user });
    })
});

router.get('/login', (req, res) => {
    let user = req.session.user
    if (user) {
        res.redirect('/')
    } else {
        res.render('user/login', {  login: true, loginErr })
    }
    loginErr = null;
})

router.get('/signup', (req, res) => {
    if (req.session.user) {
        res.redirect('/')
    } else {
        res.render('user/signup', { login: true, signupErr })
    }
    signupErr = null;
})

router.post('/signup', (req, res) => {
    userHelper.doSinup(req.body).then((response) => {
        if (response.userExist) {
            signupErr = 'Email already difined !'
            res.redirect('/signup')
        } else {
            req.session.user = response.user
            req.session.user = true;
            res.redirect('/')
        }
    })
})

router.post('/login', (req, res) => {
    userHelper.dologin(req.body).then((response) => {
        if (response.status) {
            if (response.user.type == 'user') {
                req.session.loggedIn = true
                req.session.user = response.user
                res.redirect('/')
            } else {
                req.session.loggedIn = true
                req.session.admin = response.user
                res.redirect('/admin')
            }

        } else {
            loginErr = '!Email or Password is wrong!'
            res.redirect('/login')
        }
    })
})

router.get('/logout', (req, res) => {
    req.session.destroy()
    res.redirect('/')

})
module.exports = router;
