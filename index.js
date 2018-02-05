// Script path provided when executing PhantomJS, should be relative to the working directory
var relativeScriptPath = require('system').args[0];
	
var fs = require('fs');
var absoluteScriptPath = fs.absolute(relativeScriptPath);
var absoluteScriptDir = absoluteScriptPath.substring(0, absoluteScriptPath.lastIndexOf('/'));

var url = "file:///" + absoluteScriptDir + "/index.html";
var delayMs = 5000;

console.log(url);

var page = require('webpage').create();
var onError = function (err) {
    console.log(err);
};

page.onError = function (err) {
    console.log(JSON.stringify(err));
};

page.onResourceError = function (err) {
    console.log(JSON.stringify(err));
};

page.onConsoleMessage = function (message) {
    console.log(message);
};

page.onLoadFinished = function(status) {
  console.log('onLoadFinished: ' + status);
};

page.onResourceRequested = function(requestData, networkRequest) {
  console.log('Request (#' + requestData.id + '): ' + JSON.stringify(requestData));
};

try {
    page.viewportSize = { width: 1950, height: 1200 };
    page.open(url, function (status) {
        if (status === "success") {


            page.evaluate(function () {
                 window.addEventListener("load", function(event) {
                    console.log("All resources finished loading!");
                });
            });

            setTimeout(function () {
                page.render('screenshot.png');
                phantom.exit();
            }, delayMs);

        } else {
            console.log('status');
            phantom.exit();
        }
    });
} catch (err) {
    onError(err);
}
