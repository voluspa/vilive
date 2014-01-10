var path = require('path');

var lockFile = require('lockfile');

module.exports = function(grunt) {
"use strict";

    grunt.initConfig({
        clean: ['_build'],
        watch: {
            options: {
                spawn: false,
                livereload: true
            },
            index: {
                files: ['app/index.html'],
                task: [
                    'lock',
                    'fileblocks:dev',
                    'unlock'
                ]
            },
            js: {
                files: ['app/**/*.js', 'spec/**/*.js'],
                tasks: [
                    'lock',
                    'jsbeautifier',
                    'jshint',
                    'transpile',
                    'fileblocks:dev',
                    'testem:ci:dev',
                    'unlock'
                ]
            },
            styles: {
                files: ['app/styles/**/*.less'],
                tasks: [
                    'lock', 
                    'less:dev',
                    'fileblocks:dev',
                    'unlock'
                ]
            },
            templates: {
                files: ['app/templates/**/*.hbs'],
                tasks: [
                    'lock',
                    'emberTemplates:dev',
                    'testem:ci:dev',
                    'unlock'
                ]
            }
        },
        express: {
            dev: {
                options: {
                    script: 'api-stub/server.js'
                }
            }
        },
        testem: {
            dev: {
                src: [
                    'vendor/jquery/jquery.js',
                    'vendor/handlebars/handlebars.js',
                    'vendor/ember/ember.js',
                    'vendor/ember-mocha-adapter/adapter.js',
                    'vendor/loader.js',
                    'vendor/ember-resolver/dist/ember-resolver.js',
                    '_build/**/*.*',
                    'spec/init.js',
                    'spec/**/*_spec.js'
                ],
                options: {
                    host: '127.0.0.1',
                    growl: true,
                    debug: true,
                    framework: 'mocha+chai',
                    parallel: 4,
                    launch_in_dev: ['PhantomJS'],
                    launch_in_ci: ['PhantomJS']
                }
            }
        },
        jshint: {
            app: {
                src: ['app/**/*.js'],
                options: { jshintrc: '.jshintrc'}
            },
            spec: {
                src: ['spec/**/*.js'],
                options: { jshintrc: '.jshintrc'}
            }
        },
        jsbeautifier: {
            options: {
                config: '.jsbeautifyrc'
            },
            src: ['app/**/*.js', 'spec/**/*.js']
        },
        less: {
            dev: {
                options: {
                    sourceMap: true
                },
                expand: true,
                cwd: 'app/styles',
                src: ['**/*.less', '**/*.css'],
                dest: '_build/assets/css/',
                ext: '.css'
            }
        },
        emberTemplates: {
            options: {
                templateBasePath: /app\//,
                templateRegistration: function (name, template) {
                    return "define('app/" + name + "', ['exports'], function(__exports__){ __exports__['default'] = " + template + "; });";
                }
            },
            dev: {
                files: {
                    '_build/assets/js/templates.js': 'app/templates/**/*.hbs'
                }
            }
        },
        transpile: {
            app: {
                type: 'amd',
                moduleName: function (path) {
                    return 'app/' + path;
                },
                files: [{
                    expand: true,
                    cwd: 'app/',
                    src: ['**/*.js'],
                    dest: '_build/assets/js'
                }]
            }
        },
        fileblocks: {
            dev: {
                src: 'app/index.html',
                dest: '_build/index.html',
                blocks: {
                    app: {
                        src: '**/*.js',
                        cwd: '_build/assets/js',
                        prefix: '/assets/js'
                    },
                    styles: {
                        src: '**/*.css',
                        cwd: '_build/assets/css',
                        prefix: '/assets/css'
                    }
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-contrib-testem');
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-ember-templates');
    grunt.loadNpmTasks('grunt-es6-module-transpiler');
    grunt.loadNpmTasks('grunt-notify');
    grunt.loadNpmTasks('grunt-file-blocks');
    grunt.loadNpmTasks('grunt-jsbeautifier');

    grunt.registerTask('default', [
        'build:dev'
    ]);

    grunt.registerTask('build:dev', [
        'jsbeautifier',
        'jshint',
        'less:dev',
        'transpile',
        'emberTemplates:dev',
        'fileblocks:dev',
        'testem:ci:dev'
    ]);

    grunt.registerTask('dev', 'Get back to work!', [
        'build:dev',
        'express:dev',
        'watch'
    ]);

    grunt.registerTask('lock', 'Make the connect server wait until unlock',
    function () {
        lockFile.lockSync('.connect.lock');
        grunt.log.writeln('connect locked');
    });

    grunt.registerTask('unlock', 'Allow connect to handle requests',
    function () {
        lockFile.unlockSync('.connect.lock');
        grunt.log.writeln('connect unlocked');
    });
};
