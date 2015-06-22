module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-bower');

  grunt.initConfig({
    bower: {
      dev: {
        dest: 'js/lib/',
        options: {
          keepExpandedHierarchy: false
        }
      }
    }
  });

  grunt.registerTask('default', [
    'bower'
    ]);
};