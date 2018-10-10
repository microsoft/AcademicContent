var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var app = express();
var exec = require("child_process").exec;
var fs = require("fs");

var port = 3003;

app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.text());

app.post('/testImage', function (req, res) {
    fs.readdir("./cntk/", (err, files) => {
        var results = {};
        var testNework = function(file, digit) {
            var cntkline = "|labels ";
            for (var i = 0; i < 10; i++) {
                var label = "0 ";
                if (i == digit) {
                    label = "1 ";
                }
                cntkline += label;
            }

            cntkline += req.body;
            fs.writeFileSync("./mnist/Test-28x28_cntk_text.txt" , cntkline);
			
            exec("cntk configFile=./cntk/" + file + " command=testNetwork", function(error, stdout, stderr) {
                if (!error) {
                    var lines = stderr.split("\n");

                    for (var j = 0; j < lines.length; j++) {
                        if (lines[j].startsWith("Final Results:")) {
                            results[digit] = lines[j];
                        }
                    }

                    if (digit == 9) {
                        var detect = {detected: "Unknown!"};

                        if (results["0"].indexOf("errs =") > 0) {
                            var regex = /(.*errs = )(.*%)(.*)/g;
                            for (var dig in results) {
                                var matchDigitVal = parseFloat(results[dig].replace(regex, "$2"));
                                if (matchDigitVal === 0) {
                                    detect.detected = dig;
                                }
                            }
                            res.json(detect);
                        }
                        else {
                            var regex = /(.*rmse = )(.* )(.*)/g;
                            var val = 99;
                            for (var dig in results) {
                                var matchDigitVal = parseFloat(results[dig].replace(regex, "$2"));
                                if (matchDigitVal < val) {
                                    val = matchDigitVal;
                                    detect.detected = dig;
                                }
                            }
                            res.json(detect);
                        }
                    }
                    else {
                        testNework(file, digit + 1);
                    }							
                }
                else {
                    res.send(stderr);
                }
            });
        };
		
        if (files.length > 0) {
            testNework(files[0], 0);
        }
    });
});

app.listen(port);
console.log("Listening on port " + port);