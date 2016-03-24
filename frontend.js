(function() {
    "use strict"; //enable ECMAScript 5 Strict Mode

    function init(grunt) {

        // Load grunt tasks automatically
        require('load-grunt-tasks')(grunt);

        // Time how long tasks take. Can help when optimizing build times
        require('time-grunt')(grunt);

        var modRewrite = require('connect-modrewrite');

        var gruntConfig = require('./../grunt.json');

        grunt.template.addDelimiters('handlebars-like-delimiters', '{{', '}}');

        // Define the configuration for all the tasks
        grunt.initConfig({

                // Project settings
                yeoman: {
                            app: 'app',
                            dist: 'dist'
                        },

                // Watches files for changes and runs tasks based on the changed files
                watch: {
                    bower: {
                        files: ['bower.json'],
                        tasks: ['wiredep']
                    },
                    jsTest: {
                        files: ['test/spec/{,*/}*.js'],
                        tasks: ['newer:jshint:test', 'karma']
                    },
                    compass: {
                        files: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                        tasks: ['compass:server', 'autoprefixer']
                    },
                    gruntfile: {
                        files: ['Gruntfile.js']
                    },
                    livereload: {
                        options: {
                            livereload: '<%= connect.options.livereload %>'
                        },
                        files: [
                            '.tmp/styles/{,*/}*.css',
                            '<%= yeoman.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
                        ]
                    }
                },

                template: {

                    'process-html-template': {

                        options: {
                            data: function() {

                                var data = {};

                                data.date = grunt.template.today('dddd, mmmm dS, yyyy, h:MM:ss TT Z');
                                data.seconds = (new Date).getTime();

                                return data;
                            },
                            delimiters: 'handlebars-like-delimiters'
                        },
                        files: {
                            'dist/build.html': ['app/build.html']
                        }
                    }
                },



                // The actual grunt server settings
                connect: {
                    options: {
                        livereload: gruntConfig.port + 30000
                    },
                    local: {
                        options: {
                            port: gruntConfig.port,
                            hostname: 'localhost',
                            open: true,
                            base: [
                                '.tmp',
                                '<%= yeoman.app %>'
                            ],
                            middleware: function(connect, options) {

                                return [modRewrite(['^[^\\.]*$ /index.html [L]']),
                                    connect.static('.tmp'),
                                    connect.static('app'),
                                    connect().use('/bower_components', connect.static('./bower_components'))
                                ];
                            }
                        }
                    },
                    dist: {
                        options: {
                            port: gruntConfig.port + 20000,
                            hostname: 'localhost',
                            base: '<%= yeoman.dist %>'
                        }
                    }
                },

                // Make sure code styles are up to par and there are no obvious mistakes
                jshint: {
                    options: {
                        jshintrc: '.jshintrc',
                        reporter: require('jshint-stylish')
                    },
                    all: {
                        src: [
                            'Gruntfile.js',
                            '<%= yeoman.app %>/scripts/{,*/}*.js'
                        ]
                    },
                    test: {
                        options: {
                            jshintrc: 'test/.jshintrc'
                        },
                        src: ['test/spec/{,*/}*.js']
                    }
                },

                // Empties folders to start fresh
                clean: {
                    options: {
                        force: true
                    },
                    dist: {
                        files: [{
                            dot: true,
                            src: [
                                '.tmp',
                                '<%= yeoman.dist %>/{,*/}*',
                                '!<%= yeoman.dist %>/.git*'
                            ]
                        }]
                    },
                    server: '.tmp',
                    cleanup: '<%= yeoman.dist %>/config'
                },

                // Add vendor prefixed styles
                autoprefixer: {
                    options: {
                        browsers: ['last 1 version']
                    },
                    dist: {
                        files: [{
                            expand: true,
                            cwd: '.tmp/styles/',
                            src: '{,*/}*.css',
                            dest: '.tmp/styles/'
                        }]
                    }
                },

                // Automatically inject Bower components into the app
                wiredep: {
                    app: {
                        src: ['<%= yeoman.app %>/index.html'],
                        ignorePath: /\.\.\//
                    },
                    sass: {
                        src: ['<%= yeoman.app %>/styles/{,*/}*.{scss,sass}'],
                        ignorePath: /(\.\.\/){1,2}bower_components\//
                    }
                },

                // Compiles Sass to CSS and generates necessary files if requested
                compass: {
                    options: {
                        sassDir: '<%= yeoman.app %>/styles',
                        cssDir: '.tmp/styles',
                        generatedImagesDir: '.tmp/images/generated',
                        imagesDir: '<%= yeoman.app %>/images',
                        javascriptsDir: '<%= yeoman.app %>/scripts',
                        fontsDir: '<%= yeoman.app %>/fonts',
                        importPath: './bower_components',
                        httpImagesPath: '/images',
                        httpGeneratedImagesPath: '/images/generated',
                        httpFontsPath: '/fonts',
                        relativeAssets: false,
                        assetCacheBuster: false,
                        raw: 'Sass::Script::Number.precision = 10\n'
                    },
                    dist: {
                        options: {
                            generatedImagesDir: '<%= yeoman.dist %>/images/generated'
                        }
                    },
                    server: {
                        options: {
                            debugInfo: true
                        }
                    }
                },

                // Renames files for browser caching purposes
                filerev: {
                    dist: {
                        src: [
                            '<%= yeoman.dist %>/scripts/{,*/}*.js',
                            '<%= yeoman.dist %>/styles/{,*/}*.css'
                        ]
                    }
                },

                // Reads HTML for usemin blocks to enable smart builds that automatically
                // concat, minify and revision files. Creates configurations in memory so
                // additional tasks can operate on them
                useminPrepare: {
                    html: '<%= yeoman.app %>/index.html',
                    options: {
                        dest: '<%= yeoman.dist %>',
                        flow: {
                            html: {
                                steps: {
                                    js: ['concat', 'uglifyjs'],
                                    css: ['cssmin']
                                },
                                post: {}
                            }
                        }
                    }
                },

                useminPrepareDev: {
                    html: '<%= yeoman.app %>/index.html',
                    options: {
                        dest: '<%= yeoman.dist %>',
                        flow: {
                            steps: {
                                'js': ['concat'],
                                'css': ['concat']
                            },
                            post: {}
                        }
                    }
                },

                // Performs rewrites based on filerev and the useminPrepare configuration
                usemin: {
                    html: ['<%= yeoman.dist %>/{,*/}*.html'],
                    css: ['<%= yeoman.dist %>/styles/{,*/}*.css'],
                    options: {
                        assetsDirs: ['<%= yeoman.dist %>', '<%= yeoman.dist %>/images']
                    }
                },

                ngconstant: {
                    options: {
                        space: '  ',
                        wrap: '\'use strict\';\n\n {%= __ngModule %}',
                        name: 'config',
                        dest: '<%= yeoman.dist %>/config/config.js'
                    },
                    local: {
                        constants: {
                            CONFIG: grunt.file.readJSON('config/local.json'),
                            BUILD: {'build':'local', 'build_number':grunt.option('build_number')}
                        },
                        options: {
                            dest: '<%= yeoman.app %>/config/config.js'
                        }
                    },
                    development: {
                        constants: {
                            CONFIG: grunt.file.readJSON('config/development.json'),
                            BUILD: {'build':'development', 'build_number':grunt.option('build_number')}
                        }
                    },
                    production: {
                        constants: {
                            CONFIG: grunt.file.readJSON('config/production.json'),
                            BUILD: {'build':'production', 'build_number':grunt.option('build_number')}
                        }
                    },
                    staging: {
                        constants: {
                            CONFIG: grunt.file.readJSON('config/staging.json'),
                            BUILD: {'build':'staging', 'build_number':grunt.option('build_number')}
                        }
                    }
                },
                
                svgmin: {
                    dist: {
                        files: [{
                            expand: true,
                            cwd: '<%= yeoman.app %>/images',
                            src: '**/*.svg',
                            dest: '<%= yeoman.dist %>/images'
                        }]
                    }
                },

                htmlmin: {
                    dist: {
                        options: {
                            collapseWhitespace: true,
                            conservativeCollapse: true,
                            collapseBooleanAttributes: true,
                            removeCommentsFromCDATA: true,
                            removeOptionalTags: true
                        },
                        files: [{
                            expand: true,
                            cwd: '<%= yeoman.dist %>',
                            src: ['*.html', 'views/**/*.html'],
                            dest: '<%= yeoman.dist %>'
                        }]
                    }
                },

                // ng-annotate tries to make the code safe for minification automatically
                // by using the Angular long form for dependency injection.
                ngAnnotate: {
                    dist: {
                        files: [{
                            expand: true,
                            cwd: '.tmp/concat/scripts',
                            src: ['*.js', '!oldieshim.js'],
                            dest: '.tmp/concat/scripts'
                        }]
                    }
                },

                // Replace Google CDN references
                cdnify: {
                    dist: {
                        html: ['<%= yeoman.dist %>/*.html']
                    }
                },

                // Copies remaining files to places other tasks can use
                copy: {
                    dist: {
                        files: [{
                                expand: true,
                                dot: true,
                                cwd: '<%= yeoman.app %>',
                                dest: '<%= yeoman.dist %>',
                                src: [
                                    '*.*',
                                    '.htaccess',
                                    '*.html',
                                    'views/**/*.html',
                                    'images/{,*/}*.{webp}',
                                    'images/*',
                                    'fonts/**/*'
                                ]
                            }, {
                                expand: true,
                                cwd: '.tmp/images',
                                dest: '<%= yeoman.dist %>/images',
                                src: ['generated/*']
                            }, {
                                expand: true,
                                dot: true,
                                cwd: 'bower_components/bootstrap/dist',
                                src: ['fonts/*.*'],
                                dest: '<%= yeoman.dist %>'
                            }, {
                                expand: true,
                                dot: true,
                                cwd: 'bower_components/font-awesome',
                                src: ['fonts/*.*'],
                                dest: '<%= yeoman.dist %>'
                            }, {
                                expand: true,
                                dot: true,
                                cwd: 'bower_components/material-design-icons/iconfont',
                                src: ['*.*'],
                                dest: '<%= yeoman.dist %>/iconfont'
                            }
                        ]
                    },
                    iconfont: {
                        files: [
                            {
                                expand: true,
                                dot: true,
                                cwd: 'bower_components/material-design-icons/iconfont',
                                src: ['*.*'],
                                dest: '<%= yeoman.app %>/iconfont'
                            }
                        ]
                    },
                    development: {
                        files: [{
                                expand: true,
                                dot: true,
                                cwd: '.',
                                dest: '<%= yeoman.dist %>',
                                rename: function(dest, src) {
                                    return dest + src.replace(/telerik\/development/, "");
                                },
                                src: [
                                    'telerik/development/*',
                                    'telerik/development/plugins/**/*',
                                    'telerik/development/App_Resources/**/*'
                                ]
                            }]
                    },
                    staging: {
                        files: [{
                                expand: true,
                                dot: true,
                                cwd: '.',
                                dest: '<%= yeoman.dist %>',
                                rename: function(dest, src) {
                                    return dest + src.replace(/telerik\/staging/, "");
                                },
                                src: [
                                    'telerik/staging/*',
                                    'telerik/staging/plugins/**/*',
                                    'telerik/staging/App_Resources/**/*'
                                ]
                        }]
                    },
                    production: {
                        files: [{
                                expand: true,
                                dot: true,
                                cwd: '.',
                                dest: '<%= yeoman.dist %>',
                                rename: function(dest, src) {
                                    return dest + src.replace(/telerik\/production/, "");
                                },
                                src: [
                                    'telerik/production/*',
                                    'telerik/production/plugins/**/*',
                                    'telerik/production/App_Resources/**/*'
                                ]
                        }]
                    },
                    styles: {
                        expand: true,
                        cwd: '<%= yeoman.app %>/styles',
                        dest: '.tmp/styles/',
                        src: '{,*/}*.css'
                    }
                },

                // Run some tasks in parallel to speed up the build process
                concurrent: {
                    server: [
                        'compass:server'
                    ],
                    dist: [
                        'compass:dist',
                        'svgmin'
                    ]
                },

                // Test settings
                karma: {
                    unit: {
                        configFile: 'test/karma.conf.js',
                        singleRun: true
                    }
                },

                exec: {
                    livesynccloud: {
                        cwd: '<%= yeoman.dist %>',
                        command: 'appbuilder livesync cloud'
                    }
                },

                prompt: {
                    builder: {
                        options: {
                            questions: [{
                                config: 'builder',
                                message: 'Please select...',
                                name: 'option',
                                type: 'list',
                                choices: ['LiveSync Cloud']
                            }],
                            then: function(results) {
                                if(results.builder == 'LiveSync Cloud')
                                    grunt.task.run('exec:livesynccloud');
                            }
                        }
                    }
                }
            });

            grunt.registerTask('builder', '', function(target) {
                return grunt.task.run(['prompt:builder']);
            });

            grunt.registerTask('serve', 'Compile then start a connect web server', function(target) {

                if (arguments.length === 0) {
                    grunt.log.error('Please specify a target to serve. Options: serve:local, serve:staging, serve:production');
                    return false;
                }

                if (grunt.option('jshint'))
                    grunt.config.merge({
                        watch: {
                            js: {
                                files: ['<%= yeoman.app %>/scripts/{,*/}*.js'],
                                tasks: ['newer:jshint:all']
                            }
                        }
                    });

                if (target === 'local') {
                    return grunt.task.run([
                        'clean:server',
                        'ngconstant:local',
                        'wiredep',
                        'concurrent:server',
                        'autoprefixer',
                        'copy:iconfont',
                        'connect:local',
                        'watch'
                    ]);

                } else {

                    var tasks = ['clean:dist',
                        'ngconstant:' + target,
                        'wiredep'
                    ];

                    //If --nomin is detected then do not minify the js and css
                    if (grunt.option('nomin') || target=='development') {
                        tasks = grunt.util._.union(tasks, ['useminPrepareDev',
                            'concurrent:dist',
                            'autoprefixer',
                            'concat',
                            'ngAnnotate',
                            'copy:dist',
                            //'cdnify',
                            'filerev',
                            'usemin',
                            'connect:dist:keepalive'
                        ]);
                    } else {
                        tasks = grunt.util._.union(tasks, ['useminPrepare',
                            'concurrent:dist',
                            'autoprefixer',
                            'concat',
                            'ngAnnotate',
                            'copy:dist',
                            //'cdnify',
                            'filerev',
                            'uglify',
                            'cssmin',
                            'usemin',
                            'htmlmin',
                            'connect:dist:keepalive'
                        ]);
                    }

                    return grunt.task.run(tasks);
                }
            });

            grunt.registerTask('useminPrepareDev', function() {
                grunt.config.set('useminPrepare', grunt.config('useminPrepareDev'));
                grunt.task.run('useminPrepare');
            });

            grunt.registerTask('build', 'Compile', function(target, build_number) {

                if (arguments.length === 0) {
                    grunt.log.error('Please specify a target to build. Options: build:development, build:staging, build:production');
                    return false;
                }

                var tasks = [   'clean:dist',
                                'ngconstant:' + target,
                                'wiredep'
                            ];

                //If --nomin is detected then do not minify the js and css
                if (grunt.option('nomin') || target=='development') {
                    tasks = grunt.util._.union(tasks, ['useminPrepareDev',
                        'concurrent:dist',
                        'autoprefixer',
                        'concat',
                        'ngAnnotate',
                        'copy:dist',
                        'copy:' + target,
                        //'cdnify',
                        'filerev',
                        'usemin',
                        'clean:cleanup',
                        //'template'
                    ]);
                } else {
                    tasks = grunt.util._.union(tasks, ['useminPrepare',
                        'concurrent:dist',
                        'autoprefixer',
                        'concat',
                        'ngAnnotate',
                        'copy:dist',
                        'copy:' + target,
                        //'cdnify',
                        'uglify',
                        'cssmin',
                        'filerev',
                        'usemin',
                        'htmlmin',
                        'clean:cleanup',
                        //'template'
                    ]);
                }

                return grunt.task.run(tasks);
            });
    }

    exports = module.exports = {
        init: init
    };
})();



