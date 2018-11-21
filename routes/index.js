var express = require('express');
var router = express.Router();
var http = require('http');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Ross Grambo' });
});

router.get('/color-theme', function(req, res) {
    const data = JSON.stringify({"model":"default"});

    var post_options = {
        host: 'colormind.io',
        port: '80',
        path: '/api/',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': Buffer.byteLength(data)
        }
    };

    var subReq = http.request(post_options, function(subRes){
        var body = '';

        subRes.on('data', function(chunk){
            body += chunk;
        });

        subRes.on('end', function(){
            var result = JSON.parse(body);
            res.json(result);
        });
    });

    subReq.write(data);
    subReq.end();
});

module.exports = router;
