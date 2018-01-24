var numeral = require('numeral');
var bcrypt = require('bcrypt-nodejs');
var dateFormat = require('dateformat');

exports.loggedIn = function(req, res, next)
{
	if (req.session.user) { // req.session.passport._id

		next();

	} else {

		res.redirect('/login');

	}

}

exports.go = function(req, res) {

	if (req.session.user.role_id == '2'){

			return res.redirect('/go-admin');

	}else{

		res.render('dashboard/home', {
		title : 'Hello ' + req.session.user.name,
		error : req.flash("error"),
		success: req.flash("success"),
		session:req.session,
	
	 });
	}
	
	 
}


exports.signup = function(req, res) {

	if (req.session.user) {

		res.redirect('/go');

	} else {

		res.render('auth/signup', {
			title : 'Đăng ký tài khoản',
			error : req.flash("error"),
			success: req.flash("success"),
			session:req.session
		});
	}

}


exports.login = function(req, res) {


	
	if (req.session.user) {

		res.redirect('/go');

	} else {

		res.render('auth/login', {
			title : 'Đăng nhập tài khoản Zmax.Online',
			error : req.flash("error"),
			success: req.flash("success"),
			session:req.session
		});

	}
	
}


    
