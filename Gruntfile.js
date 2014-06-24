module.exports = function(grunt) {
  "use strict";

  var timestamp = Date.now(),
      builtScript = 'build/app-' + timestamp + '.js';

  var jsFiles = [
    'bower_components/underscore/underscore.js', 'js/raf_polyfill.js',
    'js/inherits.js', 'js/moving_object.js', 'js/asteroid.js',
    'js/asteroid_pool.js', 'js/bullet.js', 'js/bullet_pool.js',
    'js/ship.js', 'js/game.js', 'js/game_ui.js'
  ];
  var uglifyFiles = {};
  uglifyFiles[builtScript] = jsFiles;

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
          'build/index.html': [builtScript]
        }
      }
    },
    uglify: {
      build: {
        files: uglifyFiles
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
