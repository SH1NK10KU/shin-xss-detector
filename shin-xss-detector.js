/**
 * Shin XSS Detector
 *
 * ### Introduction ###
 * A web security tool for detecting XSS based on PhantomJS (a headless WebKit scriptable with JavaScript).
 *
 * ### Function ###
 * Aim on Reflect XSS recently.
 *
 * @author Shin Feng
 * @version 0.0.1-SNAPSHOT
 *
 */
var sys = require("system"),
    page = require("webpage").create(),
    fs = require("fs"),
    // async = require("async"),
    util = require("./util.js");
var payloads = [],
    numOfPayload = 0,
    isAlert = false;
page.onAlert = function() {
    isAlert = true;
};

function setEncoding(encoding) {
    encoding = encoding || "UTF-8";
    phantom.outputEncoding = encoding;
}

function addCookie(cookieTxt) {
    cookieTxt = cookieTxt || "cookie.txt";
    try {
        var cookieFile = fs.open(cookieTxt, "r");
        var cookies = cookieFile.read().split(";\r\n");
        cookieFile.close();
        for (var cookie in cookies) {
            phantom.addCookie(JSON.parse(cookies[cookie]));
        }
    } catch (e) {
        console.log("Unable to read cookie file!");
        phantom.exit(1);
    }
}

function loadPayload(payloadTxt) {
    payloadTxt = payloadTxt || "payload.txt";
    try {
        var payloadFile = fs.open(payloadTxt, "r");
        var payloads = payloadFile.read().split("\r\n");
        payloadFile.close();
        return payloads;
    } catch (e) {
        console.log("Unable to read payload file!");
        phantom.exit(1);
    }
}

function xssURL(url, payload) {
    page.open(url + payload);
    page.onLoadFinished = function(status) {
        if (status !== "success") {
            console.log("Unable to access network!");
            phantom.exit(1);
        } else {
            util.wait();
            result = {
                "url": url,
                "payload": payload,
                "xss": isAlert
            }
            if (isAlert) {
                console.log("URL:   " + url);
                console.log("Payload: " + payload);
                console.log("XSS:   " + isAlert);
                phantom.exit(0);
            } else {
                console.log(JSON.stringify(result));
                phantom.exit(0);
            }
        }
    };
}
if (sys.args.length === 3) {
    url = sys.args[1];
    payload = sys.args[2];
} else {
    console.log("Please input the command like 'phantomjs shin-xss-detector.js url payload'!");
    phantom.exit(1);
}
console.log("### Initialize the encoding ###");
setEncoding();
console.log(phantom.outputEncoding);
console.log("### Initialize the cookies ###");
addCookie();
console.log(JSON.stringify(phantom.cookies));
console.log("### Load payload ###");
payloads = loadPayload();
numOfPayload = payloads.length;
console.log("Number of payload: " + numOfPayload);
console.log("### Print the result ###");
xssURL(url, payload);
// var tasks = [];
// for (var payload in payloads) {
// 	var task = function (callback) {
// 		xssURL(url, payloads[payload], callback);
// 	};
// 	tasks.push(task);
// }
// async.series(
//     tasks, function (err, result) {
//         console.log(result);
//     }
// );