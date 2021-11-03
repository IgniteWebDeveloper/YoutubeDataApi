var express = require('express');
var router = express.Router();
const videoSchema = require('./users');
const axios = require('axios');

/* GET home page. */
router.get('/', function(req, res){
  axios({
    method: 'get',
    url: 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&order=date&q=website&key=AIzaSyBwrkYvURgBBaFY2XCM9xIF7iQ_qUOGxxs',
  }).then(function (response) {
    const videoData = new videoSchema({
      videoData: response.data.items
    })
    videoData.save()
    // console.log(response.data.items)
  });
  res.render('index')
});

//  below route is to fetch saved video data in paginated format and show it on frontend

router.get('/Data/:page', function (req, res) {
  var perpage = 1;
  var page = Math.max(0, req.params.page);
  videoSchema.find()
  .limit(perpage)
  .skip(perpage*page)
  .exec(function(err,Data){
    videoSchema.count().exec(function(err,count){
      var pages = count / perpage 
      // below process is done to destructure the Data
      const array = Data.map(x => x.videoData).flat(1)    

      const isExist = (key, value, a) => {
        return a.find(item => item[key] == value)
      }
        
      let a = array.reduce((acc, curr) => {
        if (!isExist('kind', curr.key, acc)) {
          acc.push(curr)
        }
        return acc
      }, [])
      // end of destructuring
      res.render('Data', {a, pages: pages});
    })
    })
})

// Below is axios npm to send continuous request in time interval of 10 seconds and save the coming data into database

function intervalFunc() {
  axios({
    method: 'get',
    url: 'https://youtube.googleapis.com/youtube/v3/search?part=snippet&order=date&q=sports%2C%20news%2C%20official&key=AIzaSyBTpU6op2p3sak-GATeCHGL3ORgwaJ_oAg',
  }).then(function (response) {
    const videoData = new videoSchema({
      videoData: response.data.items
    })
    videoData.save()
    // console.log(response.data.items)
  });
}
      
setInterval(intervalFunc, 25000);

module.exports = router;
