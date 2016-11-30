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
                        files: ['app/styles/{,*/}*.{scss,sass}'],
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
                            'app/images/{,*/}*.{png,jpg,jpeg,gif,webp}'
                        ]
                    },
                    status: {
                        files: ['app/scripts/{,*/}*.js','app/styles/{,*/}*.*css'],
                        tasks: ['status']
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
                    },

                    'controller': {

                        options: {
                            data: function() {
                                var data = { controller: grunt.config('controller') };

                                return data;
                            },
                            delimiters: 'handlebars-like-delimiters'
                        },
                        files: {
                            '.tmp/controller.js': ['grunt/templates/controller.js'],
                            '.tmp/view.html': ['grunt/templates/view.html']
                        }
                    },

                    'service': {

                        options: {
                            data: function() {
                                var data = { service: grunt.config('service') };

                                return data;
                            },
                            delimiters: 'handlebars-like-delimiters'
                        },
                        files: {
                            '.tmp/service.js': ['grunt/templates/service.js']
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
                                'app'
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
                            base: 'dist',
                            middleware: function(connect, options) {
                                return [ modRewrite(['^[^\\.]*$ /index.html [L]']),
						                connect.static('.tmp'),
						                connect().use(
						                    '/bower_components',
						                    connect.static('./bower_components')
						                ),
						                connect.static('dist')
                                ];
                            }
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
                            'app/scripts/{,*/}*.js'
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
                                'dist/{,*/}*',
                                '!dist/.git*'
                            ]
                        }]
                    },
                    server: '.tmp',
                    cleanup: 'dist/config'
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
                        src: ['app/index.html'],
                        ignorePath: /\.\.\//
                    },
                    sass: {
                        src: ['app/styles/{,*/}*.{scss,sass}'],
                        ignorePath: /(\.\.\/){1,2}bower_components\//
                    }
                },

                // Compiles Sass to CSS and generates necessary files if requested
                compass: {
                    options: {
                        sassDir: 'app/styles',
                        cssDir: '.tmp/styles',
                        generatedImagesDir: '.tmp/images/generated',
                        imagesDir: 'app/images',
                        javascriptsDir: 'app/scripts',
                        fontsDir: 'app/fonts',
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
                            generatedImagesDir: 'dist/images/generated'
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
                            'dist/scripts/{,*/}*.js',
                            'dist/styles/{,*/}*.css'
                        ]
                    }
                },

                // Reads HTML for usemin blocks to enable smart builds that automatically
                // concat, minify and revision files. Creates configurations in memory so
                // additional tasks can operate on them
                useminPrepare: {
                    html: 'app/index.html',
                    options: {
                        dest: 'dist',
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

                useminPrepareNomin: {
                    html: 'app/index.html',
                    options: {
                        dest: 'dist',
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
                    html: ['dist/{,*/}*.html'],
                    css: ['dist/styles/{,*/}*.css'],
                    options: {
                        assetsDirs: ['dist', 'dist/images']
                    }
                },

                ngconstant: {
                    options: {
                        space: '  ',
                        wrap: '\'use strict\';\n\n {%= __ngModule %}',
                        name: 'config',
                    },
                    dist: {
                        constants: function() {

                            return {
                                CONFIG: grunt.file.readJSON('config/' + grunt.config('target') + '.json'),
                                BUILD: { 'build': grunt.config('target'), 'build_number': grunt.option('build_number') }
                            }
                        },
                        options: {
                            dest: 'dist/config/config.js'
                        }
                    },
                    local: {
                        constants: {
                            CONFIG: grunt.file.readJSON('config/local.json'),
                            BUILD: {'build':'local', 'build_number':grunt.option('build_number')}
                        },
                        options: {
                            dest: 'app/config/config.js'
                        }
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
                            cwd: 'dist',
                            src: ['*.html', 'views/**/*.html'],
                            dest: 'dist'
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
                        html: ['dist/*.html']
                    }
                },

                // Copies remaining files to places other tasks can use
                copy: {
                    dist: {
                        files: [
                                {
                                    expand: true,
                                    dot: true,
                                    cwd: 'app',
                                    dest: 'dist',
                                    src: [
                                        '*.*',
                                        '.htaccess',
                                        '*.html',
                                        'views/**/*.html',
                                        'images/{,*/}*.{webp}',
                                        'images/*',
                                        'images/**/*',
                                        'fonts/**/*',
                                        'styles/fonts**/*'
                                    ]
                                },
                                {
                                    expand: true,
                                    cwd: '.tmp/images',
                                    dest: 'dist/images',
                                    src: ['generated/*']
                                },
                                {
                                    expand: true,
                                    dot: true,
                                    cwd: 'bower_components/bootstrap/dist',
                                    src: ['fonts/*.*'],
                                    dest: 'dist'
                                },
                                {
                                    expand: true,
                                    dot: true,
                                    cwd: 'bower_components/font-awesome',
                                    src: ['fonts/*.*'],
                                    dest: 'dist'
                                },
                                {
                                    expand: true,
                                    dot: true,
                                    cwd: 'bower_components/material-design-icons/iconfont',
                                    src: ['*.*'],
                                    dest: 'dist/iconfont'
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
                                dest: 'app/iconfont'
                            }
                        ]
                    },
                    controller: {
                        files: [
                            {
                                expand: true,
                                flatten: true,
                                cwd: '.',
                                dest: 'app/scripts/controllers/',
                                rename: function(dest, src) {
                                    return dest + src.replace(new RegExp('controller'), grunt.config('controller').toLowerCase());
                                },
                                src: [
                                    '.tmp/controller.js'
                                ]
                            }
                        ]
                    },
                    view: {
                        files: [
                            {
                                expand: true,
                                flatten: true,
                                cwd: '.',
                                dest: 'app/views/',
                                rename: function(dest, src) {
                                    return dest + src.replace(new RegExp('view'),grunt.config('controller').toLowerCase());
                                },
                                src: [
                                    '.tmp/view.html'
                                ]
                            }
                        ]
                    },
                    service: {
                        files: [
                            {
                                expand: true,
                                flatten: true,
                                cwd: '.',
                                dest: 'app/scripts/services/',
                                rename: function(dest, src) {
                                    return dest + src.replace(new RegExp('service'), grunt.config('service').toLowerCase());
                                },
                                src: [
                                    '.tmp/service.js'
                                ]
                            }
                        ]
                    },
                },

                // Run some tasks in parallel to speed up the build process
                concurrent: {
                    server: [
                        'compass:server'
                    ],
                    dist: [
                        'compass:dist'
                    ]
                },

                // Test settings
                karma: {
                    unit: {
                        configFile: 'test/karma.conf.js',
                        singleRun: true
                    }
                },

                'string-replace': {
                    'index-controller': {
                        files: {
                            'app/index.html': 'app/index.html'
                        },
                        options: {
                            replacements: [{
                                pattern: /<!-- endcontrollers -->/ig,
                                replacement: function (match, p1) {
                                    return '<script src="scripts/controllers/' + grunt.config('controller').toLowerCase() + '.js"></script>\n\t<!-- endcontrollers -->';
                                }
                            }]
                        }
                    },
                    'index-service': {
                        files: {
                            'app/index.html': 'app/index.html'
                        },
                        options: {
                            replacements: [{
                                pattern: /<!-- endservices -->/ig,
                                replacement: function (match, p1) {
                                    return '<script src="scripts/services/' + grunt.config('service').toLowerCase() + '.js"></script>\n\t<!-- endservices -->';
                                }
                            }]
                        }
                    },
                    app: {
                        files: {
                            'app/scripts/app.js': 'app/scripts/app.js'
                        },
                        options: {
                            replacements: [{
                                pattern: /\/\*\* endstates \*\*\//ig,
                                replacement: function (match, p1) {
                                    return  '.state(\'' + grunt.config('controller').toLowerCase() + '\', {\n' +
                                            '		url: \'/' + grunt.config('controller').toLowerCase() + '/:param\',\n' +
                                            '		templateUrl: \'views/' + grunt.config('controller').toLowerCase() + '.html\',\n' +
                                            '		controller: \'' + grunt.config('controller') + 'Ctrl\',\n' +
                                            '		params: {\n' +
                                            '			param: { squash: true, value: null }\n' +
                                            '		},\n' +
                                            '		resolve: {\n' +
                                            '			param: function($stateParams) {\n' +
                                            '				return $stateParams.param;\n' +
                                            '			}\n' +
                                            '		}\n' +
                                            '\t})\n\n\t/** endstates **/';
                                }
                            }]
                        }
                    },

                }
            });

            grunt.registerTask('useminPrepareNomin', function() {
                grunt.config.set('useminPrepare', grunt.config('useminPrepareNomin'));
                grunt.task.run('useminPrepare');
            });

            grunt.registerTask('buildjson', 'Build JSON', function() {
                grunt.file.write('dist/build.json', '{"build_date":"' + new Date().toISOString() + '"}');
            });

            grunt.registerTask('status', '', function() {
                var options = { separator: ', ', color: 'yellow' };
                grunt.log.subhead(grunt.log.wordlist(['Web server running on http://localhost:' + parseInt(gruntConfig.port)],options));
            });

            grunt.registerTask('default', '', function(target) {
                return grunt.task.run(['serve:local']);
            });

            grunt.registerTask('serve', 'Compile then start a connect web server', function(target) {

                if (arguments.length === 0) {
                    grunt.log.error('Please specify a target to serve');
                    return false;
                }

 				grunt.config('target', target);
                var compile = target !== 'local' || grunt.option('compile');
                var minify 	= !((grunt.option('nomin') || target=='development' || target=='local') && !grunt.option('min'));

                if (grunt.option('jshint'))
                    grunt.config.merge({
                        watch: {
                            js: {
                                files: ['app/scripts/{,*/}*.js'],
                                tasks: ['newer:jshint:all']
                            }
                        }
                    });

                if (compile) {

                	grunt.log.ok(['Serving ' + target]);

                    if (minify) {

                        var tasks = ['clean:dist',
			                        'ngconstant:dist',
			                        'wiredep',
			                        'useminPrepare',
		                            'concurrent:dist',
		                            'autoprefixer',
		                            'concat',
		                            'ngAnnotate',
		                            'copy:dist',
		                            'filerev',
		                            'uglify',
		                            'cssmin',
		                            'usemin',
		                            'htmlmin',
		                            'connect:dist:keepalive'
                        ];
                    } else {

                        //If --nomin is detected then do not minify the js and css
                        var tasks = ['clean:dist',
			                        'ngconstant:dist',
			                        'wiredep',
		                        	'useminPrepareNomin',
		                            'concurrent:dist',
		                            'autoprefixer',
		                            'concat',
		                            'ngAnnotate',
		                            'copy:dist',
		                            'filerev',
		                            'usemin',
		                            'connect:dist:keepalive'
		                        ];
                    }
                } else {
                   	var tasks = ['clean:server',
		                        'ngconstant:local',
		                        'wiredep',
		                        'concurrent:server',
		                        'autoprefixer',
		                        'copy:iconfont',
		                        'connect:local',
		                        'status',
		                        'watch'
		                    ];
                }

                return grunt.task.run(tasks);
            });

            grunt.registerTask('build', 'Compile', function(target, build_number) {

                if (arguments.length === 0) {
                    grunt.log.error('Please specify a target to build. Options: build:development, build:staging, build:production');
                    return false;
                }

                grunt.log.ok(['Building ' + target]);
                grunt.config('target', target);

                var tasks = [   'clean:dist',
                                'ngconstant:dist',
                                'wiredep'
                            ];

                //If --nomin is detected then do not minify the js and css
                if (grunt.option('nomin') || target=='development') {
                    tasks = grunt.util._.union(tasks, ['useminPrepareNomin',
                        'concurrent:dist',
                        'autoprefixer',
                        'concat',
                        'ngAnnotate',
                        'copy:dist',
                        'filerev',
                        'usemin',
                        'clean:cleanup'
                    ]);
                } else {
                    tasks = grunt.util._.union(tasks, ['useminPrepare',
                        'concurrent:dist',
                        'autoprefixer',
                        'concat',
                        'ngAnnotate',
                        'copy:dist',
                        'uglify',
                        'cssmin',
                        'filerev',
                        'usemin',
                        'htmlmin',
                        'clean:cleanup'
                    ]);
                }

                grunt.config.set('copy.telerik', {
                    files : [
                                {
                                    expand: true,
                                    dot: true,
                                    cwd: '.',
                                    dest: 'dist',
                                    rename: function(dest, src) {
                                        return dest + src.replace(new RegExp('telerik\/' + target), '');
                                    },
                                    src: [
                                        'telerik/' + target + '/*',
                                        'telerik/' + target + '/plugins/**/*',
                                        'telerik/' + target + '/App_Resources/**/*'
                                    ]
                                }
                    ]
                });

                tasks.push('buildjson');
                tasks.push('copy:telerik');

                return grunt.task.run(tasks);
            });


            grunt.registerTask('controller', 'Controller Generator', function(controller) {

                grunt.config('controller',controller);

                return grunt.task.run(['template:controller',
                                        'copy:controller',
                                        'copy:view',
                                        'string-replace:index-controller',
                                        'string-replace:app']);
            });

            grunt.registerTask('service', 'Service Generator', function(service) {

                grunt.config('service',service);

                return grunt.task.run(['template:service',
                                        'copy:service',
                                        'string-replace:index-service']);
            });
    }

    exports = module.exports = {
        init: init
    };
})();



