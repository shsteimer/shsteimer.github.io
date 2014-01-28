module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: [ 'static' ],
        recess: {
            dev: {
                options: {
                    compile: true
                },
                files: {
                    'static/css/shsteimer.css': ['_static/less/shsteimer.less']
                }
    	    },
    		dist: {
                options: {
                    compress: true
                },
                files: {
                    'static/css/shsteimer.min.css': ['_static/less/shsteimer.less']
                }
    	    }
        },
        uglify: {
            dist: {
                options: {
                    mangle: true
                },
                files: {
                    'static/js/shsteimer.min.js': ['_static/js/shsteimer.js']
                }
            }
        },
        copy: {
            exec: {
                files: [
                    {expand: true, cwd: '_static/', src: ['img/*'], dest: 'static/'},
                    {expand: true, cwd: '_static/', src: ['js/*.js'], dest: 'static/'},
                ]    
            }
        },
        jekyll: {  
            dev: {
                options: {
                    drafts: true,
                    config: '_config.yml,_config-dev.yml',
                    serve: true
                }
            },
            dist: {
                options: {
                    safe: true,
                    serve: true
                }
            }
        }
    });

    // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-recess');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-jekyll');

    // register tasks
    grunt.registerTask('default', ['clean','recess','uglify','copy']);
    grunt.registerTask('serve-dev', ['clean','recess','uglify','copy','jekyll:dev']);
    grunt.registerTask('serve-prod', ['clean','recess','uglify','copy','jekyll:dist']);
};