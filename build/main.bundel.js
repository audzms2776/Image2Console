'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var getPixels = require("get-pixels");
var chalk = require('chalk');
var sharp = require('sharp');
var async = require('async');

var log = console.log;
var error = chalk.bold.red;

var x = process.stdout.columns;
var y = process.stdout.rows;

var ConsoleImg = function () {
    function ConsoleImg(path) {
        _classCallCheck(this, ConsoleImg);

        this.path = path;
        this.tmp = 'tmp1.jpg';
        this.tmp2 = 'tmp2.jpg';
    }

    _createClass(ConsoleImg, [{
        key: 'bgMake',
        value: function bgMake() {
            var _this = this;

            return sharp(this.path).background('black').toFile(this.tmp, function (err, info) {
                if (err) {
                    return log(error(err));
                }

                return _this.piexelSizeCheck(_this.tmp);
            });
        }
    }, {
        key: 'piexelSizeCheck',
        value: function piexelSizeCheck(imgPath) {
            var _this2 = this;

            return getPixels(imgPath, function (err, pixels) {
                if (err) {
                    log(error("Bad image path1"));
                    return log(error(err));
                }

                x > pixels.shape.slice()[0] ? _this2.resizingF(imgPath, pixels.shape.slice()[0]) : _this2.resizingF(imgPath, x);
            });
        }
    }, {
        key: 'resizingF',
        value: function resizingF(path, size) {
            var _this3 = this;

            return sharp(path).resize(size).toFile(this.tmp2, function (err, info) {
                if (err) {
                    return log(error(err));
                }

                return _this3.consoleFrame(_this3.tmp2);
            });
        }
    }, {
        key: 'consoleFrame',
        value: function consoleFrame(tmp) {
            return getPixels(tmp, function (err, pixels) {
                if (err) {
                    log(error("Bad image path2"));
                    return;
                }

                var imgSize = pixels.shape.slice(); // [0]: 가로 [1]: 세로
                var pixelData = {};

                for (var i = 0; i < imgSize[1]; i++) {
                    pixelData[i] = [];
                    var f = [];

                    for (var j = 0; j < imgSize[0]; j++) {
                        var obj = {
                            r: pixels.get(j, i, 0),
                            g: pixels.get(j, i, 1),
                            b: pixels.get(j, i, 2)
                        };

                        pixelData[i].push(obj);
                        f.push(chalk.bgRgb(obj['r'], obj['g'], obj['b'])(' '));
                    }

                    log(f.reduce(function (x, y) {
                        return x + y;
                    }));
                }
            });
        }
    }]);

    return ConsoleImg;
}();

async.map(process.argv.slice(2), function (v) {
    return new ConsoleImg(v).bgMake();
}, function (err, results) {
    log(error(err));
    log(error(results));
});
