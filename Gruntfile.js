module.exports = function(grunt) {
  "use strict";

  var timestamp = Date.now(),
      builtScriptName = 'app-' + timestamp + '.js',
      builtScript = 'build/' + builtScriptName;

  var jsFiles = [
    'bower_components/underscore/underscore.js', 'js/raf_polyfill.js',
    'js/inherits.js', 'js/moving_object.js', 'js/asteroid.js',
    'js/asteroid_pool.js', 'js/bullet.js', 'js/bullet_pool.js',
    'js/ship.js', 'js/game.js', 'js/game_ui.js', 'js/main.js'
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
          'styles.css',
          'vendor/**'
        ],
        dest: 'build/'
      }
    },
    processhtml: {
      options: {
        data: {
          appFile: builtScriptName
        }
      },
      build: {
        files: {
          'build/index.html': ['index.html']
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
  grunt.loadNpmTasks('grunt-processhtml');

  grunt.registerTask('build', [
    'clean', 'copy:build', 'uglify:build', 'processhtml:build'
  ]);
};
