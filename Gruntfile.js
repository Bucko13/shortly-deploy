module.exports = function(grunt) {

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      options: {
        separator: ';\n',
      },
      js: {
        src: ['public/lib/*.js', 'public/client/*.js'],
        dest: 'public/dist/<%= pkg.name %>.js',
      },
      css: {
        src: ['public/styles/*.css'],
        dest: 'public/dist/main.css',
      } 

    },

    clean: ['public/dist'],

    mochaTest: {
      test: {
        options: {
          reporter: 'spec'
        },
        src: ['test/**/*.js']
      }
    },

    nodemon: {
      dev: {
        script: 'server.js'
      }
    },

    gitpush: {
      live: {
        options: {
          remote: 'live',
          branch: 'master'
        }
      }
    },

    uglify: {
      my_target: {
        files: {
          'public/dist/<%= pkg.name %>.min.js': ['public/dist/<%= pkg.name %>.js']
        }
      }
    },

    eslint: {
      target: [
        'public/*.js', 'app/*.js', 'db/*.js', 'lib/*.js', // Add list of files to lint here
      ]
    },

    cssmin: {
      target: {
        files: [{
          expand: true,
          cwd: 'public/dist',
          src: ['*.css', '!*.min.css'],
          dest: 'public/dist',
          ext: '.min.css'
        }]
      }
    },

    watch: {
      scripts: {
        files: [
          'public/client/**/*.js',
          'public/lib/**/*.js',
          'public/app/**/*.js'
        ],
        tasks: [
          'concat',
          'uglify'
        ]
      },
      css: {
        files: 'public/**/*.css',
        tasks: ['cssmin']
      }
    },

    shell: {
      prodServer: {
      }
    },
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-eslint');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-git');

  grunt.registerTask('server-dev', function (target) {
    // Running nodejs in a different process and displaying output on the main console
    var nodemon = grunt.util.spawn({
      cmd: 'grunt',
      grunt: true,
      args: 'nodemon'
    });
    nodemon.stdout.pipe(process.stdout);
    nodemon.stderr.pipe(process.stderr);

    grunt.task.run([ 'watch' ]);
  });


  // grunt.registerTask('upload', function(n) {
  //   if (grunt.option('prod')) {
  //     grunt.task.run(['gitpush']);
  //     // add your production server task here
  //   }
  //   grunt.task.run([ 'server-dev' ]);
  // });

  ////////////////////////////////////////////////////
  // Main grunt tasks
  ////////////////////////////////////////////////////

  grunt.registerTask('test', [
    'mochaTest'
  ]);

  grunt.registerTask('build', [ 
    'clean', 'eslint', 'test', 'concat', 'cssmin', 'uglify'
  ]);

  grunt.registerTask('upload', function(n) {
    if (grunt.option('prod')) {
      grunt.task.run(['gitpush']);

      // add your production server task here
    } else {
      grunt.task.run([ 'server-dev' ]);
    }
  });

  grunt.registerTask('deploy', [
    'build', 'upload'// add your deploy tasks here
  ]);

};
