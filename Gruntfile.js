'use strict';

var open = require('open');
var dotenv = require('dotenv');
dotenv.load();

module.exports = function(grunt) {

	// Load the plugin that provides the 'uglify' task.
	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-filerev');
	grunt.loadNpmTasks('grunt-html2js');
	grunt.loadNpmTasks('grunt-ng-annotate');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-svgmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');
	grunt.loadNpmTasks('grunt-build-control');
	grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-open');
	grunt.loadNpmTasks('grunt-express-server');
	grunt.loadNpmTasks('grunt-env');

	// Project configuration.
	var pkg = grunt.file.readJSON('package.json');
	grunt.initConfig({
		pkg: pkg,
    open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>'
      }
    },
    express: {
      options: {
        port: process.env.PORT || 9000
      },
      dev: {
        options: {
          script: 'api/server.js',
          debug: true
        }
      }
    },
    env : {
	    dev : {
				PORT: process.env.PORT,
				MANDRILL_KEY: process.env.MANDRILL_KEY,
				MAILCHIMP_LIST_ID: process.env.MAILCHIMP_LIST_ID,
				MAILCHIMP_API_KEY: process.env.MAILCHIMP_API_KEY,
				S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
				S3_ACCESS_SECRET: process.env.S3_ACCESS_SECRET
	    }
    },
		nodemon: {
			dist: {
				script: 'dist/api/server.js',
				options: {
					nodeArgs: ['--debug'],
					env: {
						PORT: process.env.PORT,
						MANDRILL_KEY: process.env.MANDRILL_KEY,
						MAILCHIMP_LIST_ID: process.env.MAILCHIMP_LIST_ID,
						MAILCHIMP_API_KEY: process.env.MAILCHIMP_API_KEY,
						S3_ACCESS_KEY_ID: process.env.S3_ACCESS_KEY_ID,
						S3_ACCESS_SECRET: process.env.S3_ACCESS_SECRET
					},
					callback: function(nodemon) {
						nodemon.on('config:update', function() {
							setTimeout(function() {
								open('http://localhost:3000');
							}, 1000);
						});
					}
				}
			}
		},
		watch: {
			main: {
				files: [
					'frontend/less/*.less'
				],
				tasks: ['less:main', 'autoprefixer']
			},
			livereload: {
				files: [
					'frontend/**/*.js',
					'frontend/**/*.html',
					'frontend/css/*.css',
					'!frontend/bower_components/**'
				],
				options: {
					livereload: true
				}
			},
			components: {
				files: [
					'frontend/components/**/*.less'
				],
				tasks: ['less:components', 'autoprefixer']
			},
			views: {
				files: [
					'frontend/views/**/*.less'
				],
				tasks: ['less:views', 'autoprefixer']
			},
      express: {
        files: [
          'api/**/*.{js,json}'
        ],
        tasks: ['express:dev', 'wait'],
        options: {
          livereload: true,
          nospawn: true //Without this option specified express won't be reloaded
        }
      }
		},
		concurrent: {
			dist: {
				tasks: ['nodemon:dist'],
				options: {
					logConcurrentOutput: true
				}
			},
			dev: {
				tasks: ['watch'],
				options: {
					logConcurrentOutput: true
				}
			}
		},
		clean: {
			distApi: 'dist/api',
			distFrontend: 'dist/frontend',
			stage: '.tmp'
		},
		useminPrepare: {
			html: '.tmp/stage/frontend/index.html',
			options: {
				dest: '.tmp/stage/frontend'
			}
		},
		copy: {
			// Stage
			stageApi: {
				files: [
					{
						expand: true,
						cwd: 'api/',
						// Match all files except alt-config files
						src: ['**'],
						dest: '.tmp/stage/api/'
					}
				]
			},
			stageFrontend: {
				files: [
					{
						expand: true,
						cwd: 'frontend/',
						// Match all files except alt-config files and img
						src: ['**', '!robots_**', '!js/config**', '!img'],
						dest: '.tmp/stage/frontend/'
					}
				]
			},
			stageBootstrapFonts: {
				files: [
					{
						expand: true,
						cwd: '.tmp/stage/frontend/bower_components/bootstrap/fonts/',
						src: [
							'*.*'
						],
						dest: '.tmp/stage/frontend/fonts'
					}
				]
			},
			// Robots copy
			prodRobotsFrontend: {
				files: [
					{
						// frontend
						expand: true,
						cwd: 'frontend/',
						src: ['robots_Prod.txt'],
						dest: '.tmp/stage/frontend/',
						rename: robotsRename
					}
				]
			},
			// Config copies
			prodConfigFrontend: {
				files: [
					{
						// frontend
						expand: true,
						cwd: 'frontend/js/',
						src: ['config_Prod.js'],
						dest: '.tmp/stage/frontend/js/',
						rename: configRename
					}
				]
			},
			stageConfigFrontend: {
				files: [
					{
						// frontend
						expand: true,
						cwd: 'frontend/js/',
						src: ['config_Stage.js'],
						dest: '.tmp/stage/frontend/js/',
						rename: configRename
					}
				]
			},
			distConfigFrontend: {
				files: [
					{
						// frontend
						expand: true,
						cwd: 'frontend/js/',
						src: ['config_Local_Dist.js'],
						dest: '.tmp/stage/frontend/js/',
						rename: configRename
					}
				]
			},
			// dist copy
			distApi: {
				files: [
					{
						expand: true,
						cwd: '.tmp/stage/api/',
						src: ['**'],
						dest: 'dist/api/'
					}
				]
			},
			distFrontend: {
				files: [
					{
						expand: true,
						cwd: '.tmp/stage/frontend/',
						src: [
							'js/app.*.js',
							'css/style.*.css',
							'img/**',
							'fonts/**',
							'print/**',
							'index.html',
							'*.*'
						],
						dest: 'dist/frontend/'
					}
				]
			},
			// app files, node app files
			app: {
				files: [
					{
						// frontend
						expand: true,
						cwd: './',
						src: ['package.json', 'Procfile'],
						dest: 'dist/'
					}
				]
			}
		},
		usemin: {
			html: [
				'.tmp/stage/frontend/index.html'
			]
		},
		uglify: {
			options: {
				mangle: true,
				beautify: false,
				compress: {}
			}
		},
		cssmin: {
			options: {
				keepSpecialComments: 0
			}
		},
		filerev: {
			options: {
				encoding: 'utf8',
				algorithm: 'md5',
				length: 8
			},
			css: {
				src: '.tmp/stage/frontend/css/style.css'
			},
			js: {
				src: [
					'.tmp/stage/frontend/js/app.js'
				]
			}
		},
		html2js: {
			options: {
				base: '.tmp/stage/frontend',
				htmlmin: {
					collapseBooleanAttributes: true,
					collapseWhitespace: true,
					removeAttributeQuotes: true,
					removeComments: true, // Only if you don't use comment directives!
					removeEmptyAttributes: true,
					removeRedundantAttributes: true,
					removeScriptTypeAttributes: true,
					removeStyleLinkTypeAttributes: true
				}
			},
			app: {
				src: [
					'.tmp/stage/frontend/components/**/*.html',
					'.tmp/stage/frontend/views/**/*.html',
				],
				dest: '.tmp/stage/frontend/js/templates.js'
			}
		},
		ngAnnotate: {
			app: {
				files: {
					'.tmp/concat/js/app.js': ['.tmp/concat/js/app.js']
				}
			}
		},
		less: {
			main: {
				options: {
					sourceMap: true,
					sourceMapFilename: 'frontend/css/main.css.map',
					sourceMapURL: '/css/main.css.map',
					sourceMapBasepath: 'frontend',
					sourceMapRootpath: '/'
				},
				files: {
					'frontend/css/main.css': 'frontend/less/main.less',
					'frontend/css/bootstrap.css': 'frontend/less/bootstrap.less'
				}
			},
			components: {
				files: {
					'frontend/css/components.css': 'frontend/components/*.less'
				}
			},
			views: {
				files: {
					'frontend/css/views.css': 'frontend/views/**/*.less'
				}
			}
		},
		autoprefixer: {
			options: {},
			css: {
				expand: true,
				flatten: true,
				src: 'frontend/css/*.css',
				dest: 'frontend/css/'
			}
		},
		svgmin: {
			options: {
				plugins: [
					{
						removeEmptyText: false
					}, {
						removeUnknownsAndDefaults: false
					}
				]
			},
			stage: {
				files: [
					{
						expand: true,
						cwd: 'frontend/img',
						src: ['*.svg'],
						dest: '.tmp/stage/frontend/img/',
						ext: '.svg'
					}
				]
			}
		},
		imagemin: {
			stage: {
				files: [
					{
						expand: true,
						cwd: 'frontend/img',
						src: ['**/*.{png,jpg,gif}'],
						dest: '.tmp/stage/frontend/img/'
					}
				]
			}
		},
		buildcontrol: {
			options: {
				dir: 'dist',
				commit: true,
				push: true,
				message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
			},
			prod: {
				options: {
					remote: 'git@heroku.com:ghcprod.git',
					branch: 'master',
					tag: pkg.version
				}
			},
			stage: {
				options: {
					remote: 'git@heroku.com:ghcstage.git',
					branch: 'master',
					tag: pkg.version
				}
			},
			dev: {
				options: {
					remote: 'git@heroku.com:ghcdev.git',
					branch: 'master',
					tag: pkg.version
				}
			}
		}
	});

	grunt.registerTask('deploy:prod', [
		'clean:stage',
		'buildApi',
		'prodBuildFrontend',
		'copy:app',
		'buildcontrol:prod'
	]);

	grunt.registerTask('deploy:stage', [
		'clean:stage',
		'buildApi',
		'stageBuildFrontend',
		'copy:app',
		'buildcontrol:stage'
	]);

	grunt.registerTask('deploy:dev', [
		'clean:stage',
		'buildApi',
		'stageBuildFrontend',
		'copy:app',
		'buildcontrol:dev'
	]);

	grunt.registerTask('dev', [
		'buildCss',
		'express:dev',
		'wait',
		'open',
		'watch'
	]);

	grunt.registerTask('dist', [
		'clean:stage',
		'buildApi',
		'distBuildFrontend',
		'concurrent:dist'
	]);


	// grunt.registerTask('build', [
	// 	'distBuildApi',
	// 	'distBuildFrontend'
	// ]);

	grunt.registerTask('buildCss', [
		'less:main',
		'less:components',
		'less:views',
		'autoprefixer'
	]);

	grunt.registerTask('prepareFrontend', [
		'buildCss',
		'copy:stageFrontend',
		'copy:stageBootstrapFonts',
		'imagemin:stage',
		'svgmin:stage'
	]);

	grunt.registerTask('buildApi', [
		'copy:stageApi',
		'clean:distApi',
		'copy:distApi'
	]);

	grunt.registerTask('stageBuildFrontend', [
		'prepareFrontend',
		'copy:stageConfigFrontend',
		'html2js',
		'useminPrepare',
		'concat',
		'ngAnnotate',
		'uglify',
		'cssmin',
		'filerev',
		'usemin',
		'clean:distFrontend',
		'copy:distFrontend'
	]);

	grunt.registerTask('distBuildFrontend', [
		'prepareFrontend',
		'copy:distConfigFrontend',
		'html2js',
		'useminPrepare',
		'concat',
		'ngAnnotate',
		'uglify',
		'cssmin',
		'filerev',
		'usemin',
		'clean:distFrontend',
		'copy:distFrontend'
	]);

	grunt.registerTask('prodBuildFrontend', [
		'prepareFrontend',
		'copy:prodConfigFrontend',
		'copy:prodRobotsFrontend',
		'html2js',
		'useminPrepare',
		'concat',
		'ngAnnotate',
		'uglify',
		'cssmin',
		'filerev',
		'usemin',
		'clean:distFrontend',
		'copy:distFrontend'
	]);

	function configRename(dest) {
		return dest + 'config.js';
	}

	function robotsRename(dest) {
		return dest + 'robots.txt';
	}

	// Used for delaying livereload until after server has restarted
  grunt.registerTask('wait', function () {
    grunt.log.ok('Waiting for server reload...');

    var done = this.async();

    setTimeout(function () {
      grunt.log.writeln('Done waiting!');
      done();
    }, 1500);
  });

};