/**
 * Created by rossg on 11/13/2018.
 */
const express = require('express');
const app = express();
const http = require('http');

app.get('/color-theme', getColorTheme);

function getColorTheme(req, res) {
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
}

const port = process.env.port || 3000;
app.listen(port);