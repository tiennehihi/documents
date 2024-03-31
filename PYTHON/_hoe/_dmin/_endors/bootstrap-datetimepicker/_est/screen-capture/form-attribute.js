module.exports = function(grunt) {

	grunt.initConfig({

		pkg: grunt.file.readJSON('package.json'),

		cfg: {
			filename: 'easypiechart',
			vanillaExportName: 'EasyPieChart'
		},

		dirs: {
			tmp: 'tmp',
			src: 'src',
			dest: 'dist',
			docs: 'docs',
			test: 'test',
			demo: 'demo'
		},

		clean: {
			all: ['<%= dirs.dest %>/', '<%= dirs.tmp %>/'],
			tmp: ['<%= dirs.tmp %>/']
		},

		concat: {
			vanilla: {
				src: [
					'<%= dirs.src %>/renderer/canvas.js',
					'<%= dirs.src %>/<%= cfg.filename %>.js'
				],
				dest: '<%= dirs.tmp %>/<%= cfg.filename %>.js'
			},
			jquery: {
				src: [
					'<%= dirs.src %>/renderer/canvas.js',
					'<%= dirs.src %>/<%= cfg.filename %>.js',
					'<%= dirs.src %>/jquery.plugin.js'
				],
				dest: '<%= dirs.tmp %>/jquery.<%= cfg.filename %>.js'
			},
			angular: {
				src: [
					'<%= dirs.src %>/angular.directive.js',
					'<%= dirs.src %>/renderer/canvas.js',
					'<%= dirs.src %>/<%= cfg.filename %>.js'
				],
				dest: '<%= dirs.tmp %>/angular.<%= cfg.filename %>.js'
			}
		},

		usebanner: {
			options: {
				position: 'top',
				banner: '/**!\n' +
						' * <%= pkg.name %>\n' +
						' * <%= pkg.description %>\n' +
						' *\n' +
						' * @license <%= pkg.license %>\n'+
						' * @author <%= pkg.author.name %> <<%= pkg.author.email %>> (<%= pkg.author.url %>)\n' +
						' * @version <%= pkg.version %>\n' +
						' **/\n'
			},
			files: {
				src: [
					'<%= dirs.dest %>/<%= cfg.filename %>.js',
					'<%= dirs.dest %>/jquery.<%= cfg.filename %>.js',
					'<%= dirs.dest %>/angular.<%= cfg.filename %>.js'
				]
			}
		},

		uglify: {
			dist: {
			