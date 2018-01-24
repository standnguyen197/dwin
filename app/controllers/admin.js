// Load model dùng!
var User = require('../models/home');
const ytdl = require('ytdl-core');
var baseController = require('./baseController');
const {
    getInfo
} = require('ytdl-getinfo');
var moment = require('moment');
var ProgressBar = require('progress');
var bar;
var flash = require('connect-flash');
var dateFormat = require('dateformat');
var fs = require('fs');
// SOCKET


exports.goAdmin = async (req, res) => {

    if (req.session.user.role_id == '1') {

        return res.redirect('/go');

    } else {


        return res.render('admin/home', {
            footer_name: 'YTPowerVN.Com',
            error: req.flash("error"),
            success: req.flash("success"),
            title: 'QUẢN LÝ' + req.session.user.name + ' MANAGE',
            session: req.session,

        });

    }

}



// ====================================== QUẢN LÝ KÊNH ==================================== //

exports.manageChannel = async (req, res) => {

    if (req.session.user.role_id == '1') {

        return res.redirect('/go');

    } else {


        return res.render('admin/manage-channel', {
            footer_name: 'YTPowerVN.Com',
            error: req.flash("error"),
            success: req.flash("success"),
            title: 'QUẢN LÝ KÊNH : ' + req.session.user.name + ' MANAGE',
            session: req.session,

        });

    }

}

// ================================ QUẢN LÝ REUP ========================================== 


exports.manageReup = async (req, res) => {

    if (req.session.user.role_id == '1') {

        return res.redirect('/go');

    } else {

        return res.render('admin/manage-reup', {
            footer_name: 'YTPowerVN.Com',
            error: req.flash("error"),
            success: req.flash("success"),
            title: 'QUẢN LÝ REUP : ' + req.session.user.name + ' MANAGE',
            session: req.session,

        });

    }

}

// exports.manageReupDownload = async (req, res) => {

//     if (req.session.user.role_id == '1') {

//         return res.redirect('/go');

//     } else {
    	
//           var linkVideo = req.body.idYoutube;

          


//     }

// }
//================================== KIỂM TRA CÓ SESSION ĐĂNG NHẬP =========================== //
exports.loggedIn = function(req, res, next) {

    if (req.session.user) { // req.session.passport._id

        next();

    } else {

        res.redirect('/login');

    }

}