var User = require('../models/home');
// var request = require('request');
var request = require('request-promise');

exports.countUser = async (req, res) => {

    var countUser = await User.count({});

    return countUser;

}


// ====================================== GET API VIDEO YOUTUBE FORM API ====================== //


exports.getListVideo = async (idChannel) => {

     // var options = {
     //     method : 'GET' ,
     //     uri : 'https://www.googleapis.com/youtube/v3/search?part=snippet&channelId='+idChannel+'&maxResults=50&type=video&order=date&key=AIzaSyALALo5-YW-b5sQBM56e1fEqAOl90zAlPY',
     //     json :true
     // };

     // var data = request(options);

     //    return data;
 var a = [];
 var url = 'https://www.googleapis.com/youtube/v3/search?part=snippet&channelId='+idChannel+'&maxResults=50&type=video&order=date&key=AIzaSyALALo5-YW-b5sQBM56e1fEqAOl90zAlPY';   
 async function getItems(url, token = '') {
        await request(url + "&pageToken=" + token, {
            json: true
        }, function (error, response, body) {
            if (body.hasOwnProperty('nextPageToken')) {
                token = body.nextPageToken;
                a.push(body.items);
                getItems(url, token);
    
            } else {
                a.push(body.items);
                return body.items;
            }
            return a;
        });
    }
    getItems(url);

    
		

}

