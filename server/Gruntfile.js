module.exports = function (grunt) {
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-clean');
	grunt.loadNpmTasks('grunt-contrib-copy');
	grunt.loadNpmTasks('grunt-mocha-test');

	var taskConfig = {
			pkg: grunt.file.readJSON("package.json"),

			/**
			 * `jshint` defines the rules of our linter as well as which files we
			 * should check. This file, all javascript sources, and all our unit tests
			 * are linted based on the policies listed in `options`. But we can also
			 * specify exclusionary patterns by prefixing them with an exclamation
			 * point (!); this is useful when code comes from a third party but is
			 * nonetheless inside `src/`.
			 */
			jshint: {
				src: [ 'lib/**/*.js', '!lib/**/*.spec.js' ],
				test: [ 'lib/**/*.spec.js' ],
				gruntfile: [
					'Gruntfile.js'
				],
				options: {
					force: true,
					jshintrc: 'lib/.jshintrc'
				}
			},

			clean: [
				'build'
			],

			copy: {
				files: {
					expand: true,
					dest: 'build',
					src: [
						'package.json',
						'server.js',
						'app.js',
						'lib/**/*.js',
						'!lib/**/*.spec.js'
					]
				}
			},

			mochaTest: {
				options: {
					reporter: 'spec',
					clearRequireCache: true
				},
				src: [ 'lib/**/*.spec.js' ]
			},

			/**
			 * And for rapid development, we have a watch set up that checks to see if
			 * any of the files listed below change, and then to execute the listed
			 * tasks when they do. This just saves us from having to type "grunt" into
			 * the command-line every time we want to see what we're working on; we can
			 * instead just leave "grunt watch" running in a background terminal. Set it
			 * and forget it, as Ron Popeil used to tell us.
			 *
			 * But we don't need the same thing to happen for all the files.
			 */
			watch: {
				/**
				 * By default, we want the Live Reload to work for all tasks; this is
				 * overridden in some tasks (like this file) where browser resources are
				 * unaffected. It runs by default on port 35729, which your browser
				 * plugin should auto-detect.
				 */
				options: {
					livereload: 35730
				},

				/**
				 * When the Gruntfile changes, we just want to lint it. In fact, when
				 * your Gruntfile changes, it will automatically be reloaded!
				 */
				gruntfile: {
					files: 'Gruntfile.js',
					tasks: [ 'jshint:gruntfile' ],
					options: {
						livereload: false
					}
				},
				/**
				 * When our JavaScript source files change, we want to run lint them and
				 * run our unit tests.
				 */
				jssrc: {
					files: [ 'lib/**/*.js' ],
					tasks: [ 'jshint:src', 'mochaTest' ]
				}
			}
		}
		;

	grunt.initConfig(grunt.util._.extend(taskConfig));

	// On watch events, if the changed file is a test file then configure mochaTest to only
	// run the tests from that file. Otherwise run all the tests
	var defaultTestSrc = grunt.config('mochaTest.src');
	grunt.event.on('watch', function(action, filepath) {
		grunt.config('mochaTest.src', defaultTestSrc);
		//if (filepath.match('lib/')) {
			grunt.config('mochaTest.src', filepath);
		//}
	});

	grunt.registerTask('test', ['mochaTest']);

	grunt.registerTask('build', [
		'jshint',
		'test',
		'clean',
		'copy'
	]);
}
;