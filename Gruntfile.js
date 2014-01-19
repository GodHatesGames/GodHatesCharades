'use strict';
module.exports = function(grunt) {

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
				tasks: ['nodemon:dev'],
				options: {
					logConcurrentOutput: true
				}
			}
		},
		clean: {
			distApi: 'dist/api',
			distFrontend: 'dist/frontend',
			stageApi: '.tmp/stage/api',
			stageFrontend: '.tmp/stage/frontend'
		},
		useminPrepare: {
			html: '.tmp/stage/frontend/index.html',
			options: {
				dest: '.tmp/stage/frontend'
			}
		},
		copy: {
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
						// Match all files except alt-config files
						src: ['**', '!js/config_*.js'],
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
						src: ['**'],
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
				mangle: false
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
		}
	});

	// Load the plugin that provides the "uglify" task.
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

	grunt.registerTask('prod', [
		'prodBuildApi',
		'prodBuildFrontend'
	]);

	grunt.registerTask('dev', [
		'concurrent:dev'
	]);

	grunt.registerTask('dist', [
		'distBuildApi',
		'distBuildFrontend',
		'concurrent:dist'
	]);

	// grunt.registerTask('build', [
	// 	'distBuildApi',
	// 	'distBuildFrontend'
	// ]);

	grunt.registerTask('prepareApi', [
		'clean:stageApi',
		'copy:stageApi'
	]);
	grunt.registerTask('prepareFrontend', [
		'bower',
		'clean:stageFrontend',
		'copy:stageFrontend'
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
		'useminPrepare',
		'concat',
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
		'useminPrepare',
		'concat',
		'uglify',
		'cssmin',
		'usemin',
		'clean:distFrontend',
		'copy:distFrontend'
	]);

	function configRename(dest, src) {
		return dest + 'config.js';
	}

};