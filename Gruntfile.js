module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        recess: {
            dev: {
                options: {
                    compile: true
                },
                files: {'static/css/shsteimer.css': ['_static/less/shsteimer.less']}
    		    },
    		    dist: {
                options: {
                    compress: true
                },
                files: {'static/css/shsteimer.min.css': ['_static/less/shsteimer.less']}
    		    }
        },
        uglify: {
            dist: {
                options: {
                    mangle: true
                },
                files: {
                    'static/js/shsteimer.min.js': ['static/js/shsteimer.js']
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-recess');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    // Default task(s).
    grunt.registerTask('default', ['recess','uglify']);
};