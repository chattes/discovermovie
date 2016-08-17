module.exports = function(grunt){


	grunt.initConfig({
		pkg: grunt.file.readJSON('package.json'),
		jshint:{
		
			//define the files to lint
			files: ['Gruntfile.js','controllers/**/*.js']
		},
		watch:{
		
			files: ['<%= jshint.files'],
			tasks:['jshint']
		}
	});
	grunt.loadNpmTasks('grunt-contrib-jshint');
	grunt.loadNpmTasks('grunt-contrib-watch');
	grunt.registerTask('check',['jshint']);
	

};
