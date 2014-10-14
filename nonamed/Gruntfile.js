'use strict';

/**
 * http://ahexamples.blogspot.kr/2014/03/example-of-jasmine-karma-sonar-grunt.html
 */

module.exports = function(grunt) {

    var $srcFiles = 'src/main/**/*.js';
    var $testFiles = 'src/test/**/*Test.js';
    var $outputDir = 'build';
    var $junitResults = $outputDir + '/junit-test-results.xml';
    var $jasmineSpecRunner = $outputDir + '/_SpecRunner.html';
    var $coverageOutputDir = $outputDir + '/coverage';
    var $sequelizeCommonCmd = 'node node_modules/sequelize-cli/bin/sequelize ';
    var $sequelizeMigrationCmd = 'db:migrate --config src/main/config/config.json';

    /**
     * Grunt 스크립트에서 사용할 자체 Replace All 함수
     * grunt는 독립적으로도 동작해야한다고 생각하므로 util 없이 별도로 만들었음
     * @param source
     * @param target
     * @returns {string}
     */
    String.prototype.replaceAll = function(source, target) {
        var str = this;
        return str.split(source).join(target);
    }

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        // 압축과 합치는것은 아직 사용하지 않음
        /*
        concat: {
            main: {
                src: $srcFiles,
                dest: $outputDir+'/app.js'
            }
        },

        uglify: {
            build: {
                src: $outputDir+'/app.js',
                dest: $outputDir+'/app.min.js'
            }
        },
        */

        // Jasmine test
        jasmine: {
            pivotal: {
                src: $srcFiles,
                options: {
                    specs: $testFiles,
                    outfile: $jasmineSpecRunner,
                    keepRunner: 'true'	// keep SpecRunner/outfile file
                }
            }
        },

        // coverage using Karma
        karma: {
            continuous: {
                singleRun: 'true',
                browsers: [ 'PhantomJS' ]
            },

            options: {
                plugins: [
                    'karma-jasmine',
                    'karma-phantomjs-launcher',
                    'karma-junit-reporter',
                    'karma-coverage'
                ],
                frameworks: [ 'jasmine' ],
                files: [ $srcFiles, $testFiles ],
                reporters: [ 'junit', 'coverage' ],
                junitReporter: {
                    outputFile: $junitResults
                },
                preprocessors: {
                    // source files must be a literal string
                    'js/src/**/*.js': [ 'coverage' ]
                },
                coverageReporter: {
                    type: 'lcov',
                    dir: $coverageOutputDir
                }
            }
        },

        // export Karma coverage to SonarQube
        karma_sonar: {
            your_target: {
                // properties for SonarQube dashboard
                project: {
                    key: 'net.ahexample:ahexample-jasmine-karma-sonar',
                    name: 'Jasmine with Karma and SonarQube Example',
                    version: '0.0.1'
                }

                // sources property is set at runtime (see below)
            }
        },

        shell: {
            mon_run: {
                command: 'nodemon bin/www'
            },
            mon_debug: {
                command: 'nodemon --debug bin/www'
            },
            sequelize_cli: {
                /**
                 * 윈도우에서 bash가 안되서... 편하게 사용하려고 만들었음
                 * 옵션 : : -> _
                 * 띄어쓰기는 + 주면 됨
                 * ex ) 원하는 명령어 : ... db:migration --config config/config.json
                 * ex ) 실행할 명령어 : grunt seq:db_migrate--config+config/config.json
                 * TODO : 플러그인 형태로 좀더 쓰기 편하게 확장
                 */
                command: function (opts) {

                    if (opts.indexOf('_') > -1) {
                        opts = opts.replaceAll("--"," --").replaceAll("+", " ");
                        var temp = opts.split('_');
                        var $cmd = "";
                        for (var i=0; i<temp.length; i++){
                            $cmd += temp[i];
                            $cmd += (i!=temp.length-1) ? ":" : "";
                        }
                        var $exe = $sequelizeCommonCmd + $cmd;
                        console.log("Execute >>> " + $exe);
                        return $exe;
                    } else {
                        console.log(" ERROR : Not Found Option");
                        return false;
                    }
                }
            },
            sequelize_migrate: {
                command : $sequelizeCommonCmd + $sequelizeMigrationCmd
            }
        },

        clean: [ $outputDir ]
    });


    /*
     * Task to set karma_sonar's sources property.
     * This is needed because karma (coverage) stores its results in a
     * directory whose name uses the browser's user agent info
     * (name/version and the platform name).
     * The latter may well he different to the OS name and so its needs an
     * OS to platform translator.
     * For example, OS name for Apple Mac OS X is Darwin.
     */
    grunt.registerTask('set-karma-sonar-sources-property', function() {
        var $done = this.async();
        var $phantomjs = require('karma-phantomjs-launcher/node_modules/phantomjs');
        var $spawn = require('child_process').spawn;
        var $phantomUserAgent = $spawn($phantomjs.path,
            // phantomjs script to print user agent string
            [ 'bin/phantomjs-useragent.js' ]
        );

        /*
         * Construct coverage LCOV file path from PhantomJS'
         * user agent string, then use it to set karma_sonar's
         * sources property.
         */
        $phantomUserAgent.stdout.on('data', function(msg) {
            var $useragent = require('karma/node_modules/useragent');
            var $agent = $useragent.parse(msg);
            // An example of dirName is 'PhantomJS 1.9.7 (Mac OS X)'
            var $dirName = $agent.toAgent() + ' (' + $agent.os + ')';
            var $coverageResults = $coverageOutputDir + '/' + $dirName + '/lcov.info';
            var $sonarSources =	makeSonarSourceDirs($srcFiles, $coverageResults);
            var $karmaSonarConfig = 'karma_sonar';
            var $ksConfig = grunt.config($karmaSonarConfig);

            grunt.log.writeln('coverage LCOV file: ' + $coverageResults);
            $ksConfig['your_target']['sources'] = $sonarSources;
            grunt.config($karmaSonarConfig, $ksConfig);

        });

        $phantomUserAgent.on('close', function(exitCode) {
            $done();
        });


        /*
         * Create sonar source object for each directory of source file pattern.
         */
        function makeSonarSourceDirs($filesPattern, $coverageResults) {
            var $path = require('path');
            var $dirs = [];

            grunt.file.expand(
                {
                    filter: function($filePath) {
                        $dirs.push({
                            path: $path.dirname($filePath),
                            prefix: '.',	// path prefix in lcov.info
                            coverageReport: $coverageResults,
                            testReport: $junitResults
                        });
                    }
                },
                $filesPattern
            );

            return $dirs;
        }
    });


    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jasmine');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-karma');
    grunt.loadNpmTasks('grunt-karma-sonar');
    grunt.loadNpmTasks('grunt-shell');

    grunt.registerTask('test', [ 'jasmine', 'karma:continuous' ]);
    grunt.registerTask('sonar-only', [ 'set-karma-sonar-sources-property', 'karma_sonar' ]);
    grunt.registerTask('sonar', [ 'test', 'sonar-only' ]);
    grunt.registerTask('run', [ 'shell:mon_run']);
    grunt.registerTask('debug', [ 'shell:mon_debug']);
    grunt.registerTask('default', ['clean','test','shell:mon_run']);
    grunt.registerTask('seq', function (opts) {
        grunt.task.run('shell:sequelize_cli:' + opts);
    });
    grunt.registerTask('migrate',['shell:sequelize_migrate']);
}