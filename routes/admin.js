const { response } = require('express');
var express = require('express');
const { render } = require('../app');
var router = express.Router();
const viedoHelper = require('../helpers/video-helpers');
const { route } = require('./user');

/* GET users listing. */
let AdminsignupErr = null
let editErr = null

router.get('/', function (req, res, next) {
    let admin = req.session.admin
    if (admin) {
        viedoHelper.getAllviedo().then((products) => {
            res.render('admin/view-products', { admin: true, products });
        })
    } else {
        res.render('admin/admin-login', { login: true })
    }
});


router.get('/login', (req, res) => {
    let admin = req.session.admin
    if (admin) {
        res.redirect('/')
    } else {
        res.render('admin/admin-login', { login: true, loginErr })
    }
    loginErr = null;
})


router.get('/add-video', function (req, res) {
    let admin = req.session.admin
    if (admin) {
        res.render('admin/add-video', { admin: true })
    } else {
        res.redirect('/')
    }
})


router.post('/add-video', function (req, res) {
    viedoHelper.addvideo(req.body, (id) => {
        let image = req.files.Image
        image.mv('./public/movie-img/' + id + '.jpg', (err, done) => {
            if (!err) {
                res.redirect('/admin')
            } else {
                console.log(err);
            }
        })

    })
})
router.get('/delete-product/:id', function (req, res) {
    let productId = req.params.id
    viedoHelper.deletproduct(productId).then((response) => {
        res.redirect('/admin')
    })
})

router.get('/edit-product/:id', async function (req, res) {
    let product = await viedoHelper.getproductDetails(req.params.id)
    res.render("admin/edit-product", { admin: true, product })
})

router.post('/edit-product/:id', (req, res) => {
    let id = req.params.id
    viedoHelper.UpdateProduct(req.params.id, req.body).then(() => {
        res.redirect('/admin')
        if (req.files.Image) {
            let image = req.files.Image
            image.mv('./public/movie-img/' + id + '.jpg')
        }
    })
})

router.get('/add-admin', (req, res) => {
    let admin = req.session.admin
    if (admin) {
        res.render('admin/add-admin', { admin: true, AdminsignupErr })

    } else {
        res.redirect('/admin')
    }

    AdminsignupErr = null;
})

router.post('/add-admin', (req, res) => {
    viedoHelper.addAdmin(req.body).then((state) => {
        if (state.userExist) {
            AdminsignupErr = '!Email already difined admin!'
            res.redirect('/admin/add-admin')
        } else {
            req.session.admin = state.admin
            req.session.admin = true;
            res.redirect('/admin/Admin-Details')
        }
    })
})




router.get('/logout-1', (req, res) => {
    req.session.destroy()
    res.redirect('/admin')
})

router.get('/User-Details', (req, res) => {
    let admin = req.session.admin
    if (admin) {
        viedoHelper.getAllDetails().then((Details) => {
            res.render("admin/User-Details", { Details, admin: true })
        })
    } else {
        res.redirect('/login')
    }
})

router.get('/movies', (req, res) => {
    let admin = req.session.admin
    if (admin) {
        res.redirect('/admin')
    } else {
        res.redirect('/')
    }

})


router.get('/delete-Details/:id', function (req, res) {
    let DetailsId = req.params.id
    viedoHelper.deleteDetails(DetailsId).then((response) => {
        res.redirect('/admin/User-Details')
    })
})


router.get('/edit-Details/:id', async function (req, res) {
    let admin = req.session.admin
    if (admin) {

        let userData = await viedoHelper.getuserDetails(req.params.id)
        res.render("admin/edit-details", { admin: true, userData, editErr })
    } else {
        res.redirect('/login')
    }
    editErr = null
})


router.post('/edit-Details/:id', (req, res) => {
    viedoHelper.UpdateUserDetails(req.params.id, req.body).then((state) => {
        var id = req.params.id;
        if (state.userExist) {
            editErr = '!Email already difined'
            res.redirect('/admin/edit-Details/' + id)
        } else {
            res.redirect('/admin/User-Details/')
        }
    })
})



router.get('/admin-Details', (req, res) => {
    let admin = req.session.admin
    if (admin) {
        viedoHelper.getAllAdminDetails().then((AdminDetails) => {
            res.render("admin/Admin-Details", { AdminDetails, admin: true })
        })
    } else {

        res.redirect('/login')
    }
})

module.exports = router;
