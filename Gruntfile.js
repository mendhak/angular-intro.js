module.exports = function (grunt) {

    grunt.loadNpmTasks('grunt-contrib-connect');
    grunt.loadNpmTasks("grunt-tslint");
    grunt.loadNpmTasks('grunt-ts');

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
        },
        pkg: grunt.file.readJSON('package.json'),
        ts: {
            default: {
                src: ["src/**/*.ts", "!node_modules/**"],
                options: {
                    module: "amd",
                    moduleResolution: "node",
                    declaration: true,
                    compiler: './node_modules/typescript/bin/tsc'
                },
                tsconfig: 'tsconfig.json',
            }
        },
        uglify: {
            options: {
                banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */\n',
                sourceMap: true
            },
            build: {
                src: ['src/ng-intro.component.js'],
                dest: 'build/angular-intro.min.js'
            }
        },
        tslint: {
            options: {
                configuration: "tslint.json",
                force: false,
                fix: false
            },
            files: {
                src: [
                    "src/ng-intro.component.ts"
                ]
            }
        },
        watch: {
            scripts: {
                files: 'src/*.ts',
                tasks: ['ts', 'tslint', 'uglify'],
                options: {
                    interrupt: true
                }
            },
            gruntfile: {
                files: 'Gruntfile.js'
            }
        }
    });

    // Load all grunt tasks
    require('load-grunt-tasks')(grunt);

    // Default task(s).
    grunt.registerTask('default', ['ts', 'tslint', 'uglify']);

    // Test
    grunt.registerTask('test', ['tslint']);
};
