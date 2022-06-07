var http = require('http');
let apiurl: 'http://localhost:3000';
const requestModule = require('request')

const httpGet = (url) => {
    return new Promise((resolve, reject) => {
        http.get(url, res => {
            res.setEncoding('utf8');
            let body = [];
            res.on('data', chunk => body.push(chunk));
            res.on('end', () => resolve(body));
        }).on('error', reject);
    });
}


function insert(url, data) {
    // console.log(data)
    return requestModule.post(environment.apiurl + url, {
        json: data,
        method: "POST",
        headers: { "Content-Type": "application/json" },
    });
}



function update(url, data) {
    // console.log(data)
    return requestModule.put(environment.apiurl + url, {
        json: data,
        method: "PUT"
    });
}

async function getWithBody(url, data) {

    var request = require('request');
    var options = {
        uri: environment.apiurl + url,
        body: data,
        json: true
    }
    return new Promise(function (resolve, reject) {
        request.post(options, function (err, resp, body) {
            console.log(resp.statusCode);
            if (err) {
                console.log(err.message);
                reject(err);
            } else {
                console.log(body);
                if (resp.statusCode == 200) {
                    resolve(body);
                }
                else {
                    resolve(body);
                }
            }
        });

    });
}

export default {
    httpGet,
    getWithBody,
    apiurl,
    insert,
    update
}
export const environment = {
    apiurl: 'http://localhost:3000'
}