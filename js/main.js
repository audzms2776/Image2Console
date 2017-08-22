'use strict'

const getPixels = require("get-pixels")
const chalk = require('chalk');
const sharp = require('sharp');
const async = require('async');

const log = console.log;
const error = chalk.bold.red;

const x = process.stdout.columns;
const y = process.stdout.rows;

class ConsoleImg {

    constructor(path) {
        this.path = path;
        this.tmp = 'tmp1.jpg';
        this.tmp2 = 'tmp2.jpg';
    }

    bgMake() {
        return sharp(this.path)
            .background('black')
            .toFile(this.tmp, (err, info) => {
                if (err) {
                    return log(error(err));
                }

                return this.piexelSizeCheck(this.tmp);
            })
    }

    piexelSizeCheck(imgPath) {
        return getPixels(imgPath, (err, pixels) => {
            if (err) {
                log(error("Bad image path1"));
                return log(error(err));
            }

            x > pixels.shape.slice()[0] ? this.resizingF(imgPath, pixels.shape.slice()[0]) : this.resizingF(imgPath, x);
        })
    }

    resizingF(path, size) {
        return sharp(path)
            .resize(size)
            .toFile(this.tmp2, (err, info) => {
                if (err) {
                    return log(error(err));
                }

                return this.consoleFrame(this.tmp2);
            });
    }

    consoleFrame(tmp) {
        return getPixels(tmp, (err, pixels) => {
            if (err) {
                log(error("Bad image path2"))
                return
            }

            const imgSize = pixels.shape.slice(); // [0]: 가로 [1]: 세로
            const pixelData = {};

            for (let i = 0; i < imgSize[1]; i++) {
                pixelData[i] = [];
                const f = [];

                for (let j = 0; j < imgSize[0]; j++) {
                    const obj = {
                        r: pixels.get(j, i, 0),
                        g: pixels.get(j, i, 1),
                        b: pixels.get(j, i, 2)
                    }

                    pixelData[i].push(obj);
                    f.push(chalk.bgRgb(obj['r'], obj['g'], obj['b'])(' '));
                }

                log(f.reduce((x, y) => x + y));
            }
        })
    }
}

async.map(process.argv.slice(2), v => new ConsoleImg(v).bgMake(), (err, results) => {
    log(error(err));
    log(error(results));
});

