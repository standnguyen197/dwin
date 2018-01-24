var home = require('../app/controllers/home');
var admin = require('../app/controllers/admin');
//you can include all your controllers

module.exports = function(app, passport) {

    app.get('/login', home.login)
        .get('/signup', home.signup)
        .get('/', function(req, res) {
            res.render('pi', {
                title: 'Xin chào các bạn',
                content: 'Chào mừng bạn đã đến với Zmax.online'
            });
        })
        .get('/go', home.loggedIn, home.go) //home

        .post('/signup', passport.authenticate('local-signup', {
            successRedirect: '/signup', // redirect to the secure profile section
            failureRedirect: '/signup', // redirect back to the signup page if there is an error
            failureFlash: true // allow flash messages
        }))
        // process the login form
        .post('/login', passport.authenticate('local-login', {
            successRedirect: '/go', // redirect to the secure profile section
            failureRedirect: '/login', // redirect back to the signup page if there is an error
            failureFlash: true // allow flash messages
        }))

        // Đăng xuất

        .get('/logout', function(req, res) {
            req.session.destroy();
            req.logout();
            res.redirect('/');
        })

        // Dành cho admin

        // Trang chủ
        .get('/go-admin', admin.loggedIn, admin.goAdmin)

        // Quản lý tổng các kênh

        .get('/go-admin/manage-channel', admin.loggedIn, admin.manageChannel)

        // Công cụ quản lý reup từ Youtube sang Dailymotion

        .get('/go-admin/manage-reup', admin.loggedIn, admin.manageReup);
}