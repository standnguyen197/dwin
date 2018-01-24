var express = require('express');
var moment = require('moment');
var app = express();
var multer = require('multer')
var constants = require('constants');
var constant = require('./config/constants');
var port = process.env.PORT || 3000;

var mongoose = require('mongoose');
var passport = require('passport');
var flash = require('connect-flash');
var path = require('path');

var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var bodyParser = require('body-parser');

// Đếm thành viên từ baseController.js

var baseController = require('./app/controllers/baseController');
const ytdl = require('ytdl-core');
const {
    getInfo
} = require('ytdl-getinfo');
var moment = require('moment');
var ProgressBar = require('progress');
var bar;
var fs = require('fs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

// Socket IO
var server = require("http").Server(app);
var io = require("socket.io")(server);
server.listen(port);

app._io = io;

/***************Mongodb configuratrion********************/
var mongoose = require('mongoose');
var configDB = require('./config/database.js');
//configuration ===============================================================
mongoose.connect(configDB.url); // connect to our database


require('./config/passport')(passport); // pass passport for configuration

//set up our express application
app.use(morgan('dev')); // log every request to the console
app.use(cookieParser()); // read cookies (needed for auth)
//app.use(bodyParser()); // get information from html forms

//view engine setup
app.use(express.static(path.join(__dirname, 'public')));
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'ejs');
//app.set('view engine', 'ejs'); // set up ejs for templating


//required for passport
//app.use(session({ secret: 'iloveyoudear...' })); // session secret

app.use(session({
    secret: 'I Love India...',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session()); // persistent login sessions
app.use(flash()); // use connect-flash for flash messages stored in session

// routes ======================================================================
require('./config/routes.js')(app, passport); // load our routes and pass in our app and fully configured passport


//launch ======================================================================
console.log('Open website port ' + port);

// Bắt sự kiện SOCKET IO
io.on('connection', function(socket) {
    // Lấy danh sách video từ Channel
    socket.on('admin-send-server-listVideoChannelYoutube', function(dataSocket) {

        var idChannel = dataSocket.data;

        baseController.getListVideo(idChannel).then(dataChannel => {
            var nameVideo = dataChannel.items[0].snippet.title;
            var totalVideo = dataChannel.pageInfo.totalResults;

            socket.emit('server-send-admin-totalVideo', {
                data: totalVideo

            });
            var a = dataChannel.items;

            var hihi = a.filter(checkData);
            function checkData(idYoutube) {
                return idYoutube.id.kind == 'youtube#video';
                 }

            var download = (url, dest) =>{

                var linkVideo = 'https://www.youtube.com/watch?v=' + url.id.videoId;
                return new Promise((resolve , reject) => {

                getInfo(linkVideo).then(async (info) => {
                    ytdl(linkVideo)
                     .on('response', function(res) {
                            bar = new ProgressBar('Downloading [:bar] :percent :etas', {
                                complete: String.fromCharCode(0x2588),
                                total: parseInt(res.headers['content-length'], 10)
                            });
                        })
                        .on('data', function(data) {
                           
                            bar.tick(data.length);
                        })
                   .pipe(fs.createWriteStream('upload/' + info.items[0]._filename))
                        .on('close', function() {
                            console.log('Create File done!');
                            // Bắt sự kiện SOCKET IO
                        return resolve(true);
                        })

                }).catch(err => {
                    return console.log(err);
                });
                });
            }

            var i = 0;

            let mainDownload = async (arr) => {


                for (let value of arr){
                i++;

                    console.log('ID File : ' + value.id.videoId);

                     socket.emit('server-send-admin-infoVideo', {
                                data: value.snippet.title,
                                countVideo : i
                            });

                    await download(value , value.id.videoId);
                    console.log('==========================================================');
                    
                }

                console.log('Download complete!');
                socket.emit('server-send-admin-statusVideo');
            }

            mainDownload(a);

        });

    });

    // lấy dữ liệu từ listUser emit lên server để xem dữ liệu
    socket.on('admin-send-server-viewInfo', function(data) {
        // Gửi lại dữ liệu trở về!
        var idUser = data.info;
        // Lấy dữ liệu từ caseController.listUser
        baseController.listUser(idUser).then(dataUser => {
            // Gửi quay lại client của Admin


            socket.emit('server-send-admin-viewInfo', {
                info: dataUser
            });

        }).catch(err => {
            return console.log(err);
        });


    });


});


//catch 404 and forward to error handler
app.use(function(req, res, next) {
    res.status(404).render('404', {
        title: "Xin lỗi , Không tìm thấy trang!",
        session: req.sessionbo
    });
});

app.use(function(req, res, next) {
    res.status(500).render('404', {
        title: "Xin lỗi , Không tìm thấy trang!"
    });
});
exports = module.exports = app;