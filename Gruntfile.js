'use strict';
module.exports = function(grunt) {

	// Load the plugin that provides the 'uglify' task.
	grunt.loadNpmTasks('grunt-usemin');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-cssmin');
	grunt.loadNpmTasks('grunt-bower-task');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-nodemon');
	grunt.loadNpmTasks('grunt-concurrent');
	grunt.loadNpmTasks('grunt-filerev');
	grunt.loadNpmTasks('grunt-angular-templates');
	grunt.loadNpmTasks('grunt-ngmin');
	grunt.loadNpmTasks('grunt-contrib-less');
	grunt.loadNpmTasks('grunt-svgmin');
	grunt.loadNpmTasks('grunt-contrib-imagemin');

	// Project configuration.
	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		bower: {
			install: {
				//just run 'grunt bower:install' and you'll see files from your Bower packages in lib directory
			}
		},
		nodemon: {
			dist: {
				options: {
					file: 'dist/api/server.js',
					nodeArgs: ['--debug'],
					watchedExtensions: ['js'],
					watchedFolders: ['dist/api'],
					env: {
						PORT: 3000
					}
				}
			},
			dev: {
				options: {
					file: 'api/server.js',
					nodeArgs: ['--debug'],
					watchedExtensions: ['js'],
					watchedFolders: ['api'],
					env: {
						PORT: 4000
					}
				}
			}
		},
		watch: {
			distApi: {
				files: ['api/**/*.js'],
				tasks: ['distBuildApi']
			},
			distFrontend: {
				files: ['frontend/**/*.js', 'frontend/**/*.css', 'frontend/**/*.html'],
				tasks: ['distBuildFrontend']
			},
			bootstrap: {
				files: ['frontend/less/bootstrap-variables.less'],
				tasks: ['buildBootstrap']
			},
			main: {
				files: ['frontend/less/main.less'],
				tasks: ['less:main']
			}
		},
		concurrent: {
			dist: {
				tasks: ['nodemon:dist', 'watch:distApi', 'watch:distFrontend'],
				options: {
					logConcurrentOutput: true
				}
			},
			dev: {
				tasks: ['nodemon:dev', 'watch:bootstrap', 'watch:main'],
				options: {
					logConcurrentOutput: true
				}
			}
		},
		clean: {
			distApi: 'dist/api',
			distFrontend: 'dist/frontend',
			stage: '.tmp',
			bootstrap: 'frontend/bower_components/bootstrap/less/variables.less'
		},
		useminPrepare: {
			html: '.tmp/stage/frontend/index.html',
			options: {
				dest: '.tmp/stage/frontend'
			}
		},
		copy: {
			// Bootstrap Less
			bootstrap: {
				files: [
					{
						expand: true,
						cwd: 'frontend/less/',
						src: 'bootstrap-variables.less',
						dest: 'frontend/bower_components/bootstrap/less/',
						rename: function(dest) {return dest + 'variables.less';}
					}
				]
			},
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
						// Match all files except alt-config files and svg
						src: ['**', '!js/config**', '!img'],
						dest: '.tmp/stage/frontend/'
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
							'index.html',
							'*.*'
						],
						dest: 'dist/frontend/'
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
				mangle: true
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
		ngtemplates: {
			app: {
				cwd: '.tmp/stage/frontend',
				src: [
					'components/**.html',
					'views/**.html',
				],
				dest: '.tmp/stage/frontend/js/templates.js',
				options: {
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
				}
			}
		},
		ngmin: {
			app: {
				src: '.tmp/concat/js/app.js',
				dest: '.tmp/concat/js/app.js'
			}
		},
		less: {
			bootstrap: {
				options: {
					sourceMap: true,
					sourceMapFilename: 'frontend/css/bootstrap.css.map', // where file is generated and located
					sourceMapURL: '/css/bootstrap.css.map',
					sourceMapBasepath: 'frontend',
					sourceMapRootpath: '/'
				},
				files: {
					'frontend/css/bootstrap.css': 'frontend/bower_components/bootstrap/less/bootstrap.less'
				}
			},
			main: {
				options: {
					sourceMap: true,
					sourceMapFilename: 'frontend/css/main.css.map',
					sourceMapURL: '/css/main.css.map',
					sourceMapBasepath: 'frontend',
					sourceMapRootpath: '/'
				},
				files: {
					'frontend/css/main.css': 'frontend/less/main.less'
				}
			}
		},
		svgmin: {
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
		}
	});

	grunt.registerTask('prod', [
		'clean:stage',
		'prodBuildApi',
		'prodBuildFrontend'
	]);

	grunt.registerTask('dev', [
		'buildDev',
		'concurrent:dev'
	]);

	grunt.registerTask('dist', [
		'clean:stage',
		'distBuildApi',
		'distBuildFrontend',
		'concurrent:dist'
	]);

	// grunt.registerTask('build', [
	// 	'distBuildApi',
	// 	'distBuildFrontend'
	// ]);

	grunt.registerTask('buildDev', [
		'buildBootstrap',
		'less:main'
	]);

	grunt.registerTask('buildBootstrap', [
		'clean:bootstrap',
		'copy:bootstrap',
		'less:bootstrap'
	]);

	grunt.registerTask('prepareApi', [
		'copy:stageApi'
	]);
	grunt.registerTask('prepareFrontend', [
		'bower',
		'copy:stageFrontend',
		'imagemin:stage',
		'svgmin:stage'
	]);

	grunt.registerTask('distBuildApi', [
		'prepareApi',
		'clean:distApi',
		'copy:distApi'
	]);

	grunt.registerTask('prodBuildApi', [
		'prepareApi',
		'clean:distApi',
		'copy:distApi'
	]);

	grunt.registerTask('distBuildFrontend', [
		'prepareFrontend',
		'copy:distConfigFrontend',
		'ngtemplates',
		'useminPrepare',
		'concat',
		'ngmin',
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
		'ngtemplates',
		'useminPrepare',
		'concat',
		'ngmin',
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

};