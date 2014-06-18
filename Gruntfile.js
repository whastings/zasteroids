module.exports = function(grunt) {
  "use strict";
  grunt.initConfig({
    clean: {
      build: {
        src: ['build/**/*']
      }
    },
    copy: {
      build: {
        expand: true,
        src: [
          'images/**',
          'index.html',
          'styles.css'
        ],
        dest: 'build/'
      }
    },
    injector: {
      options: {
        addRootSlash: false,
        transform: function(filepath, index, numFiles) {
          filepath = filepath.replace(/build\//, '');
          return '<script src="' + filepath + '"></script>';
        }
      },
      local_dependencies: {
        files: {
          'build/index.html': ['build/app.js']
        }
      }
    },
    uglify: {
      build: {
        files: {
          'build/app.js': [
            'bower_components/underscore/underscore.js',
            'js/inherits.js', 'js/moving_object.js', 'js/asteroid.js',
            'js/asteroid_pool.js', 'js/bullet.js', 'js/ship.js',
            'js/game.js', 'js/game_ui.js'
          ]
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-injector');

  grunt.registerTask('build', [
    'clean', 'copy:build', 'uglify:build', 'injector'
  ]);
};
