'use strict';

var path = require('path');
var childProcess = require('child_process');
var gutil = require('gulp-util');
var through = require('through2');
var phantomjs = require('phantomjs');
var binPath = phantomjs.path;

module.exports = function(){
    return through.obj(function (file, enc, cb) {
        
        var childArgs = [
            path.join(__dirname, 'jasmine2-runner.js'),
            file.path
        ];

        if (file.isNull()) {
            this.push(file);
            return cb();
        }

        childProcess.execFile(binPath, childArgs, function(err, stdout, stderr) {
            gutil.log('Start running spec file: ', file.path)
            gutil.log('PhantomJS path: ', binPath);
            console.log(stdout);

            if (stderr !== '') {
                gutil.log('gulp-jasmine2-phantomjs: Failed to open test runner ' + gutil.colors.blue(file.relative));
                gutil.log(gutil.colors.red('error: '), stderr);
                this.emit('error', new gutil.PluginError('gulp-jasmine2-phantomjs', stderr));
            }

            if (err !== null) {
                gutil.log('gulp-jasmine2-phantomjs: ' + gutil.colors.red("✖ ") + 'Assertions failed in ' + gutil.colors.blue(file.relative));
                this.emit('error', new gutil.PluginError('gulp-jasmine2-phantomjs', err));
            }

            this.push(file);

            return cb();
        }.bind(this));
    });
};
