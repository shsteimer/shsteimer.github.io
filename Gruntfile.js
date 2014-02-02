module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        clean: [ 'static' ],
        less: {
            dev: {
                files: {
                    'static/css/shsteimer.css': ['_static/less/shsteimer.less']
                }
    	    },
    		dist: {
                options: {
                    cleancss: true
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
                    'static/js/shsteimer.min.js': [
                        '_static/bootstrap-3.1.0/js/transition.js',
                        '_static/bootstrap-3.1.0/js/alert.js',
                        '_static/bootstrap-3.1.0/js/button.js',
                        '_static/bootstrap-3.1.0/js/carousel.js',
                        '_static/bootstrap-3.1.0/js/collapse.js',
                        '_static/bootstrap-3.1.0/js/dropdown.js',
                        '_static/bootstrap-3.1.0/js/modal.js',
                        '_static/bootstrap-3.1.0/js/tooltip.js',
                        '_static/bootstrap-3.1.0/js/popover.js',
                        '_static/bootstrap-3.1.0/js/scrollspy.js',
                        '_static/bootstrap-3.1.0/js/tab.js',
                        '_static/bootstrap-3.1.0/js/affix.js',
                        '_static/js/shsteimer.js'
                    ]
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
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-jekyll');

    // register tasks
    grunt.registerTask('default', ['clean','less','uglify','copy']);
    grunt.registerTask('serve-dev', ['clean','less','uglify','copy','jekyll:dev']);
    grunt.registerTask('serve-prod', ['clean','less','uglify','copy','jekyll:dist']);
};