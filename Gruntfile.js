module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-shell');
  grunt.loadNpmTasks('grunt-bower');

  grunt.initConfig({
    // Move Bower compnents to better location
    bower: {
      dev: {
        dest: 'js/lib/',
        options: {
          keepExpandedHierarchy: false
        }
      }
    },

    // Update Bower packages
    shell: {
        bower: {
            command: 'bower update'
        }
    }
  });

  grunt.registerTask('default', [
    'shell',
    'bower'
    ]);
};