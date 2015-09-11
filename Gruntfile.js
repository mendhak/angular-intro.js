module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-contrib-connect');


    // Project configuration.
    grunt.initConfig({


        connect: {
            server: {
                options: {
                port: 8000,
                base: '.',
                keepalive: true
                }
            }
        }

        ,

        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
            },
            build: {
                src: 'src/angular-intro.js',
                dest: 'build/angular-intro.min.js'
            }
        },
        jshint: {
            lib: {
                options: {},
                src: ['src/*.js']
            },
        },
        watch: {
            scripts: {
                files: 'src/*.js',
                tasks: ['jshint', 'uglify'],
                options: {
                    interrupt: true
                },
            },
            gruntfile: {
                files: 'Gruntfile.js'
            }
        },
    });

    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // Default task(s).
    grunt.registerTask('default', ['jshint', 'uglify']);
    
    // Test
    grunt.registerTask('test', ['jshint']);
};
